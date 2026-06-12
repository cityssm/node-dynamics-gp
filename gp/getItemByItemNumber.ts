import { type mssql, connect } from '@cityssm/mssql-multi-pool'

import type { GPItemWithQuantities } from './types.js'

/**
 * Inquiry > Inventory > Item
 * @param mssqlConfig - The mssql configuration object.
 * @param itemNumber - The item number to look up.
 * @returns The item information or undefined if not found.
 */
export default async function _getItemByItemNumber(
  mssqlConfig: mssql.config,
  itemNumber: string
): Promise<GPItemWithQuantities | undefined> {
  const pool = await connect(mssqlConfig)

  const itemResult = await pool
    .request()
    .input('itemNumber', itemNumber)
    .query<GPItemWithQuantities>(/* sql */ `
      SELECT
        TOP 1 rtrim(ITEMNMBR) AS itemNumber,
        rtrim(ITEMDESC) AS itemDescription,
        rtrim(ITMSHNAM) AS itemShortName,
        rtrim(ITEMTYPE) AS itemType,
        rtrim(ITMCLSCD) AS itemClassCode,
        rtrim(ITMGEDSC) AS itemGenericDescription,
        STNDCOST AS standardCost,
        CURRCOST AS currentCost,
        CREATDDT AS dateCreated,
        MODIFDT AS dateModified
      FROM
        IV00101
      WHERE
        ITEMNMBR = @itemNumber
    `)

  const item =
    itemResult.recordset.length > 0 ? itemResult.recordset[0] : undefined

  if (item !== undefined) {
    const quantityResults = await pool
      .request()
      .input('itemNumber', itemNumber)
      .query(/* sql */ `
        SELECT
          rtrim(LOCNCODE) AS locationCode,
          rtrim(BINNMBR) AS binNumber,
          rtrim(PRIMVNDR) AS primaryVendorId,
          BGNGQTY AS beginningQuantity,
          LSORDQTY AS lastOrderedQuantity,
          LSTORDDT AS lastOrderedDate,
          rtrim(LSORDVND) AS lastOrderedVendorId,
          LRCPTQTY AS lastReceiptedQuantity,
          LSRCPTDT AS lastReceiptedDate,
          QTYRQSTN AS quantityRequisitioned,
          QTYONORD AS quantityOnOrder,
          QTYBKORD AS quantityBackOrdered,
          QTY_Drop_Shipped AS quantityDropShipped,
          QTYINUSE AS quantityInUse,
          QTYINSVC AS quantityInService,
          QTYRTRND AS quantityReturned,
          QTYDMGED AS quantityDamaged,
          QTYONHND AS quantityOnHand,
          ATYALLOC AS quantityAllocated,
          QTYCOMTD AS quantityCommitted,
          QTYSOLD AS quantitySold,
          dateadd(
            second,
            DATEPART(second, LSTCNTTM),
            dateadd(
              minute,
              DATEPART(minute, LSTCNTTM),
              dateadd(hour, DATEPART(hour, LSTCNTTM), LSTCNTDT)
            )
          ) AS lastCountDateTime,
          dateadd(
            second,
            DATEPART(second, NXTCNTTM),
            dateadd(
              minute,
              DATEPART(minute, NXTCNTTM),
              dateadd(hour, DATEPART(hour, NXTCNTTM), NXTCNTDT)
            )
          ) AS nextCountDateTime
        FROM
          IV00102
        WHERE
          ITEMNMBR = @itemNumber
      `)

    item.quantities = quantityResults.recordset
  }

  return item
}
