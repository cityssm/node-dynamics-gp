import assert from 'node:assert';
import { after, describe, it } from 'node:test';
import { releaseAll } from '@cityssm/mssql-multi-pool';
import Debug from 'debug';
import { DEBUG_ENABLE_NAMESPACES } from '../debug.config.js';
import { DynamicsGP } from '../index.js';
import { config } from './config.js';
Debug.enable(DEBUG_ENABLE_NAMESPACES);
describe('dynamics-gp/diamond', () => {
    const gp = new DynamicsGP(config.mssql);
    const gpMisconfigured = new DynamicsGP({
        server: 'localhost'
    });
    after(() => {
        void releaseAll();
    });
    describe('Cash Receipts', () => {
        it('Retrieves a Cash Receipt', async () => {
            await gp.getDiamondCashReceiptByDocumentNumber(config.cashReceiptDocumentNumber);
            const cashReceipt = await gp.getDiamondCashReceiptByDocumentNumber(config.cashReceiptDocumentNumber);
            assert.ok(cashReceipt !== undefined);
            assert.strictEqual(config.cashReceiptDocumentNumber, cashReceipt.documentNumber);
            assert.ok(cashReceipt.details.length > 0);
        });
        it('Returns undefined when document number is not a number', async () => {
            const cashReceipt = await gp.getDiamondCashReceiptByDocumentNumber(config.cashReceiptDocumentNumberInvalid);
            assert.strictEqual(cashReceipt, undefined);
        });
        it('Returns undefined when document number is not found', async () => {
            const cashReceipt = await gp.getDiamondCashReceiptByDocumentNumber(config.cashReceiptDocumentNumberNotFound);
            assert.strictEqual(cashReceipt, undefined);
        });
        it('Throws an error when SQL is misconfigured', async () => {
            try {
                await gpMisconfigured.getDiamondCashReceiptByDocumentNumber(config.cashReceiptDocumentNumber);
            }
            catch {
                assert.ok(1);
                return;
            }
            assert.fail();
        });
    });
    describe('Extend GP Invoices', () => {
        it('Gets a fully extended GPInvoice', async () => {
            const diamondInvoice = await gp.getDiamondExtendedInvoiceByInvoiceNumber(config.invoiceNumber);
            assert.ok(diamondInvoice !== undefined);
            assert.ok(diamondInvoice.trialBalanceCode !== undefined);
        });
    });
});
