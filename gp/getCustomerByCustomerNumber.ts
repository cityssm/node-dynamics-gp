import { connect } from '@cityssm/mssql-multi-pool'
import { type config as MSSQLConfig, type IResult } from 'mssql'

import type { GPCustomer } from './types.js'

export async function _getCustomerByCustomerNumber(
  mssqlConfig: MSSQLConfig,
  customerNumber: string
): Promise<GPCustomer | undefined> {
  let customer: GPCustomer | undefined

  const pool = await connect(mssqlConfig)

  const customerResult: IResult<GPCustomer> = await pool
    .request()
    .input('customerNumber', customerNumber).query(`SELECT top 1
      rtrim(CUSTNMBR) as customerNumber,
      rtrim(CUSTNAME) as customerName,
      rtrim(CUSTCLAS) as customerClass,
      rtrim(CNTCPRSN) as contactPerson,
      rtrim(STMTNAME) as statementName,
      rtrim(SHRTNAME) as shortName,
      rtrim(ADDRESS1) as address1,
      rtrim(ADDRESS2) as address2,
      rtrim(ADDRESS3) as address3,
      rtrim(CITY) as city,
      rtrim(STATE) as state,
      rtrim(COUNTRY) as country,
      rtrim(ZIP) as zipCode,
      rtrim(PHONE1) as phoneNumber1,
      rtrim(PHONE2) as phoneNumber2,
      rtrim(PHONE3) as phoneNumber3,
      rtrim(FAX) as faxNumber,
      CREATDDT as dateCreated,
      MODIFDT as dateModified
      FROM RM00101
      where CUSTNMBR = @customerNumber`)

  if (customerResult.recordset.length > 0) {
    customer = customerResult.recordset[0]
  }

  return customer
}

export default _getCustomerByCustomerNumber
