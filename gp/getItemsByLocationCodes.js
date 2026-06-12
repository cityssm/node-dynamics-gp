import { connect } from '@cityssm/mssql-multi-pool';
export default async function _getItemsByLocationCodes(mssqlConfig, locationCodes = ['']) {
    if (locationCodes.length === 0) {
        return [];
    }
    const pool = await connect(mssqlConfig);
    let itemRequest = pool.request();
    let locationCodeWhere = '';
    for (const [locationCodeIndex, locationCode] of locationCodes.entries()) {
        const parameterName = `locationCode${locationCodeIndex}`;
        if (locationCodeIndex > 0) {
            locationCodeWhere += ' or ';
        }
        locationCodeWhere += `q.LOCNCODE = @${parameterName}`;
        itemRequest = itemRequest.input(parameterName, locationCode);
    }
    const itemResult = await itemRequest.query(`
    SELECT
      rtrim(i.ITEMNMBR) AS itemNumber,
      rtrim(i.ITEMDESC) AS itemDescription,
      rtrim(i.ITMSHNAM) AS itemShortName,
      rtrim(i.ITEMTYPE) AS itemType,
      rtrim(i.ITMCLSCD) AS itemClassCode,
      rtrim(i.ITMGEDSC) AS itemGenericDescription,
      i.STNDCOST AS standardCost,
      i.CURRCOST AS currentCost,
      i.CREATDDT AS dateCreated,
      i.MODIFDT AS dateModified,
      rtrim(q.LOCNCODE) AS locationCode,
      rtrim(q.BINNMBR) AS binNumber,
      rtrim(q.PRIMVNDR) AS primaryVendorId,
      q.BGNGQTY AS beginningQuantity,
      q.LSORDQTY AS lastOrderedQuantity,
      q.LSTORDDT AS lastOrderedDate,
      rtrim(q.LSORDVND) AS lastOrderedVendorId,
      q.LRCPTQTY AS lastReceiptedQuantity,
      q.LSRCPTDT AS lastReceiptedDate,
      q.QTYRQSTN AS quantityRequisitioned,
      q.QTYONORD AS quantityOnOrder,
      q.QTYBKORD AS quantityBackOrdered,
      q.QTY_Drop_Shipped AS quantityDropShipped,
      q.QTYINUSE AS quantityInUse,
      q.QTYINSVC AS quantityInService,
      q.QTYRTRND AS quantityReturned,
      q.QTYDMGED AS quantityDamaged,
      q.QTYONHND AS quantityOnHand,
      q.ATYALLOC AS quantityAllocated,
      q.QTYCOMTD AS quantityCommitted,
      q.QTYSOLD AS quantitySold,
      dateadd(
        second,
        DATEPART(second, q.LSTCNTTM),
        dateadd(
          minute,
          DATEPART(minute, q.LSTCNTTM),
          dateadd(hour, DATEPART(hour, q.LSTCNTTM), q.LSTCNTDT)
        )
      ) AS lastCountDateTime,
      dateadd(
        second,
        DATEPART(second, q.NXTCNTTM),
        dateadd(
          minute,
          DATEPART(minute, q.NXTCNTTM),
          dateadd(hour, DATEPART(hour, q.NXTCNTTM), q.NXTCNTDT)
        )
      ) AS nextCountDateTime
    FROM
      IV00101 i
      INNER JOIN IV00102 q ON i.ITEMNMBR = q.ITEMNMBR
    WHERE
      (${locationCodeWhere})
  `);
    return itemResult.recordset;
}
