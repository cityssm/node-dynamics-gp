import { connect } from '@cityssm/mssql-multi-pool'
import type { config as MSSQLConfig, IResult } from 'mssql'

import type { GPVendor } from './types.js'

/**
 * Inquiry > Purchasing > Vendor
 * @param vendorId
 * @returns
 */
export async function _getVendorByVendorId(
  mssqlConfig: MSSQLConfig,
  vendorId: string
): Promise<GPVendor | undefined> {
  let vendor: GPVendor | undefined

  const pool = await connect(mssqlConfig)

  const vendorResult: IResult<GPVendor> = await pool
    .request()
    .input('vendorId', vendorId).query(`SELECT top 1
      rtrim(VENDORID) as vendorId,
      rtrim(VENDNAME) as vendorName,
      rtrim(VNDCHKNM) as vendorCheckName,
      rtrim(VENDSHNM) as shortName,
      rtrim(VNDCNTCT) as contactPerson,
      rtrim(ADDRESS1) as address1,
      rtrim(ADDRESS2) as address2,
      rtrim(ADDRESS3) as address3,
      rtrim(CITY) as city,
      rtrim(STATE) as state,
      rtrim(COUNTRY) as country,
      rtrim(ZIPCODE) as zipCode,
      rtrim(PHNUMBR1) as phoneNumber1,
      rtrim(PHNUMBR2) as phoneNumber2,
      rtrim(PHONE3) as phoneNumber3,
      rtrim(FAXNUMBR) as faxNumber,
      rtrim(COMMENT1) as comment1,
      rtrim(COMMENT2) as comment2,
      CREATDDT as dateCreated,
      MODIFDT as dateModified
      FROM PM00200
      where VENDORID = @vendorId`)

  if (vendorResult.recordset.length > 0) {
    vendor = vendorResult.recordset[0]
  }

  return vendor
}

export default _getVendorByVendorId
