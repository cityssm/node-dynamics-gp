import { _mssqlConfig } from '../config.js'
import * as sqlPool from '@cityssm/mssql-multi-pool'

import type { GPInvoice } from './types'

import Debug from 'debug'
const debug = Debug('dynamics-gp:gp:getInvoiceByInvoiceNumber')

export async function getInvoiceByInvoiceNumber(
  documentTypeOrAbbreviationOrName: number | string,
  invoiceNumber: string
): Promise<GPInvoice> {
  let invoice: GPInvoice

  try {
    const pool = await sqlPool.connect(_mssqlConfig)

    const invoiceResult = await pool
      .request()
      .input('documentType', documentTypeOrAbbreviationOrName.toString())
      .input('invoiceNumber', invoiceNumber).query(`SELECT TOP 1
        i.[DOCTYPE] as documentType,
        rtrim(t.[DOCTYABR]) as documentTypeAbbreviation,
        rtrim(t.[DOCTYNAM]) as documentTypeName,
        rtrim(i.[INVCNMBR]) as invoiceNumber,
        rtrim(i.[BACHNUMB]) as batchNumber,
        rtrim(i.[BCHSOURC]) as batchSource,
        rtrim(i.[CUSTNMBR]) as customerNumber,
        rtrim(i.[CUSTNAME]) as customerName,
        i.[DOCDATE] as documentDate,
        i.[POSTDATE] as datePosted,
        i.[GLPOSTDT] as datePostedGl,
        i.[QUOTEDAT] as dateQuoted,
        i.[ORDRDATE] as dateOrdered,
        i.[DISCDATE] as termDiscountDate,
        i.[DUEDATE] as dateDue,
        i.[DOCAMNT] as documentAmount,
        i.[SUBTOTAL] as subtotal,
        i.[FRTAMNT] as freightAmount,
        i.[MISCAMNT] as miscellaneousAmount,
        i.[TRDISAMT] as tradeDiscountAmount,
        i.[TAXAMNT] as taxAmount,
        i.[ACCTAMNT] as accountAmount,
        i.[PYMTRCVD] as paymentReceived,
        i.[CODAMNT] as codAmount,
        rtrim(i.[CNTCPRSN]) as contactPerson,
        rtrim(i.[ADDRESS1]) as address1,
        rtrim(i.[ADDRESS2]) as address2,
        rtrim(i.[ADDRESS3]) as address3,
        rtrim(i.[CITY]) as city,
        rtrim(i.[STATE]) as state,
        rtrim(i.[COUNTRY]) as country,
        rtrim(i.[ZIPCODE]) as zipCode,
        rtrim(i.[PHNUMBR1]) as phoneNumber1,
        rtrim(i.[PHNUMBR2]) as phoneNumber2,
        rtrim(i.[PHONE3]) as phoneNumber3,
        rtrim(i.[FAXNUMBR]) as faxNumber,
        rtrim(i.[COMMENT_1]) as comment1,
        rtrim(i.[COMMENT_2]) as comment2,
        rtrim(i.[COMMENT_3]) as comment3,
        rtrim(i.[COMMENT_4]) as comment4,
        i.[CREATDDT] as dateCreated,
        i.[MODIFDT] as dateModified
        FROM [IVC30101] i
        left join [IVC40101] t on i.DOCTYPE = t.DOCTYPE
        where i.INVCNMBR = @invoiceNumber
        and (
          t.DOCTYABR = @documentType
          or t.DOCTYNAM = @documentType
          ${
            typeof documentTypeOrAbbreviationOrName === 'string' &&
            Number.isNaN(Number.parseInt(documentTypeOrAbbreviationOrName, 10))
              ? ''
              : ' or i.DOCTYPE = @documentType'
          })`)

    if (invoiceResult.recordset && invoiceResult.recordset.length > 0) {
      invoice = invoiceResult.recordset[0]
    }

    if (invoice !== undefined) {

console.log("DOCTYPE = " + invoice.documentType)

      const itemResults = await pool
        .request()
        .input('documentType', invoice.documentType)
        .input('invoiceNumber', invoice.invoiceNumber).query(`SELECT
          [LNITMSEQ] as lineItemNumber,
          rtrim([ITEMNMBR]) as itemNumber,
          [QUANTITY] as quantity,
          [QTYINSVC] as quantityInService,
          [QTYINUSE] as quantityInUse,
          [QTYDMGED] as quantityDamaged,
          [QTYRTRND] as quantityReturned,
          [QTYONHND] as quantityOnHand,
          [EXTQTYSEL] as existingQuantitySelected,
          rtrim([UOFM]) as unitOfMeasurement,
          [UNITCOST] as unitCost,
          [EXTDCOST] as extendedCost,
          [ATYALLOC] as quantityAllocated,
          rtrim([LOCNCODE]) as locationCode,
          [XTNDPRCE] as extendedPrice,
          [UNITPRCE] as unitPrice,
          [TAXAMNT] as taxAmount,
          rtrim([ITEMDESC]) as itemDescription,
          [EXPTSHIP] as shipDateExpected,
          [ACTLSHIP] as shipDateActual,
          [ReqShipDate] as shipDateRequested
          FROM [IVC30102]
          where INVCNMBR = @invoiceNumber
          and DOCTYPE = @documentType
          order by LNITMSEQ`)

      invoice.lineItems = itemResults.recordset ?? []
    }
  } catch (error) {
    debug(error)
  }

  debug(invoice)

  return invoice
}
