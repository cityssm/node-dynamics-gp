import { connect } from '@cityssm/mssql-multi-pool';
export default async function _extendGpInvoice(mssqlConfig, gpInvoice) {
    const diamondInvoice = gpInvoice;
    const pool = await connect(mssqlConfig);
    const tbcResult = (await pool
        .request()
        .input('invoiceNumber', gpInvoice.invoiceNumber).query(`SELECT top 1
      t.dCUSTTBCODE as trialBalanceCode,
      t.dDESC as trialBalanceCodeDescription
      FROM SF120 i
      inner join SF023 t on i.dcusttbcode = t.dcusttbcode
      where docnumbr = @invoiceNumber`));
    const trialBalanceCode = tbcResult.recordset.length > 0 ? tbcResult.recordset[0] : undefined;
    if (trialBalanceCode !== undefined) {
        diamondInvoice.trialBalanceCode = trialBalanceCode.trialBalanceCode;
        diamondInvoice.trialBalanceCodeDescription =
            trialBalanceCode.trialBalanceCodeDescription;
    }
    return diamondInvoice;
}
