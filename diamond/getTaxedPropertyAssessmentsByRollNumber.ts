import { type mssql, connect } from '@cityssm/mssql-multi-pool'

import type { DiamondTaxedPropertyAssessment } from './types.js'

/**
 * Retrieves the assessments of a taxed property from the Diamond database by its roll number.
 * @param mssqlConfig - The configuration for the SQL Server connection.
 * @param rollNumber - The roll number of the taxed property to retrieve assessments for.
 * @returns A promise that resolves to the taxed property assessments.
 */
export default async function _getTaxedPropertyAssessmentsByRollNumber(
  mssqlConfig: mssql.config,
  rollNumber: number | string
): Promise<DiamondTaxedPropertyAssessment[]> {
  const pool = await connect(mssqlConfig)

  const propertyResult = await pool
    .request()
    .input('rollNumber', rollNumber)
    .query<DiamondTaxedPropertyAssessment>(/* sql */ `
      SELECT
        dTXYEAR AS assessmentYear,
        sum(dASSESSVALOTHER) AS assessedValue
      FROM
        PT004
      WHERE
        dROLLNMBR = @rollNumber
      GROUP BY
        dTXYEAR
      ORDER BY
        dTXYEAR
    `)

  return propertyResult.recordset
}
