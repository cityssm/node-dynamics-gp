import assert from 'node:assert';
import { releaseAll } from '@cityssm/mssql-multi-pool';
import { DynamicsGP } from '../dynamicsGp.js';
import { config } from './config.js';
describe('dynamics-gp/diamond', () => {
    const gp = new DynamicsGP(config.mssql);
    const gpMisconfigured = new DynamicsGP({
        server: 'localhost'
    });
    after(() => {
        releaseAll();
    });
    describe('Cash Receipts', () => {
        it('Retrieves a Cash Receipt', async () => {
            let cashReceipt = await gp.getDiamondCashReceiptByDocumentNumber(config.cashReceiptDocumentNumber);
            cashReceipt = await gp.getDiamondCashReceiptByDocumentNumber(config.cashReceiptDocumentNumber);
            assert.ok(cashReceipt);
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
            assert.ok(diamondInvoice);
            assert.ok(diamondInvoice.trialBalanceCode !== undefined);
        });
    });
});
