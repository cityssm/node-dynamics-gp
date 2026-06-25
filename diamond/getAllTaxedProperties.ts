import { type mssql, connect } from '@cityssm/mssql-multi-pool'

import type { DiamondTaxedProperty } from './types.js'

/**
 * Retrieves all taxed properties from the Diamond database.
 * @param mssqlConfig - The configuration for the SQL Server connection.
 * @param limit - The maximum number of properties to retrieve. If -1, retrieves all properties.
 * @param offset - The number of properties to skip before starting to retrieve. Defaults to 0.
 * @returns A promise that resolves to an array of taxed properties.
 */
export default async function _getAllTaxedProperties(
  mssqlConfig: mssql.config,
  limit = -1,
  offset = 0
): Promise<DiamondTaxedProperty[]> {
  const pool = await connect(mssqlConfig)

  let sql = /* sql */ `
    SELECT
      rtrim(r.dROLLNMBR) AS rollNumber,
      rtrim(coalesce(a.dMUNADDR1, '')) AS addressUnitQualifier,
      rtrim(coalesce(a.dMUNADDR2, '')) AS addressStreetNumber,
      rtrim(coalesce(a.dMUNADDR3, '')) AS addressStreetName,
      rtrim(l.dLEGAL1) AS legalDescription1,
      rtrim(l.dLEGAL2) AS legalDescription2,
      rtrim(l.dLEGAL3) AS legalDescription3,
      rtrim(l.dLEGAL4) AS legalDescription4,
      rtrim(l.dLEGAL5) AS legalDescription5,
      r.dDATECREATED AS dateCreated,
      r.dDATEMODIFIED AS dateModified
    FROM
      PT001 r
      LEFT JOIN PT003 a ON r.dROLLNMBR = a.dROLLNMBR
      LEFT JOIN PT00103 l ON r.dROLLNMBR = l.dROLLNMBR
    ORDER BY
      r.dROLLNMBR
  `

  if (limit > 0) {
    sql += ` OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`
  }

  const propertyResult = await pool.request().query<DiamondTaxedProperty>(sql)

  return propertyResult.recordset
}
