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
    const itemResult = await itemRequest.query(`SELECT
      rtrim(i.ITEMNMBR) as itemNumber,
      rtrim(i.ITEMDESC) as itemDescription,
      rtrim(i.ITMSHNAM) as itemShortName,
      rtrim(i.ITEMTYPE) as itemType,
      rtrim(i.ITMGEDSC) as itemGenericDescription,
      i.STNDCOST as standardCost,
      i.CURRCOST as currentCost,
      i.CREATDDT as dateCreated,
      i.MODIFDT as dateModified,

      rtrim(q.LOCNCODE) as locationCode,
      rtrim(q.BINNMBR) as binNumber,
      rtrim(q.PRIMVNDR) as primaryVendorId,
      q.BGNGQTY as beginningQuantity,
      q.LSORDQTY as lastOrderedQuantity,
      q.LSTORDDT as lastOrderedDate,
      rtrim(q.LSORDVND) as lastOrderedVendorId,
      q.LRCPTQTY as lastReceiptedQuantity,
      q.LSRCPTDT as lastReceiptedDate,
      q.QTYRQSTN as quantityRequisitioned,
      q.QTYONORD as quantityOnOrder,
      q.QTYBKORD as quantityBackOrdered,
      q.QTY_Drop_Shipped as quantityDropShipped,
      q.QTYINUSE as quantityInUse,
      q.QTYINSVC as quantityInService,
      q.QTYRTRND as quantityReturned,
      q.QTYDMGED as quantityDamaged,
      q.QTYONHND as quantityOnHand,
      q.ATYALLOC as quantityAllocated,
      q.QTYCOMTD as quantityCommitted,
      q.QTYSOLD as quantitySold,
      dateadd(second, DATEPART(second, q.LSTCNTTM), dateadd(minute, DATEPART(minute, q.LSTCNTTM), dateadd(hour, DATEPART(hour, q.LSTCNTTM), q.LSTCNTDT))) as lastCountDateTime,
      dateadd(second, DATEPART(second, q.NXTCNTTM), dateadd(minute, DATEPART(minute, q.NXTCNTTM), dateadd(hour, DATEPART(hour, q.NXTCNTTM), q.NXTCNTDT))) as nextCountDateTime
        
      FROM IV00101 i
      inner join IV00102 q on i.ITEMNMBR = q.ITEMNMBR
      where (${locationCodeWhere})`);
    return itemResult.recordset;
}
