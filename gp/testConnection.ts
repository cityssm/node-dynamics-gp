import { type mssql, connect } from '@cityssm/mssql-multi-pool'

/**
 * Tests the connection to the GP database.
 * @param mssqlConfig - The configuration for the SQL Server connection.
 * @returns A promise that resolves to a boolean indicating the connection status.
 */
export default async function _testConnection(
  mssqlConfig: mssql.config
): Promise<boolean> {
  const pool = await connect(mssqlConfig)

  const result = await pool.request().query(/* sql */ `
    SELECT
      1 AS testConnection
  `)

  return result.recordset.length > 0
}
