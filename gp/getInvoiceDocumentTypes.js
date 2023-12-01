import { connect } from '@cityssm/mssql-multi-pool';
export async function _getInvoiceDocumentTypes(mssqlConfig) {
    const pool = await connect(mssqlConfig);
    const result = await pool.request()
        .query(`SELECT DOCTYPE as invoiceDocumentType,
      rtrim(DOCTYABR) as documentTypeAbbreviation,
      rtrim(DOCTYNAM) as documentTypeName
      FROM IVC40101
      order by DEX_ROW_ID`);
    return result.recordset;
}
export default _getInvoiceDocumentTypes;
