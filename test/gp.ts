import assert from 'node:assert'
import * as gp from '../gp.js'

import * as sqlPool from '@cityssm/mssql-multi-pool'

import * as config from './config.test.js'

describe('dynamics-gp', () => {
  after(() => {
    sqlPool.releaseAll()
  })

  it('Retrieves an Account', async () => {
    gp.setMSSQLConfig(config.mssqlConfig)

    // Do twice to test cache retrival

    let account = await gp.getAccountByAccountIndex(config.accountIndex)
    account = await gp.getAccountByAccountIndex(config.accountIndex)

    assert.ok(account)
    assert.strictEqual(config.accountIndex, account.accountIndex)
  })

  it('Retrieves a Customer', async () => {
    gp.setMSSQLConfig(config.mssqlConfig)

    // Do twice to test cache retrival

    let customer = await gp.getCustomerByCustomerNumber(config.customerNumber)
    customer = await gp.getCustomerByCustomerNumber(config.customerNumber)

    assert.ok(customer)
    assert.strictEqual(config.customerNumber, customer.customerNumber)
  })

  it('Retrieves Invoice Document Types', async () => {
    gp.setMSSQLConfig(config.mssqlConfig)

    const invoiceDocumentTypes = await gp.getInvoiceDocumentTypes()

    assert.ok(invoiceDocumentTypes)
    assert.ok(invoiceDocumentTypes.length > 0)
  })

  it('Retrieves an Invoice', async () => {
    gp.setMSSQLConfig(config.mssqlConfig)

    const invoice = await gp.getInvoiceByInvoiceNumber(config.invoiceNumber, config.invoiceDocumentType)

    assert.ok(invoice)
    assert.strictEqual(config.invoiceNumber, invoice.invoiceNumber)
  })

  it('Retrieves an Invoice without a Type', async () => {
    gp.setMSSQLConfig(config.mssqlConfig)

    const invoice = await gp.getInvoiceByInvoiceNumber(config.invoiceNumber)

    assert.ok(invoice)
    assert.strictEqual(config.invoiceNumber, invoice.invoiceNumber)
  }) 
  
  it('Retrieves an Item', async () => {
    gp.setMSSQLConfig(config.mssqlConfig)

    const item = await gp.getItemByItemNumber(config.itemNumber)

    assert.ok(item)
    assert.strictEqual(config.itemNumber, item.itemNumber)
  })  

  it('Retrieves a Vendor', async () => {
    gp.setMSSQLConfig(config.mssqlConfig)

    const vendor = await gp.getVendorByVendorId(config.vendorId)

    assert.ok(vendor)
    assert.strictEqual(config.vendorId, vendor.vendorId)
  })

  it('Clears caches without error', () => {
    gp.clearCaches()
    assert.ok(1)
  })
})
