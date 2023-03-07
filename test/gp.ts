import assert from 'node:assert'
import * as gp from '../gp.js'

import * as sqlPool from '@cityssm/mssql-multi-pool'

import { config } from './config.js'

describe('dynamics-gp', () => {
  before(() => {
    gp.setMSSQLConfig(config.mssql)
  })

  after(() => {
    sqlPool.releaseAll()
  })

  it('Retrieves an Account', async () => {
    // Do twice to test cache retrival
    let account = await gp.getAccountByAccountIndex(config.accountIndex)
    account = await gp.getAccountByAccountIndex(config.accountIndex)

    assert.ok(account)
    assert.strictEqual(config.accountIndex, account.accountIndex)
  })

  it('Retrieves a Customer', async () => {
    // Do twice to test cache retrival
    let customer = await gp.getCustomerByCustomerNumber(config.customerNumber)
    customer = await gp.getCustomerByCustomerNumber(config.customerNumber)

    assert.ok(customer)
    assert.strictEqual(config.customerNumber, customer.customerNumber)
  })

  it('Retrieves Invoice Document Types', async () => {
    // Do twice to test cache retrieval
    let invoiceDocumentTypes = await gp.getInvoiceDocumentTypes()
    invoiceDocumentTypes = await gp.getInvoiceDocumentTypes()

    assert.ok(invoiceDocumentTypes)
    assert.ok(invoiceDocumentTypes.length > 0)
  })

  describe('Invoices', () => {
    it('Retrieves an Invoice', async () => {
      // Do twice to test cache retrieval
      let invoice = await gp.getInvoiceByInvoiceNumber(
        config.invoiceNumber,
        config.invoiceDocumentType
      )
      invoice = await gp.getInvoiceByInvoiceNumber(
        config.invoiceNumber,
        config.invoiceDocumentType
      )

      assert.ok(invoice)
      assert.strictEqual(config.invoiceNumber, invoice.invoiceNumber)
    })

    it('Retrieves an Invoice without a Type', async () => {
      // Do twice to test cache retrieval
      let invoice = await gp.getInvoiceByInvoiceNumber(config.invoiceNumber)
      invoice = await gp.getInvoiceByInvoiceNumber(config.invoiceNumber)

      assert.ok(invoice)
      assert.strictEqual(config.invoiceNumber, invoice.invoiceNumber)
    })

    it('Returns undefined when invoice number is not found', async () => {
      const invoice = await gp.getInvoiceByInvoiceNumber(
        config.invoiceNumberNotFound
      )

      assert.strictEqual(invoice, undefined)
    })
  })

  it('Retrieves an Item', async () => {
    // Do twice to test cache retrieval
    let item = await gp.getItemByItemNumber(config.itemNumber)
    item = await gp.getItemByItemNumber(config.itemNumber)

    assert.ok(item)
    assert.strictEqual(config.itemNumber, item.itemNumber)
  })

  it('Retrieves a Vendor', async () => {
    // Do twice to test cache retrieval
    let vendor = await gp.getVendorByVendorId(config.vendorId)
    vendor = await gp.getVendorByVendorId(config.vendorId)

    assert.ok(vendor)
    assert.strictEqual(config.vendorId, vendor.vendorId)
  })

  it('Clears caches without error', () => {
    gp.clearCaches()
    assert.ok(1)
  })
})
