import { type mssql, connect } from '@cityssm/mssql-multi-pool'

import type { DiamondTaxedProperty } from './types.js'

/**
 * Retrieves a taxed property from the Diamond database by its roll number.
 * @param mssqlConfig - The configuration for the SQL Server connection.
 * @param rollNumber - The roll number of the taxed property to retrieve.
 * @returns A promise that resolves to the taxed property, or undefined if not found.
 */
export default async function _getTaxedPropertyByRollNumber(
  mssqlConfig: mssql.config,
  rollNumber: number | string
): Promise<DiamondTaxedProperty | undefined> {
  const pool = await connect(mssqlConfig)

  const propertyResult = await pool
    .request()
    .input('rollNumber', rollNumber)
    .query<DiamondTaxedProperty>(/* sql */ `
      SELECT
        TOP (1) rtrim(r.dROLLNMBR) AS rollNumber,
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
      WHERE
        r.dROLLNMBR = @rollNumber
    `)

  return propertyResult.recordset.length > 0
    ? propertyResult.recordset[0]
    : undefined
}
