import assert from 'node:assert'
import * as gp from '../gp.js'

import * as sqlPool from '@cityssm/mssql-multi-pool'

import { config } from './config.js'

describe('dynamics-gp', () => {
  beforeEach(() => {
    gp.setMSSQLConfig(config.mssql)
  })

  after(() => {
    sqlPool.releaseAll()
  })

  describe('Accounts', () => {

    it('Retrieves an Account', async () => {
      // Do twice to test cache retrival
      let account = await gp.getAccountByAccountIndex(config.accountIndex)
      account = await gp.getAccountByAccountIndex(config.accountIndex)
  
      assert.ok(account)
      assert.strictEqual(config.accountIndex, account.accountIndex)
    })

    it('Returns undefined when account index is not found', async () => {
      const account = await gp.getAccountByAccountIndex(
        config.accountIndexNotFound
      )

      assert.strictEqual(account, undefined)
    })

    it('Throws an error when SQL is misconfigured', async () => {
      gp.setMSSQLConfig({
        server: 'localhost'
      })

      try {
        await gp.getAccountByAccountIndex(config.accountIndex)
      } catch {
        assert.ok(1)
        return
      }

      assert.fail()
    })
  })

  describe('Customers', () => {
    it('Retrieves a Customer', async () => {
      // Do twice to test cache retrival
      let customer = await gp.getCustomerByCustomerNumber(config.customerNumber)
      customer = await gp.getCustomerByCustomerNumber(config.customerNumber)

      assert.ok(customer)
      assert.strictEqual(config.customerNumber, customer.customerNumber)
    })

    it('Returns undefined when customer number is not found', async () => {
      const customer = await gp.getCustomerByCustomerNumber(
        config.customerNumberNotFound
      )

      assert.strictEqual(customer, undefined)
    })

    it('Throws an error when SQL is misconfigured', async () => {
      gp.setMSSQLConfig({
        server: 'localhost'
      })

      try {
        await gp.getCustomerByCustomerNumber(config.customerNumber)
      } catch {
        assert.ok(1)
        return
      }

      assert.fail()
    })
  })

  describe('Invoice Document Types', () => {
    it('Retrieves Invoice Document Types', async () => {
      // Do twice to test cache retrieval
      let invoiceDocumentTypes = await gp.getInvoiceDocumentTypes()
      invoiceDocumentTypes = await gp.getInvoiceDocumentTypes()

      assert.ok(invoiceDocumentTypes)
      assert.ok(invoiceDocumentTypes.length > 0)
    })

    it('Throws an error when SQL is misconfigured', async () => {
      gp.setMSSQLConfig({
        server: 'localhost'
      })

      try {
        await gp.getInvoiceDocumentTypes()
      } catch {
        assert.ok(1)
        return
      }

      assert.fail()
    })
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

    it('Throws an error when SQL is misconfigured', async () => {
      gp.setMSSQLConfig({
        server: 'localhost'
      })

      try {
        await gp.getInvoiceByInvoiceNumber(config.invoiceNumber)
      } catch {
        assert.ok(1)
        return
      }

      assert.fail()
    })
  })

  describe('Items', () => {
    it('Retrieves an Item', async () => {
      // Do twice to test cache retrieval
      let item = await gp.getItemByItemNumber(config.itemNumber)
      item = await gp.getItemByItemNumber(config.itemNumber)

      assert.ok(item)
      assert.strictEqual(config.itemNumber, item.itemNumber)
    })

    it('Returns undefined when item number is not found', async () => {
      const item = await gp.getItemByItemNumber(config.itemNumberNotFound)

      assert.strictEqual(item, undefined)
    })

    it('Throws an error when SQL is misconfigured', async () => {
      gp.setMSSQLConfig({
        server: 'localhost'
      })

      try {
        await gp.getItemByItemNumber(config.itemNumber)
      } catch {
        assert.ok(1)
        return
      }

      assert.fail()
    })
  })

  describe('Vendors', () => {
    it('Retrieves a Vendor', async () => {
      // Do twice to test cache retrieval
      let vendor = await gp.getVendorByVendorId(config.vendorId)
      vendor = await gp.getVendorByVendorId(config.vendorId)

      assert.ok(vendor)
      assert.strictEqual(config.vendorId, vendor.vendorId)
    })

    it('Returns undefined when vendor id is not found', async () => {
      const vendor = await gp.getVendorByVendorId(config.vendorIdNotFound)

      assert.strictEqual(vendor, undefined)
    })

    it('Throws an error when SQL is misconfigured', async () => {
      gp.setMSSQLConfig({
        server: 'localhost'
      })

      try {
        await gp.getVendorByVendorId(config.vendorId)
      } catch {
        assert.ok(1)
        return
      }

      assert.fail()
    })
  })

  it('Clears caches without error', () => {
    gp.clearCaches()
    assert.ok(1)
  })
})
