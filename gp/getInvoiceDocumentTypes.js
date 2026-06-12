import { connect } from '@cityssm/mssql-multi-pool';
export default async function _getInvoiceDocumentTypes(mssqlConfig) {
    const pool = await connect(mssqlConfig);
    const result = await pool.request().query(`
    SELECT
      DOCTYPE AS invoiceDocumentType,
      rtrim(DOCTYABR) AS documentTypeAbbreviation,
      rtrim(DOCTYNAM) AS documentTypeName
    FROM
      IVC40101
    ORDER BY
      DEX_ROW_ID
  `);
    return result.recordset;
}
