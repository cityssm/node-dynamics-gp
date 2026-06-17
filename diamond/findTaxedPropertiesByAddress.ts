import { type mssql, connect } from '@cityssm/mssql-multi-pool'
import { getAlternateStreetNameSpellings } from '@cityssm/street-name-normalize'

import type { DiamondTaxedProperty } from './types.js'

/**
 * Retrieves taxed properties from the Diamond database by their address.
 * @param mssqlConfig - The configuration for the SQL Server connection.
 * @param address - The address of the taxed properties to retrieve.
 * @param address.civicNumber - The civic number of the address.
 * @param address.streetName - The street name of the address.
 * @param address.unitNumberOrQualifier - The unit number or qualifier of the address (optional).
 * @param exactMatch - Whether to match the street name or allow alternate spellings.
 * @returns A promise that resolves to an array of taxed properties.
 */
export default async function _findTaxedPropertiesByAddress(
  mssqlConfig: mssql.config,
  address: {
    civicNumber: string
    streetName: string
    unitNumberOrQualifier?: string
  },
  exactMatch = false
): Promise<DiamondTaxedProperty[]> {
  const pool = await connect(mssqlConfig)

  let request = pool.request().input('civicNumber', address.civicNumber)

  let sql = /* sql */ `
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
  `

  const streetNames = exactMatch
    ? [address.streetName]
    : getAlternateStreetNameSpellings(address.streetName)

  const sqlPieces: string[] = []

  for (const [index, streetName] of streetNames.entries()) {
    sqlPieces.push(`a.dMUNADDR3 = @streetName${index}`)
    request = request.input(`streetName${index}`, streetName)
  }

  sql += ` AND (${sqlPieces.join(' OR ')})`

  if ((address.unitNumberOrQualifier ?? '') === '') {
    sql += ` AND (a.dMUNADDR1 = '' OR a.dMUNADDR1 IS NULL)`
  } else {
    sql += ` AND a.dMUNADDR1 = @unitNumberOrQualifier`
    request = request.input(
      'unitNumberOrQualifier',
      address.unitNumberOrQualifier
    )
  }

  sql += ' ORDER BY r.dROLLNMBR'

  const propertyResult = await request.query<DiamondTaxedProperty>(sql)

  const properties = propertyResult.recordset

  for (const property of properties) {
    // Check for matching civic number which may have zero-padding
    if (
      property.addressStreetNumber !==
      address.civicNumber.padStart(property.addressStreetNumber.length, '0')
    ) {
      properties.splice(properties.indexOf(property), 1)
    }
  }

  return properties
}
