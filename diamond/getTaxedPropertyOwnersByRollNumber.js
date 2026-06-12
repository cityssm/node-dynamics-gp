import { connect } from '@cityssm/mssql-multi-pool';
export default async function _getTaxedPropertyOwnersByRollNumber(mssqlConfig, rollNumber) {
    const pool = await connect(mssqlConfig);
    const propertyResult = await pool
        .request()
        .input('rollNumber', rollNumber)
        .query(`
      SELECT
        rtrim(o.CUSTNMBR) AS customerNumber,
        CASE o.dNATYPE
          WHEN 1 THEN 'Primary Owner'
          WHEN 2 THEN 'Mortgage Holder'
          WHEN 3 THEN 'Secondary Owner'
          ELSE 'Unknown'
        END AS ownerType,
        o.dDATECREATED AS ownerDateCreated,
        o.dDATEMODIFIED AS ownerDateModified,
        rtrim(c.CUSTNAME) AS customerName,
        rtrim(c.ADDRESS1) AS address1,
        rtrim(c.ADDRESS2) AS address2,
        rtrim(c.ADDRESS3) AS address3,
        rtrim(c.CITY) AS city,
        rtrim(c.STATE) AS state,
        rtrim(c.COUNTRY) AS country,
        rtrim(c.ZIP) AS zipCode,
        rtrim(c.PHONE1) AS phoneNumber1,
        rtrim(c.PHONE2) AS phoneNumber2,
        rtrim(c.PHONE3) AS phoneNumber3,
        rtrim(c.FAX) AS faxNumber,
        c.CREATDDT AS customerDateCreated,
        c.MODIFDT AS customerDateModified
      FROM
        SF003 o
        LEFT JOIN RM00101 c ON o.CUSTNMBR = c.CUSTNMBR
      WHERE
        o.dROLLNMBR = @rollNumber
    `);
    return propertyResult.recordset;
}
