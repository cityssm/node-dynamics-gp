import { type mssql, connect } from '@cityssm/mssql-multi-pool'

import _getAccountByAccountIndex from '../gp/getAccountByAccountIndex.js'

import type { DiamondCashReceipt } from './types.js'

/**
 * Retrieves a cash receipt from the Diamond database by its document number.
 * @param mssqlConfig - The configuration for the SQL Server connection.
 * @param documentNumber - The document number of the cash receipt to retrieve.
 * @returns A promise that resolves to the cash receipt, or undefined if not found.
 */
export default async function _getCashReceiptByDocumentNumber(
  mssqlConfig: mssql.config,
  documentNumber: number | string
): Promise<DiamondCashReceipt | undefined> {
  if (
    typeof documentNumber === 'string' &&
    Number.isNaN(Number.parseFloat(documentNumber))
  ) {
    return undefined
  }

  const pool = await connect(mssqlConfig)

  const receiptResult = await pool
    .request()
    .input('documentNumber', documentNumber)
    .query<DiamondCashReceipt>(/* sql */ `
      SELECT
        TOP 1 0 AS isHistorical,
        '' AS transactionSource,
        [dDOCSUFFIX] AS documentNumber,
        rtrim([BACHNUMB]) AS batchNumber,
        rtrim([BCHSOURC]) AS batchSource,
        rtrim([dINITIALS]) AS initials,
        [dDATE] AS documentDate,
        rtrim([dDESC]) AS description1,
        rtrim([dDESC2]) AS description2,
        rtrim([dDESC3]) AS description3,
        rtrim([dDESC4]) AS description4,
        rtrim([dDESC5]) AS description5,
        rtrim([dDESC6]) AS description6,
        [dTOTBAL] AS totalBalance,
        [dTXAMOUNT] AS totalTaxes,
        [dTOTBAL] + [dTXAMOUNT] AS total,
        [dCASHAMOUNT] AS cashAmount,
        [dCHEQUEAMOUNT] AS chequeAmount,
        rtrim([dCHEQUENMBR]) AS chequeNumber,
        [dCREDITCARDAMOUNT] AS creditCardAmount,
        rtrim([dCREDITCARDNAME]) AS creditCardName,
        [dOTHERAMOUNT] AS otherAmount,
        [dDATECREATED] AS dateCreated,
        [dDATEMODIFIED] AS dateModified
      FROM
        [CR10101]
      WHERE
        dDOCSUFFIX = @documentNumber
      UNION
      SELECT
        TOP 1 1 AS isHistorical,
        rtrim([dTRXSRC]) AS transactionSource,
        [dDOCSUFFIX] AS documentNumber,
        rtrim([BACHNUMB]) AS batchNumber,
        rtrim([BCHSOURC]) AS batchSource,
        rtrim([dINITIALS]) AS initials,
        [dDATE] AS documentDate,
        rtrim([dDESC]) AS description1,
        rtrim([dDESC2]) AS description2,
        rtrim([dDESC3]) AS description3,
        rtrim([dDESC4]) AS description4,
        rtrim([dDESC5]) AS description5,
        rtrim([dDESC6]) AS description6,
        [dTOTBAL] AS totalBalance,
        [dTXAMOUNT] AS totalTaxes,
        [dTOTREC] AS total,
        [dCASHAMOUNT] AS cashAmount,
        [dCHEQUEAMOUNT] AS chequeAmount,
        rtrim([dCHEQUENMBR]) AS chequeNumber,
        [dCREDITCARDAMOUNT] AS creditCardAmount,
        rtrim([dCREDITCARDNAME]) AS creditCardName,
        [dOTHERAMOUNT] AS otherAmount,
        [dDATECREATED] AS dateCreated,
        [dDATEMODIFIED] AS dateModified
      FROM
        [CR30101]
      WHERE
        dDOCSUFFIX = @documentNumber
      ORDER BY
        isHistorical
    `)

  const receipt =
    receiptResult.recordset.length > 0 ? receiptResult.recordset[0] : undefined

  if (receipt !== undefined) {
    const detailsResult = await pool
      .request()
      .input('documentNumber', documentNumber)
      .query(/* sql */ `
        SELECT
          dSEQNMBR AS sequenceNumber,
          rtrim(dCRACCT) AS accountCode,
          dAMOUNTOUTSTANDING AS outstandingAmount,
          dNMBRITEMS AS quantity,
          dLINEAMOUNT AS lineAmount,
          dDISCAMOUNT AS discountAmount,
          dTXAMOUNT AS taxAmount,
          dAMOUNTPAID AS paidAmount,
          dPOSTAMOUNT AS postAmount,
          rtrim(dCRDTLDESC) AS description
        FROM
          ${receipt.isHistorical === 1 ? 'CR30102' : 'CR10102'}
        WHERE
          dDOCSUFFIX = @documentNumber
        ORDER BY
          dSEQNMBR
      `)

    receipt.details = detailsResult.recordset

    receipt.distributions = []

    if (receipt.isHistorical === 1) {
      const distributionResult = await pool
        .request()
        .input('documentNumber', documentNumber)
        .query(/* sql */ `
          SELECT
            dACCTINDEX AS accountIndex,
            rtrim(dQUICKCD) AS accountCode,
            rtrim(dTXDTLID) AS taxDetailCode,
            [dAMOUNTPAID] AS paidAmount
          FROM
            CR30103
          WHERE
            dDOCSUFFIX = @documentNumber
          ORDER BY
            dACCTINDEX,
            dQUICKCD,
            dTXDTLID
        `)

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
