import assert from 'node:assert'
import { after, describe, it } from 'node:test'

import { releaseAll } from '@cityssm/mssql-multi-pool'
import Debug from 'debug'

import { DEBUG_ENABLE_NAMESPACES } from '../debug.config.js'
import { DynamicsGP } from '../index.js'

import { config } from './config.js'

Debug.enable(DEBUG_ENABLE_NAMESPACES)

describe('dynamics-gp', () => {
  const gp = new DynamicsGP(config.mssql)
  const gpMisconfigured = new DynamicsGP({
    server: 'localhost'
  })

  after(() => {
    void releaseAll()
  })

  describe('Accounts', () => {
    it('Retrieves an Account', async () => {
      // Do twice to test cache retrieval
      await gp.getAccountByAccountIndex(config.accountIndex)
      const account = await gp.getAccountByAccountIndex(config.accountIndex)

      assert.ok(account !== undefined)
      assert.strictEqual(config.accountIndex, account.accountIndex)
    })

    it('Returns undefined when account index is not found', async () => {
      const account = await gp.getAccountByAccountIndex(
        config.accountIndexNotFound
      )

      assert.strictEqual(account, undefined)
    })

    it('Throws an error when SQL is misconfigured', async () => {
      try {
        await gpMisconfigured.getAccountByAccountIndex(config.accountIndex)
      } catch {
        assert.ok(true)
        return
      }

      assert.fail()
    })
  })

  describe('Customers', () => {
    it('Retrieves a Customer', async () => {
      // Do twice to test cache retrieval
      await gp.getCustomerByCustomerNumber(config.customerNumber)
      const customer = await gp.getCustomerByCustomerNumber(
        config.customerNumber
      )

      assert.ok(customer !== undefined)
      assert.strictEqual(config.customerNumber, customer.customerNumber)
    })

    it('Returns undefined when customer number is not found', async () => {
      const customer = await gp.getCustomerByCustomerNumber(
        config.customerNumberNotFound
      )

      assert.strictEqual(customer, undefined)
    })

    it('Throws an error when SQL is misconfigured', async () => {
      try {
        await gpMisconfigured.getCustomerByCustomerNumber(config.customerNumber)
      } catch {
        assert.ok(true)
        return
      }

      assert.fail()
    })
  })

  describe('Invoice Document Types', () => {
    it('Retrieves Invoice Document Types', async () => {
      // Do twice to test cache retrieval
      await gp.getInvoiceDocumentTypes()
      const invoiceDocumentTypes = await gp.getInvoiceDocumentTypes()

      assert.ok(invoiceDocumentTypes.length > 0)
    })

    it('Throws an error when SQL is misconfigured', async () => {
      try {
        await gpMisconfigured.getInvoiceDocumentTypes()
      } catch {
        assert.ok(true)
        return
      }

      assert.fail()
    })
  })

  describe('Invoices', () => {
    it('Retrieves an Invoice', async () => {
      // Do twice to test cache retrieval
      await gp.getInvoiceByInvoiceNumber(
        config.invoiceNumber,
        config.invoiceDocumentType
      )

      const invoice = await gp.getInvoiceByInvoiceNumber(
        config.invoiceNumber,
        config.invoiceDocumentType
      )

      assert.ok(invoice !== undefined)
      assert.strictEqual(config.invoiceNumber, invoice.invoiceNumber)
    })

    it('Retrieves an Invoice without a Type', async () => {
      // Do twice to test cache retrieval
      await gp.getInvoiceByInvoiceNumber(config.invoiceNumber)
      const invoice = await gp.getInvoiceByInvoiceNumber(config.invoiceNumber)

      assert.ok(invoice !== undefined)
      assert.strictEqual(config.invoiceNumber, invoice.invoiceNumber)
    })

    it('Returns undefined when invoice number is not found', async () => {
      const invoice = await gp.getInvoiceByInvoiceNumber(
        config.invoiceNumberNotFound
      )

      assert.strictEqual(invoice, undefined)
    })

    it('Throws an error when SQL is misconfigured', async () => {
      try {
        await gpMisconfigured.getInvoiceByInvoiceNumber(config.invoiceNumber)
      } catch {
        assert.ok(true)
        return
      }

      assert.fail()
    })
  })

  describe('Single Items', () => {
    it('Retrieves an Item', async () => {
      // Do twice to test cache retrieval
      await gp.getItemByItemNumber(config.itemNumber)
      const item = await gp.getItemByItemNumber(config.itemNumber)

      assert.ok(item !== undefined)
      assert.strictEqual(config.itemNumber, item.itemNumber)
    })

    it('Returns undefined when item number is not found', async () => {
      const item = await gp.getItemByItemNumber(config.itemNumberNotFound)

      assert.strictEqual(item, undefined)
    })

    it('Throws an error when SQL is misconfigured', async () => {
      try {
        await gpMisconfigured.getItemByItemNumber(config.itemNumber)
      } catch {
        assert.ok(true)
        return
      }

      assert.fail()
    })
  })

  describe('Multiple Items', () => {
    it('Retrieves Items', async () => {
      const items = await gp.getItemsByLocationCodes(config.locationCodes)

      assert.ok(items.length > 0)
    })

    it('Throws an error when SQL is misconfigured', async () => {
      try {
        await gpMisconfigured.getItemsByLocationCodes()
      } catch {
        assert.ok(true)
        return
      }

      assert.fail()
    })
  })

  describe('Vendors', () => {
    it('Retrieves a Vendor', async () => {
      // Do twice to test cache retrieval
      await gp.getVendorByVendorId(config.vendorId)
      const vendor = await gp.getVendorByVendorId(config.vendorId)

      assert.ok(vendor !== undefined)
      assert.strictEqual(config.vendorId, vendor.vendorId)
    })

    it('Returns undefined when vendor id is not found', async () => {
      const vendor = await gp.getVendorByVendorId(config.vendorIdNotFound)

      assert.strictEqual(vendor, undefined)
    })

    it('Throws an error when SQL is misconfigured', async () => {
      try {
        await gpMisconfigured.getVendorByVendorId(config.vendorId)
      } catch {
        assert.ok(true)
        return
      }

      assert.fail()
    })
  })

  it('Clears caches without error', () => {
    gp.clearCaches()
    assert.ok(true)
  })
})
