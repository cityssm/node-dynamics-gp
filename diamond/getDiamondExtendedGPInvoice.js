import { _mssqlConfig, cacheTTL } from '../config.js';
import * as sqlPool from '@cityssm/mssql-multi-pool';
import * as gp from '../gp.js';
import Debug from 'debug';
const debug = Debug('dynamics-gp:diamond:getTrialBalanceCodeByInvoiceNumber');
import NodeCache from 'node-cache';
const trialBalanceCodeCache = new NodeCache({ stdTTL: cacheTTL });
export async function extendGPInvoice(gpInvoice) {
    var _a;
    const diamondInvoice = gpInvoice;
    let trialBalanceCode = (_a = trialBalanceCodeCache.get(diamondInvoice.invoiceNumber)) !== null && _a !== void 0 ? _a : undefined;
    if (trialBalanceCode === undefined &&
        !trialBalanceCodeCache.has(diamondInvoice.invoiceNumber)) {
        try {
            const pool = await sqlPool.connect(_mssqlConfig);
            const tbcResult = await pool
                .request()
                .input('invoiceNumber', gpInvoice.invoiceNumber).query(`SELECT
          t.dCUSTTBCODE as trialBalanceCode,
          t.dDESC as trialBalanceCodeDescription
          FROM [SF120] i
          inner join SF023 t on i.dcusttbcode = t.dcusttbcode
          where docnumbr = @invoiceNumber`);
            if (tbcResult.recordset && tbcResult.recordset.length > 0) {
                trialBalanceCode = tbcResult.recordset[0];
            }
            trialBalanceCodeCache.set(diamondInvoice.invoiceNumber, trialBalanceCode);
        }
        catch (error) {
            debug('Query Error: Check your database credentials.');
            debug(error);
            throw error;
        }
    }
    else {
        debug(`Cache hit: ${diamondInvoice.invoiceNumber}`);
    }
    debug(trialBalanceCode);
    if (trialBalanceCode !== undefined) {
        diamondInvoice.trialBalanceCode = trialBalanceCode.trialBalanceCode;
        diamondInvoice.trialBalanceCodeDescription =
            trialBalanceCode.trialBalanceCodeDescription;
    }
    return diamondInvoice;
}
export async function getDiamondExtendedGPInvoice(invoiceNumber, invoiceDocumentTypeOrAbbreviationOrName) {
    if (!gp.hasMSSQLConfig()) {
        gp.setMSSQLConfig(_mssqlConfig);
    }
    const gpInvoice = await gp.getInvoiceByInvoiceNumber(invoiceNumber, invoiceDocumentTypeOrAbbreviationOrName);
    let diamondInvoice = gpInvoice;
    if (diamondInvoice) {
        diamondInvoice = await extendGPInvoice(gpInvoice);
    }
    return diamondInvoice;
}
export function clearCaches() {
    trialBalanceCodeCache.flushAll();
}
export default getDiamondExtendedGPInvoice;
