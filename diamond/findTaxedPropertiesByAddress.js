import { connect } from '@cityssm/mssql-multi-pool';
import { getAlternateStreetNameSpellings } from '@cityssm/street-name-normalize';
export default async function _findTaxedPropertiesByAddress(mssqlConfig, address, exactMatch = false) {
    const pool = await connect(mssqlConfig);
    let request = pool.request().input('civicNumber', address.civicNumber);
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
    WHERE
      a.dMUNADDR2 LIKE '%' + @civicNumber + '%'
  `;
    const streetNames = exactMatch
        ? [address.streetName]
        : getAlternateStreetNameSpellings(address.streetName);
    const sqlPieces = [];
    for (const [index, streetName] of streetNames.entries()) {
        sqlPieces.push(`a.dMUNADDR3 = @streetName${index}`);
        request = request.input(`streetName${index}`, streetName);
    }
    sql += ` AND (${sqlPieces.join(' OR ')})`;
    if ((address.unitNumberOrQualifier ?? '') === '') {
        sql += ` AND (a.dMUNADDR1 = '' OR a.dMUNADDR1 IS NULL)`;
    }
    else {
        sql += ` AND a.dMUNADDR1 = @unitNumberOrQualifier`;
        request = request.input('unitNumberOrQualifier', address.unitNumberOrQualifier);
    }
    sql += ' ORDER BY r.dROLLNMBR';
    const propertyResult = await request.query(sql);
    const properties = propertyResult.recordset;
    for (const property of properties) {
        if (property.addressStreetNumber !==
            address.civicNumber.padStart(property.addressStreetNumber.length, '0')) {
            properties.splice(properties.indexOf(property), 1);
        }
    }
    return properties;
}
