import { connect } from '@cityssm/mssql-multi-pool'
import type { config as MSSQLConfig, IResult } from 'mssql'

import type { GPInvoiceDocumentType } from './types.js'

export async function _getInvoiceDocumentTypes(
  mssqlConfig: MSSQLConfig
): Promise<GPInvoiceDocumentType[]> {
  const pool = await connect(mssqlConfig)

  const result: IResult<GPInvoiceDocumentType> = await pool.request()
    .query(`SELECT DOCTYPE as invoiceDocumentType,
      rtrim(DOCTYABR) as documentTypeAbbreviation,
      rtrim(DOCTYNAM) as documentTypeName
      FROM IVC40101
      order by DEX_ROW_ID`)

  return result.recordset
}

export default _getInvoiceDocumentTypes
