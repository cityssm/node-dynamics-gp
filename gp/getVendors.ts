import { type mssql, connect } from '@cityssm/mssql-multi-pool'

import type { GPVendor } from './types.js'

export interface GetVendorsFilters {
  vendorId: string

  notVendorClassIds: string[]
  vendorClassIds: string[]

  vendorNameContains: string[]
  vendorNameDoesNotContain: string[]

  lastPurchaseDateMin: Date
}

/**
 * Inquiry > Purchasing > Vendor
 * @param mssqlConfig - The mssql configuration object.
 * @param vendorFilters - Optional filters to apply to the vendor search.
 * @returns The vendor information or undefined if not found.
 */
export default async function _getVendors(
  mssqlConfig: mssql.config,
  vendorFilters?: Partial<GetVendorsFilters>
): Promise<GPVendor[]> {
  const pool = await connect(mssqlConfig)

  const { parameters, whereClause } = buildVendorFiltersWhereClause(
    vendorFilters ?? {}
  )

  const request = pool.request()

  for (const [parameterName, parameterValue] of Object.entries(parameters)) {
    request.input(parameterName, parameterValue)
  }

  const vendorResult = await request.query<GPVendor>(/* sql */ `
    SELECT
      rtrim(v.VENDORID) AS vendorId,
      rtrim(v.VENDNAME) AS vendorName,
      rtrim(v.VNDCHKNM) AS vendorCheckName,
      rtrim(v.VENDSHNM) AS shortName,
      rtrim(v.VNDCNTCT) AS contactPerson,
      rtrim(v.ADDRESS1) AS address1,
      rtrim(v.ADDRESS2) AS address2,
      rtrim(v.ADDRESS3) AS address3,
      rtrim(v.CITY) AS city,
      rtrim(v.STATE) AS state,
      rtrim(v.COUNTRY) AS country,
      rtrim(v.ZIPCODE) AS zipCode,
      CASE
        WHEN replace(v.PHNUMBR1, '0', '') = '' THEN ''
        ELSE rtrim(v.PHNUMBR1)
      END AS phoneNumber1,
      CASE
        WHEN replace(v.PHNUMBR2, '0', '') = '' THEN ''
        ELSE rtrim(v.PHNUMBR2)
      END AS phoneNumber2,
      CASE
        WHEN replace(v.PHONE3, '0', '') = '' THEN ''
        ELSE rtrim(v.PHONE3)
      END AS phoneNumber3,
      CASE
        WHEN replace(v.FAXNUMBR, '0', '') = '' THEN ''
        ELSE rtrim(v.FAXNUMBR)
      END AS faxNumber,
      rtrim(v.COMMENT1) AS comment1,
      rtrim(v.COMMENT2) AS comment2,
      rtrim(v.VNDCLSID) AS vendorClassId,
      v.CREATDDT AS dateCreated,
      v.MODIFDT AS dateModified,
      t.LSTPURDT AS lastPurchaseDate
    FROM
      PM00200 v
      LEFT JOIN PM00201 t ON v.VENDORID = t.VENDORID ${whereClause}
  `)

  return vendorResult.recordset
}

function buildVendorFiltersWhereClause(
  vendorFilters: Partial<GetVendorsFilters>
): {
  parameters: Record<string, unknown>
  whereClause: string
} {
  const whereClauses: string[] = []
  const parameters: Record<string, unknown> = {}

  if (
    vendorFilters.vendorClassIds !== undefined &&
    vendorFilters.vendorClassIds.length > 0
  ) {
    whereClauses.push(
      `v.VNDCLSID IN (${vendorFilters.vendorClassIds
        .map((_, index) => `@vendorClassId${index}`)
        .join(', ')})`
    )

    for (const [
      index,
      vendorClassId
    ] of vendorFilters.vendorClassIds.entries()) {
      parameters[`vendorClassId${index}`] = vendorClassId
    }
  }

  if (
    vendorFilters.notVendorClassIds !== undefined &&
    vendorFilters.notVendorClassIds.length > 0
  ) {
    whereClauses.push(
      `v.VNDCLSID NOT IN (${vendorFilters.notVendorClassIds
        .map((_, index) => `@notVendorClassId${index}`)
        .join(', ')})`
    )

    for (const [
      index,
      notVendorClassId
    ] of vendorFilters.notVendorClassIds.entries()) {
      parameters[`notVendorClassId${index}`] = notVendorClassId
    }
  }

  if (vendorFilters.vendorId !== undefined) {
    whereClauses.push(`v.VENDORID = @vendorId`)
    parameters.vendorId = vendorFilters.vendorId
  }

  if (vendorFilters.vendorNameContains !== undefined) {
    for (const [
      index,
      vendorNameContains
    ] of vendorFilters.vendorNameContains.entries()) {
      whereClauses.push(
        `(v.VENDNAME LIKE '%' + @vendorNameContains${index} + '%' OR
          v.VNDCHKNM LIKE '%' + @vendorNameContains${index} + '%' OR
          v.VENDSHNM LIKE '%' + @vendorNameContains${index} + '%')`
      )
      parameters[`vendorNameContains${index}`] = vendorNameContains
    }
  }

  if (
    vendorFilters.vendorNameDoesNotContain !== undefined &&
    vendorFilters.vendorNameDoesNotContain.length > 0
  ) {
    for (const [
      index,
      vendorNameDoesNotContain
    ] of vendorFilters.vendorNameDoesNotContain.entries()) {
      whereClauses.push(
        `(v.VENDNAME NOT LIKE '%' + @vendorNameDoesNotContain${index} + '%' AND
          v.VNDCHKNM NOT LIKE '%' + @vendorNameDoesNotContain${index} + '%' AND
          v.VENDSHNM NOT LIKE '%' + @vendorNameDoesNotContain${index} + '%')`
      )
      parameters[`vendorNameDoesNotContain${index}`] = vendorNameDoesNotContain
    }
  }

  if (vendorFilters.lastPurchaseDateMin !== undefined) {
    whereClauses.push(`t.LSTPURDT >= @lastPurchaseDateMin`)
    parameters.lastPurchaseDateMin = vendorFilters.lastPurchaseDateMin
  }

  return {
    parameters,
    whereClause:
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''
  }
}
