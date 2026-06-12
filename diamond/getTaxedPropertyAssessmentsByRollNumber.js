import { connect } from '@cityssm/mssql-multi-pool';
export default async function _getTaxedPropertyAssessmentsByRollNumber(mssqlConfig, rollNumber) {
    const pool = await connect(mssqlConfig);
    const propertyResult = await pool
        .request()
        .input('rollNumber', rollNumber)
        .query(`
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
    `);
    return propertyResult.recordset;
}
