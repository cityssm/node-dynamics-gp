import { connect } from '@cityssm/mssql-multi-pool';
export default async function _extendGpInvoice(mssqlConfig, gpInvoice) {
    const diamondInvoice = gpInvoice;
    const pool = await connect(mssqlConfig);
    const tbcResult = await pool
        .request()
        .input('invoiceNumber', gpInvoice.invoiceNumber)
        .query(`
      SELECT
        TOP 1 t.dCUSTTBCODE AS trialBalanceCode,
        t.dDESC AS trialBalanceCodeDescription
      FROM
        SF120 i
        INNER JOIN SF023 t ON i.dcusttbcode = t.dcusttbcode
      WHERE
        docnumbr = @invoiceNumber
    `);
    const trialBalanceCode = tbcResult.recordset.length > 0 ? tbcResult.recordset[0] : undefined;
    if (trialBalanceCode !== undefined) {
        diamondInvoice.trialBalanceCode = trialBalanceCode.trialBalanceCode;
        diamondInvoice.trialBalanceCodeDescription =
            trialBalanceCode.trialBalanceCodeDescription;
    }
    return diamondInvoice;
}
