import { connect } from '@cityssm/mssql-multi-pool';
export default async function _getCustomerByCustomerNumber(mssqlConfig, customerNumber) {
    const pool = await connect(mssqlConfig);
    const customerResult = await pool
        .request()
        .input('customerNumber', customerNumber)
        .query(`
      SELECT
        TOP 1 rtrim(CUSTNMBR) AS customerNumber,
        rtrim(CUSTNAME) AS customerName,
        rtrim(CUSTCLAS) AS customerClass,
        rtrim(CNTCPRSN) AS contactPerson,
        rtrim(STMTNAME) AS statementName,
        rtrim(SHRTNAME) AS shortName,
        rtrim(ADDRESS1) AS address1,
        rtrim(ADDRESS2) AS address2,
        rtrim(ADDRESS3) AS address3,
        rtrim(CITY) AS city,
        rtrim(STATE) AS state,
        rtrim(COUNTRY) AS country,
        rtrim(ZIP) AS zipCode,
        rtrim(PHONE1) AS phoneNumber1,
        rtrim(PHONE2) AS phoneNumber2,
        rtrim(PHONE3) AS phoneNumber3,
        rtrim(FAX) AS faxNumber,
        CREATDDT AS dateCreated,
        MODIFDT AS dateModified
      FROM
        RM00101
      WHERE
        CUSTNMBR = @customerNumber
    `);
    return customerResult.recordset.length > 0
        ? customerResult.recordset[0]
        : undefined;
}
