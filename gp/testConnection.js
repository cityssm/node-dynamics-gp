import { connect } from '@cityssm/mssql-multi-pool';
export default async function _testConnection(mssqlConfig) {
    const pool = await connect(mssqlConfig);
    const result = await pool.request().query(`
    SELECT
      1 AS testConnection
  `);
    return result.recordset.length > 0;
}
