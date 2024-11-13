import { connect, type mssqlTypes } from '@cityssm/mssql-multi-pool'

import _getAccountByAccountIndex from '../gp/getAccountByAccountIndex.js'

import type { DiamondCashReceipt } from './types.js'

export async function _getCashReceiptByDocumentNumber(
  mssqlConfig: mssqlTypes.config,
  documentNumber: number | string
): Promise<DiamondCashReceipt | undefined> {
  if (
    typeof documentNumber === 'string' &&
    Number.isNaN(Number.parseFloat(documentNumber))
  ) {
    return undefined
  }

  const pool = await connect(mssqlConfig)

  const receiptResult = (await pool
    .request()
    .input('documentNumber', documentNumber).query(`SELECT top 1
      0 as isHistorical,
      '' as transactionSource,
      [dDOCSUFFIX] as documentNumber,
      rtrim([BACHNUMB]) as batchNumber,
      rtrim([BCHSOURC]) as batchSource,
      rtrim([dINITIALS]) as initials,
      [dDATE] as documentDate,
      rtrim([dDESC])  as description,
      rtrim([dDESC2]) as description2,
      rtrim([dDESC3]) as description3,
      rtrim([dDESC4]) as description4,
      rtrim([dDESC5]) as description5,
      rtrim([dDESC6]) as description6,
      [dTOTBAL] as totalBalance,
      [dTXAMOUNT] as totalTaxes,
      [dTOTBAL] + [dTXAMOUNT] as total,
      [dCASHAMOUNT] as cashAmount,
      [dCHEQUEAMOUNT] as chequeAmount,
      rtrim([dCHEQUENMBR]) as chequeNumber,
      [dCREDITCARDAMOUNT] as creditCardAmount,
      rtrim([dCREDITCARDNAME]) as creditCardName,
      [dOTHERAMOUNT] as otherAmount,
      [dDATECREATED] as dateCreated,
      [dDATEMODIFIED] as dateModified
      FROM [CR10101]
      where dDOCSUFFIX = @documentNumber
        
      union SELECT top 1
      1 as isHistorical,
      rtrim([dTRXSRC]) as transactionSource,
      [dDOCSUFFIX] as documentNumber,
      rtrim([BACHNUMB]) as batchNumber,
      rtrim([BCHSOURC]) as batchSource,
      rtrim([dINITIALS]) as initials,
      [dDATE] as documentDate,
      rtrim([dDESC])  as description,
      rtrim([dDESC2]) as description2,
      rtrim([dDESC3]) as description3,
      rtrim([dDESC4]) as description4,
      rtrim([dDESC5]) as description5,
      rtrim([dDESC6]) as description6,
      [dTOTBAL] as totalBalance,
      [dTXAMOUNT] as totalTaxes,
      [dTOTREC] as total,
      [dCASHAMOUNT] as cashAmount,
      [dCHEQUEAMOUNT] as chequeAmount,
      rtrim([dCHEQUENMBR]) as chequeNumber,
      [dCREDITCARDAMOUNT] as creditCardAmount,
      rtrim([dCREDITCARDNAME]) as creditCardName,
      [dOTHERAMOUNT] as otherAmount,
      [dDATECREATED] as dateCreated,
      [dDATEMODIFIED] as dateModified
      FROM [CR30101]
      where dDOCSUFFIX = @documentNumber
      
      order by isHistorical`)) as mssqlTypes.IResult<DiamondCashReceipt>

  const receipt =
    receiptResult.recordset.length > 0 ? receiptResult.recordset[0] : undefined

  if (receipt !== undefined) {
    const detailsResult = await pool
      .request()
      .input('documentNumber', documentNumber).query(`SELECT
        dSEQNMBR as sequenceNumber,
        rtrim(dCRACCT) as accountCode,
        dAMOUNTOUTSTANDING as outstandingAmount,
        dNMBRITEMS as quantity,
        dLINEAMOUNT as lineAmount,
        dDISCAMOUNT as discountAmount,
        dTXAMOUNT as taxAmount,
        dAMOUNTPAID as paidAmount,
        dPOSTAMOUNT as postAmount,
        rtrim(dCRDTLDESC) as description
        FROM ${receipt.isHistorical === 1 ? 'CR30102' : 'CR10102'}
        where dDOCSUFFIX = @documentNumber
        order by dSEQNMBR`)

    receipt.details = detailsResult.recordset

    receipt.distributions = []

    if (receipt.isHistorical === 1) {
      const distributionResult = await pool
        .request()
        .input('documentNumber', documentNumber).query(`SELECT
          dACCTINDEX as accountIndex,
          rtrim(dQUICKCD) as accountCode,
          rtrim(dTXDTLID) as taxDetailCode,
          [dAMOUNTPAID] as paidAmount
          FROM CR30103
          where dDOCSUFFIX = @documentNumber
          order by dACCTINDEX, dQUICKCD, dTXDTLID`)

      receipt.distributions = distributionResult.recordset

      for (const distribution of receipt.distributions) {
        const account = await _getAccountByAccountIndex(
          mssqlConfig,
          distribution.accountIndex
        )

        if (account !== undefined) {
          distribution.accountNumber = account.accountNumber
          distribution.accountDescription = account.accountDescription
        }
      }
    }
  }

  return receipt
}

export default _getCashReceiptByDocumentNumber
