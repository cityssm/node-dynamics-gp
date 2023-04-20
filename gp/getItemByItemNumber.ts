import { _mssqlConfig, cacheTTL, queryErrorMessage } from '../config.js'
import * as sqlPool from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import type { GPItem } from './types'

import Debug from 'debug'
const debug = Debug('dynamics-gp:gp:getItemByItemNumber')

import NodeCache from 'node-cache'
const itemCache = new NodeCache({ stdTTL: cacheTTL })

/**
 * Inquiry > Inventory > Item
 * @param itemNumber
 * @returns
 */
export async function getItemByItemNumber(
  itemNumber: string
): Promise<GPItem | undefined> {
  let item: GPItem | undefined = itemCache.get(itemNumber) ?? undefined

  if (item === undefined && !itemCache.has(itemNumber)) {
    try {
      const pool = await sqlPool.connect(_mssqlConfig)

      const itemResult: IResult<GPItem> = await pool
        .request()
        .input('itemNumber', itemNumber).query(`SELECT top 1
          rtrim(ITEMNMBR) as itemNumber,
          rtrim(ITEMDESC) as itemDescription,
          rtrim(ITMSHNAM) as itemShortName,
          rtrim(ITEMTYPE) as itemType,
          rtrim(ITMGEDSC) as itemGenericDescription,
          STNDCOST as standardCost,
          CURRCOST as currentCost,
          CREATDDT as dateCreated,
          MODIFDT as dateModified
          FROM IV00101
          where ITEMNMBR = @itemNumber`)

      if (itemResult.recordset && itemResult.recordset.length > 0) {
        item = itemResult.recordset[0]
      }

      if (item !== undefined) {
        const quantityResults = await pool
          .request()
          .input('itemNumber', itemNumber).query(`SELECT
            rtrim(LOCNCODE) as locationCode,
            rtrim(BINNMBR) as binNumber,
            rtrim(PRIMVNDR) as primaryVendorId,
            BGNGQTY as beginningQuantity,
            LSORDQTY as lastOrderedQuantity,
            LSTORDDT as lastOrderedDate,
            rtrim(LSORDVND) as lastOrderedVendorId,
            LRCPTQTY as lastReceiptedQuantity,
            LSRCPTDT as lastReceiptedDate,
            QTYRQSTN as quantityRequisitioned,
            QTYONORD as quantityOnOrder,
            QTYBKORD as quantityBackOrdered,
            QTY_Drop_Shipped as quantityDropShipped,
            QTYINUSE as quantityInUse,
            QTYINSVC as quantityInService,
            QTYRTRND as quantityReturned,
            QTYDMGED as quantityDamaged,
            QTYONHND as quantityOnHand,
            ATYALLOC as quantityAllocated,
            QTYCOMTD as quantityCommitted,
            QTYSOLD as quantitySold,
            dateadd(second, DATEPART(second, LSTCNTTM), dateadd(minute, DATEPART(minute, LSTCNTTM), dateadd(hour, DATEPART(hour, LSTCNTTM), LSTCNTDT))) as lastCountDateTime,
            dateadd(second, DATEPART(second, NXTCNTTM), dateadd(minute, DATEPART(minute, NXTCNTTM), dateadd(hour, DATEPART(hour, NXTCNTTM), NXTCNTDT))) as nextCountDateTime
            FROM IV00102
            where ITEMNMBR = @itemNumber`)

        item.quantities = quantityResults.recordset
      }

      itemCache.set(itemNumber, item)
    } catch (error) {
      debug(queryErrorMessage)
      throw error
    }
  } else {
    debug(`Cache hit: ${itemNumber}`)
  }

  debug(item)

  return item
}

export function clearItemCache() {
  itemCache.flushAll()
}

export default getItemByItemNumber
