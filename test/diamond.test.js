import assert from 'node:assert';
import { after, describe, it } from 'node:test';
import { releaseAll } from '@cityssm/mssql-multi-pool';
import Debug from 'debug';
import { DEBUG_ENABLE_NAMESPACES } from '../debug.config.js';
import { DynamicsGP } from '../index.js';
import { config } from './config.js';
Debug.enable(DEBUG_ENABLE_NAMESPACES);
await describe('dynamics-gp/diamond', async () => {
    const gp = new DynamicsGP(config.mssql);
    const gpMisconfigured = new DynamicsGP({
        server: 'localhost'
    });
    after(() => {
        void releaseAll();
    });
    await describe('Cash Receipts', async () => {
        await it('Retrieves a Cash Receipt', async () => {
            await gp.getDiamondCashReceiptByDocumentNumber(config.cashReceiptDocumentNumber);
            const cashReceipt = await gp.getDiamondCashReceiptByDocumentNumber(config.cashReceiptDocumentNumber);
            assert.ok(cashReceipt !== undefined);
            assert.strictEqual(config.cashReceiptDocumentNumber, cashReceipt.documentNumber);
            assert.ok(cashReceipt.details.length > 0);
        });
        await it('Returns undefined when document number is not a number', async () => {
            const cashReceipt = await gp.getDiamondCashReceiptByDocumentNumber(config.cashReceiptDocumentNumberInvalid);
            assert.strictEqual(cashReceipt, undefined);
        });
        await it('Returns undefined when document number is not found', async () => {
            const cashReceipt = await gp.getDiamondCashReceiptByDocumentNumber(config.cashReceiptDocumentNumberNotFound);
            assert.strictEqual(cashReceipt, undefined);
        });
        await it('Throws an error when SQL is misconfigured', async () => {
            try {
                await gpMisconfigured.getDiamondCashReceiptByDocumentNumber(config.cashReceiptDocumentNumber);
            }
            catch {
                assert.ok(true);
                return;
            }
            assert.fail();
        });
    });
    await describe('Extend GP Invoices', async () => {
        await it('Gets a fully extended GPInvoice', async () => {
            const diamondInvoice = await gp.getDiamondExtendedInvoiceByInvoiceNumber(config.invoiceNumber);
            assert.ok(diamondInvoice !== undefined);
            assert.ok(diamondInvoice.trialBalanceCode !== undefined);
        });
    });
    await describe('Taxed Properties', async () => {
        await it('Gets a taxed property by roll number', async () => {
            const property = await gp.getDiamondTaxedPropertyByRollNumber(config.taxedPropertyRollNumber);
            assert.ok(property !== undefined);
            assert.strictEqual(property.rollNumber, config.taxedPropertyRollNumber);
        });
        await it('Returns undefined when roll number is not found', async () => {
            const property = await gp.getDiamondTaxedPropertyByRollNumber('X');
            assert.strictEqual(property, undefined);
        });
        await it('Gets taxed property owners by roll number', async () => {
            const owners = await gp.getDiamondTaxedPropertyOwnersByRollNumber(config.taxedPropertyRollNumber);
            assert.ok(owners.length > 0);
        });
        await it('Gets taxed property assessments by roll number', async () => {
            const assessments = await gp.getDiamondTaxedPropertyAssessmentsByRollNumber(config.taxedPropertyRollNumber);
            assert.ok(assessments.length > 0);
        });
        await it('Gets taxed properties by address', async () => {
            const properties = await gp.findDiamondTaxedPropertiesByAddress(config.taxedPropertyAddress);
            assert.ok(properties.length > 0);
            assert.strictEqual(properties[0].addressStreetNumber, config.taxedPropertyAddress.civicNumber.padStart(properties[0].addressStreetNumber.length, '0'));
            assert.strictEqual(properties[0].rollNumber, config.taxedPropertyRollNumber);
        });
    });
});
