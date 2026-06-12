import { type mssql, connect } from '@cityssm/mssql-multi-pool'

import type { GPInvoice, GPInvoiceLineItem } from './types.js'

// eslint-disable-next-line no-secrets/no-secrets
/**
 * Inquiry > Sales > Invoice
 * @param mssqlConfig - The mssql configuration object.
 * @param invoiceNumber - The invoice number to look up.
 * @param invoiceDocumentTypeOrAbbreviationOrName - The invoice document type, abbreviation, or name to filter by (optional).
 * @returns The invoice information or undefined if not found.
 */
export default async function _getInvoiceByInvoiceNumber(
  mssqlConfig: mssql.config,
  invoiceNumber: string,
  invoiceDocumentTypeOrAbbreviationOrName?: number | string
): Promise<GPInvoice | undefined> {
  const pool = await connect(mssqlConfig)

  const invoiceRequest = pool.request().input('invoiceNumber', invoiceNumber)

  let sql = /* sql */ `
    SELECT
      TOP 1 rtrim(t.DOCTYABR) AS documentTypeAbbreviation,
      rtrim(t.DOCTYNAM) AS documentTypeName,
      i.*
    FROM
      (
        SELECT
          TOP 1 0 AS isHistorical,
          i.DOCTYPE AS invoiceDocumentType,
          rtrim(i.INVCNMBR) AS invoiceNumber,
          rtrim(i.BACHNUMB) AS batchNumber,
          rtrim(i.BCHSOURC) AS batchSource,
          rtrim(i.CUSTNMBR) AS customerNumber,
          rtrim(i.CUSTNAME) AS customerName,
          i.DOCDATE AS documentDate,
          i.POSTDATE AS datePosted,
          i.GLPOSTDT AS datePostedGl,
          i.QUOTEDAT AS dateQuoted,
          i.ORDRDATE AS dateOrdered,
          i.DISCDATE AS termDiscountDate,
          i.DUEDATE AS dateDue,
          i.DOCAMNT AS documentAmount,
          i.SUBTOTAL AS subtotal,
          i.FRTAMNT AS freightAmount,
          i.MISCAMNT AS miscellaneousAmount,
          i.TRDISAMT AS tradeDiscountAmount,
          i.TAXAMNT AS taxAmount,
          i.ACCTAMNT AS accountAmount,
          i.PYMTRCVD AS paymentReceived,
          i.CODAMNT AS codAmount,
          rtrim(i.CNTCPRSN) AS contactPerson,
          rtrim(i.ADDRESS1) AS address1,
          rtrim(i.ADDRESS2) AS address2,
          rtrim(i.ADDRESS3) AS address3,
          rtrim(i.CITY) AS city,
          rtrim(i.STATE) AS state,
          rtrim(i.COUNTRY) AS country,
          rtrim(i.ZIPCODE) AS zipCode,
          rtrim(i.PHNUMBR1) AS phoneNumber1,
          rtrim(i.PHNUMBR2) AS phoneNumber2,
          rtrim(i.PHONE3) AS phoneNumber3,
          rtrim(i.FAXNUMBR) AS faxNumber,
          rtrim(i.COMMENT_1) AS comment1,
          rtrim(i.COMMENT_2) AS comment2,
          rtrim(i.COMMENT_3) AS comment3,
          rtrim(i.COMMENT_4) AS comment4,
          i.CREATDDT AS dateCreated,
          i.MODIFDT AS dateModified
        FROM
          IVC10100 i
        WHERE
          i.INVCNMBR = @invoiceNumber
        UNION
        SELECT
          TOP 1 1 AS isHistorical,
          i.DOCTYPE AS invoiceDocumentType,
          rtrim(i.INVCNMBR) AS invoiceNumber,
          rtrim(i.BACHNUMB) AS batchNumber,
          rtrim(i.BCHSOURC) AS batchSource,
          rtrim(i.CUSTNMBR) AS customerNumber,
          rtrim(i.CUSTNAME) AS customerName,
          i.DOCDATE AS documentDate,
          i.POSTDATE AS datePosted,
          i.GLPOSTDT AS datePostedGl,
          i.QUOTEDAT AS dateQuoted,
          i.ORDRDATE AS dateOrdered,
          i.DISCDATE AS termDiscountDate,
          i.DUEDATE AS dateDue,
          i.DOCAMNT AS documentAmount,
          i.SUBTOTAL AS subtotal,
          i.FRTAMNT AS freightAmount,
          i.MISCAMNT AS miscellaneousAmount,
          i.TRDISAMT AS tradeDiscountAmount,
          i.TAXAMNT AS taxAmount,
          i.ACCTAMNT AS accountAmount,
          i.PYMTRCVD AS paymentReceived,
          i.CODAMNT AS codAmount,
          rtrim(i.CNTCPRSN) AS contactPerson,
          rtrim(i.ADDRESS1) AS address1,
          rtrim(i.ADDRESS2) AS address2,
          rtrim(i.ADDRESS3) AS address3,
          rtrim(i.CITY) AS city,
          rtrim(i.STATE) AS state,
          rtrim(i.COUNTRY) AS country,
          rtrim(i.ZIPCODE) AS zipCode,
          rtrim(i.PHNUMBR1) AS phoneNumber1,
          rtrim(i.PHNUMBR2) AS phoneNumber2,
          rtrim(i.PHONE3) AS phoneNumber3,
          rtrim(i.FAXNUMBR) AS faxNumber,
          rtrim(i.COMMENT_1) AS comment1,
          rtrim(i.COMMENT_2) AS comment2,
          rtrim(i.COMMENT_3) AS comment3,
          rtrim(i.COMMENT_4) AS comment4,
          i.CREATDDT AS dateCreated,
          i.MODIFDT AS dateModified
        FROM
          IVC30101 i
        WHERE
          i.INVCNMBR = @invoiceNumber
      ) i
      LEFT JOIN IVC40101 t ON i.invoiceDocumentType = t.DOCTYPE
  `

  if (invoiceDocumentTypeOrAbbreviationOrName !== undefined) {
    invoiceRequest.input(
      'invoiceDocumentType',
      invoiceDocumentTypeOrAbbreviationOrName.toString()
    )

    sql += ` where (
      t.DOCTYABR = @invoiceDocumentType
      or t.DOCTYNAM = @invoiceDocumentType
      ${
        typeof invoiceDocumentTypeOrAbbreviationOrName === 'string' &&
        Number.isNaN(
          Number.parseInt(invoiceDocumentTypeOrAbbreviationOrName, 10)
        )
          ? ''
          : ' or t.DOCTYPE = @invoiceDocumentType'
      })`
  }
  sql += ' order by t.DEX_ROW_ID'

  const invoiceResult = await invoiceRequest.query<GPInvoice>(sql)

  const invoice: GPInvoice | undefined =
    invoiceResult.recordset.length > 0 ? invoiceResult.recordset[0] : undefined

  if (invoice !== undefined) {
    const itemResults = await pool
      .request()
      .input('invoiceDocumentType', invoice.invoiceDocumentType)
      .input('invoiceNumber', invoice.invoiceNumber)
      .query<GPInvoiceLineItem>(/* sql */ `
        SELECT
          [LNITMSEQ] AS lineItemNumber,
          rtrim([ITEMNMBR]) AS itemNumber,
          [QUANTITY] AS quantity,
          [QTYINSVC] AS quantityInService,
          [QTYINUSE] AS quantityInUse,
          [QTYDMGED] AS quantityDamaged,
          [QTYRTRND] AS quantityReturned,
          [QTYONHND] AS quantityOnHand,
          [EXTQTYSEL] AS existingQuantitySelected,
          rtrim([UOFM]) AS unitOfMeasurement,
          [UNITCOST] AS unitCost,
          [EXTDCOST] AS extendedCost,
          [ATYALLOC] AS quantityAllocated,
          rtrim([LOCNCODE]) AS locationCode,
          [XTNDPRCE] AS extendedPrice,
          [UNITPRCE] AS unitPrice,
          [TAXAMNT] AS taxAmount,
          rtrim([ITEMDESC]) AS itemDescription,
          [EXPTSHIP] AS shipDateExpected,
          [ACTLSHIP] AS shipDateActual,
          [ReqShipDate] AS shipDateRequested
        FROM
          ${invoice.isHistorical === 1 ? '[IVC30102]' : '[IVC10101]'}
        WHERE
          INVCNMBR = @invoiceNumber
          AND DOCTYPE = @invoiceDocumentType
        ORDER BY
          LNITMSEQ
      `)

    invoice.lineItems = itemResults.recordset
  }

  return invoice
}
