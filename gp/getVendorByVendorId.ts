import { type mssql, connect } from '@cityssm/mssql-multi-pool'

import type { GPVendor } from './types.js'

/**
 * Inquiry > Purchasing > Vendor
 * @param mssqlConfig - The mssql configuration object.
 * @param vendorId - The vendor ID to look up.
 * @returns The vendor information or undefined if not found.
 */
export default async function _getVendorByVendorId(
  mssqlConfig: mssql.config,
  vendorId: string
): Promise<GPVendor | undefined> {
  const pool = await connect(mssqlConfig)

  const vendorResult = await pool
    .request()
    .input('vendorId', vendorId)
    .query<GPVendor>(`SELECT top 1
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

  return vendorResult.recordset.length > 0
    ? vendorResult.recordset[0]
    : undefined
}

