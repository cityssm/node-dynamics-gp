import assert from 'node:assert';
import { after, describe, it } from 'node:test';
import { releaseAll } from '@cityssm/mssql-multi-pool';
import Debug from 'debug';
import { DEBUG_ENABLE_NAMESPACES, DEBUG_NAMESPACE } from '../debug.config.js';
import { DynamicsGP } from '../index.js';
import { config } from './config.js';
Debug.enable(DEBUG_ENABLE_NAMESPACES);
const debug = Debug(`${DEBUG_NAMESPACE}:test:gp`);
await describe('dynamics-gp', async () => {
    const gp = new DynamicsGP(config.mssql);
    const gpMisconfigured = new DynamicsGP({
        server: 'localhost'
    });
    after(() => {
        void releaseAll();
    });
    await describe.skip('Accounts', async () => {
        await it('Retrieves an Account', async () => {
            await gp.getAccountByAccountIndex(config.accountIndex);
            const account = await gp.getAccountByAccountIndex(config.accountIndex);
            assert.ok(account !== undefined);
            assert.strictEqual(config.accountIndex, account.accountIndex);
        });
        await it('Returns undefined when account index is not found', async () => {
            const account = await gp.getAccountByAccountIndex(config.accountIndexNotFound);
            assert.strictEqual(account, undefined);
        });
        await it('Throws an error when SQL is misconfigured', async () => {
            try {
                await gpMisconfigured.getAccountByAccountIndex(config.accountIndex);
            }
            catch {
                assert.ok(true);
                return;
            }
            assert.fail();
        });
    });
    await describe.skip('Customers', async () => {
        await it('Retrieves a Customer', async () => {
            await gp.getCustomerByCustomerNumber(config.customerNumber);
            const customer = await gp.getCustomerByCustomerNumber(config.customerNumber);
            assert.ok(customer !== undefined);
            assert.strictEqual(config.customerNumber, customer.customerNumber);
        });
        await it('Returns undefined when customer number is not found', async () => {
            const customer = await gp.getCustomerByCustomerNumber(config.customerNumberNotFound);
            assert.strictEqual(customer, undefined);
        });
        await it('Throws an error when SQL is misconfigured', async () => {
            try {
                await gpMisconfigured.getCustomerByCustomerNumber(config.customerNumber);
            }
            catch {
                assert.ok(true);
                return;
            }
            assert.fail();
        });
    });
    await describe.skip('Invoice Document Types', async () => {
        await it('Retrieves Invoice Document Types', async () => {
            await gp.getInvoiceDocumentTypes();
            const invoiceDocumentTypes = await gp.getInvoiceDocumentTypes();
            assert.ok(invoiceDocumentTypes.length > 0);
        });
        await it('Throws an error when SQL is misconfigured', async () => {
            try {
                await gpMisconfigured.getInvoiceDocumentTypes();
            }
            catch {
                assert.ok(true);
                return;
            }
            assert.fail();
        });
    });
    await describe.skip('Invoices', async () => {
        await it('Retrieves an Invoice', async () => {
            await gp.getInvoiceByInvoiceNumber(config.invoiceNumber, config.invoiceDocumentType);
            const invoice = await gp.getInvoiceByInvoiceNumber(config.invoiceNumber, config.invoiceDocumentType);
            assert.ok(invoice !== undefined);
            assert.strictEqual(config.invoiceNumber, invoice.invoiceNumber);
        });
        await it('Retrieves an Invoice without a Type', async () => {
            await gp.getInvoiceByInvoiceNumber(config.invoiceNumber);
            const invoice = await gp.getInvoiceByInvoiceNumber(config.invoiceNumber);
            assert.ok(invoice !== undefined);
            assert.strictEqual(config.invoiceNumber, invoice.invoiceNumber);
        });
        await it('Returns undefined when invoice number is not found', async () => {
            const invoice = await gp.getInvoiceByInvoiceNumber(config.invoiceNumberNotFound);
            assert.strictEqual(invoice, undefined);
        });
        await it('Throws an error when SQL is misconfigured', async () => {
            try {
                await gpMisconfigured.getInvoiceByInvoiceNumber(config.invoiceNumber);
            }
            catch {
                assert.ok(true);
                return;
            }
            assert.fail();
        });
    });
    await describe('Single Items', async () => {
        await it('Retrieves an Item', async () => {
            await gp.getItemByItemNumber(config.itemNumber);
            const item = await gp.getItemByItemNumber(config.itemNumber);
            debug(item);
            assert.ok(item !== undefined);
            assert.strictEqual(config.itemNumber, item.itemNumber);
            assert.ok(Object.hasOwn(item, 'itemClassCode'));
        });
        await it('Returns undefined when item number is not found', async () => {
            const item = await gp.getItemByItemNumber(config.itemNumberNotFound);
            assert.strictEqual(item, undefined);
        });
        await it('Throws an error when SQL is misconfigured', async () => {
            try {
                await gpMisconfigured.getItemByItemNumber(config.itemNumber);
            }
            catch {
                assert.ok(true);
                return;
            }
            assert.fail();
        });
    });
    await describe.skip('Multiple Items', async () => {
        await it('Retrieves Items', async () => {
            const items = await gp.getItemsByLocationCodes(config.locationCodes);
            assert.ok(items.length > 0);
            assert.ok(Object.hasOwn(items[0], 'itemClassCode'));
        });
        await it('Throws an error when SQL is misconfigured', async () => {
            try {
                await gpMisconfigured.getItemsByLocationCodes();
            }
            catch {
                assert.ok(true);
                return;
            }
            assert.fail();
        });
    });
    await describe.skip('Vendors', async () => {
        await it('Retrieves a Vendor', async () => {
            await gp.getVendorByVendorId(config.vendorId);
            const vendor = await gp.getVendorByVendorId(config.vendorId);
            assert.ok(vendor !== undefined);
            assert.strictEqual(config.vendorId, vendor.vendorId);
        });
        await it('Returns undefined when vendor id is not found', async () => {
            const vendor = await gp.getVendorByVendorId(config.vendorIdNotFound);
            assert.strictEqual(vendor, undefined);
        });
        await it('Returns a list of the vendors', async () => {
            const vendors = await gp.getVendors({
                notVendorClassIds: config.notVendorClassIds,
                vendorClassIds: config.vendorClassIds,
                vendorNameContains: config.vendorNameContains,
                vendorNameDoesNotContain: config.vendorNameDoesNotContain,
                lastPurchaseDateMin: new Date('2024-01-01')
            });
            debug(vendors);
            assert.ok(vendors.length > 0);
        });
        await it('Throws an error when SQL is misconfigured', async () => {
            try {
                await gpMisconfigured.getVendorByVendorId(config.vendorId);
            }
            catch {
                assert.ok(true);
                return;
            }
            assert.fail();
        });
    });
    await it('Clears caches without error', () => {
        gp.clearCaches();
        assert.ok(true);
    });
});
