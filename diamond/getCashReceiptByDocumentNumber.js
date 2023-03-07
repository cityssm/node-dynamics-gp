import { _mssqlConfig, documentCacheTTL } from '../config.js';
import * as sqlPool from '@cityssm/mssql-multi-pool';
import { getAccountByAccountIndex } from '../gp/getAccountByAccountIndex.js';
import Debug from 'debug';
const debug = Debug('dynamics-gp:diamond:getCashReceiptByDocumentNumber');
import NodeCache from 'node-cache';
const receiptCache = new NodeCache({ stdTTL: documentCacheTTL });
export async function getCashReceiptByDocumentNumber(documentNumber) {
    var _a, _b;
    if (typeof documentNumber === 'string' && Number.isNaN(Number.parseFloat(documentNumber))) {
        return undefined;
    }
    let receipt = receiptCache.get(documentNumber);
    if (receipt === undefined) {
        try {
            const pool = await sqlPool.connect(_mssqlConfig);
            const receiptResult = await pool
                .request()
                .input('documentNumber', documentNumber).query(`SELECT
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
          where dDOCSUFFIX = @documentNumber`);
            if (receiptResult.recordset && receiptResult.recordset.length > 0) {
                receipt = receiptResult.recordset[0];
            }
            if (receipt !== undefined) {
                const detailsResult = await pool
                    .request()
                    .input('documentNumber', documentNumber).query(`SELECT
            [dSEQNMBR] as sequenceNumber,
            rtrim([dCRACCT]) as accountCode,
            [dAMOUNTOUTSTANDING] as outstandingAmount,
            [dNMBRITEMS] as quantity,
            [dLINEAMOUNT] as lineAmount,
            [dDISCAMOUNT] as discountAmount,
            [dTXAMOUNT] as taxAmount,
            [dAMOUNTPAID] as paidAmount,
            [dPOSTAMOUNT] as postAmount,
            rtrim([dCRDTLDESC]) as description
            FROM [CR30102]
            where dDOCSUFFIX = @documentNumber
            order by dSEQNMBR`);
                receipt.details = (_a = detailsResult.recordset) !== null && _a !== void 0 ? _a : [];
                const distributionResult = await pool
                    .request()
                    .input('documentNumber', documentNumber).query(`SELECT
            [dACCTINDEX] as accountIndex,
            rtrim([dQUICKCD]) as accountCode,
            rtrim([dTXDTLID]) as taxDetailCode,
            [dAMOUNTPAID] as paidAmount
            FROM [CR30103]
            where dDOCSUFFIX = @documentNumber
            order by dACCTINDEX, dQUICKCD, dTXDTLID`);
                receipt.distributions = (_b = distributionResult.recordset) !== null && _b !== void 0 ? _b : [];
                for (const distribution of receipt.distributions) {
                    const account = await getAccountByAccountIndex(distribution.accountIndex);
                    if (account !== undefined) {
                        distribution.accountNumber = account.accountNumber;
                        distribution.accountDescription = account.accountDescription;
                    }
                }
            }
            receiptCache.set(documentNumber, receipt);
        }
        catch (error) {
            debug('Query Error: Check your database credentials.');
            debug(error);
            throw error;
        }
    }
    else {
        debug(`Cache hit: ${documentNumber}`);
    }
    debug(receipt);
    return receipt;
}
export function clearCashReceiptCache() {
    receiptCache.flushAll();
}
export default getCashReceiptByDocumentNumber;
