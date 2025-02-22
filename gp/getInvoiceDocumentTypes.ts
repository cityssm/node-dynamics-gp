import { connect, type mssql } from '@cityssm/mssql-multi-pool'

import type { GPInvoiceDocumentType } from './types.js'

export async function _getInvoiceDocumentTypes(
  mssqlConfig: mssql.config
): Promise<GPInvoiceDocumentType[]> {
  const pool = await connect(mssqlConfig)

  const result = (await pool.request()
    .query(`SELECT DOCTYPE as invoiceDocumentType,
      rtrim(DOCTYABR) as documentTypeAbbreviation,
      rtrim(DOCTYNAM) as documentTypeName
      FROM IVC40101
      order by DEX_ROW_ID`)) as mssql.IResult<GPInvoiceDocumentType>

  return result.recordset
}

export default _getInvoiceDocumentTypes
