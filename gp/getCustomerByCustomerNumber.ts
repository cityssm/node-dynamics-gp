import { _mssqlConfig, cacheTTL, queryErrorMessage } from '../config.js'
import * as sqlPool from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import type { GPCustomer } from './types'

import Debug from 'debug'
const debug = Debug('dynamics-gp:gp:getCustomerByCustomerNumber')

import NodeCache from 'node-cache'
const customerCache = new NodeCache({ stdTTL: cacheTTL })

export async function getCustomerByCustomerNumber(
  customerNumber: string
): Promise<GPCustomer | undefined> {
  let customer: GPCustomer | undefined =
    customerCache.get(customerNumber) ?? undefined

  if (customer === undefined && !customerCache.has(customerNumber)) {
    try {
      const pool = await sqlPool.connect(_mssqlConfig)

      const customerResult: IResult<GPCustomer> = await pool
        .request()
        .input('customerNumber', customerNumber).query(`SELECT
          rtrim([CUSTNMBR]) as customerNumber,
          rtrim([CUSTNAME]) as customerName,
          rtrim([CUSTCLAS]) as customerClass,
          rtrim([CNTCPRSN]) as contactPerson,
          rtrim([STMTNAME]) as statementName,
          rtrim([SHRTNAME]) as shortName,
          rtrim([ADDRESS1]) as address1,
          rtrim([ADDRESS2]) as address2,
          rtrim([ADDRESS3]) as address3,
          rtrim([CITY]) as city,
          rtrim([STATE]) as state,
          rtrim([COUNTRY]) as country,
          rtrim([ZIP]) as zipCode,
          rtrim([PHONE1]) as phoneNumber1,
          rtrim([PHONE2]) as phoneNumber2,
          rtrim([PHONE3]) as phoneNumber3,
          rtrim([FAX]) as faxNumber,
          [CREATDDT] as dateCreated,
          [MODIFDT] as dateModified
          FROM [RM00101]
          where CUSTNMBR = @customerNumber`)

      if (customerResult.recordset && customerResult.recordset.length > 0) {
        customer = customerResult.recordset[0]
      }

      customerCache.set(customerNumber, customer)
    } catch (error) {
      debug(queryErrorMessage)
      throw error
    }
  } else {
    debug(`Cache hit: ${customerNumber}`)
  }

  debug(customer)

  return customer
}

export function clearCustomerCache() {
  customerCache.flushAll()
}

export default getCustomerByCustomerNumber
