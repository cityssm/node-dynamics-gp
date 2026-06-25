import { connect } from '@cityssm/mssql-multi-pool';
export default async function _getAllTaxedProperties(mssqlConfig, limit = -1, offset = 0) {
    const pool = await connect(mssqlConfig);
    let sql = `
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
  `;
    if (limit > 0) {
        sql += ` OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;
    }
    const propertyResult = await pool.request().query(sql);
    return propertyResult.recordset;
}
