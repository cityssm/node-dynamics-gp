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

  it('Retrieves an Invoice', async () => {
    gp.setMSSQLConfig(config.mssqlConfig)

    const invoice = await gp.getInvoiceByInvoiceNumber(config.invoiceDocumentType, config.invoiceNumber)

    assert.ok(invoice)
    assert.strictEqual(config.invoiceNumber, invoice.invoiceNumber)
  })
})
