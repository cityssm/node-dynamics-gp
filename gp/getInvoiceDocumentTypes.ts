import { type mssql, connect } from '@cityssm/mssql-multi-pool'

import type { GPInvoiceDocumentType } from './types.js'

/**
 * Retrieves the invoice document types from the GP database.
 * @param mssqlConfig - The configuration for the SQL Server connection.
 * @returns A promise that resolves to an array of GPInvoiceDocumentType objects.
 */
export default async function _getInvoiceDocumentTypes(
  mssqlConfig: mssql.config
): Promise<GPInvoiceDocumentType[]> {
  const pool = await connect(mssqlConfig)

  const result = await pool.request()
    .query<GPInvoiceDocumentType>(`SELECT DOCTYPE as invoiceDocumentType,
      rtrim(DOCTYABR) as documentTypeAbbreviation,
      rtrim(DOCTYNAM) as documentTypeName
      FROM IVC40101
      order by DEX_ROW_ID`)

  return result.recordset
}
