import assert from 'node:assert';
import * as diamond from '../diamond.js';
import * as sqlPool from '@cityssm/mssql-multi-pool';
import { config } from './config.js';
describe('dynamics-gp/diamond', () => {
    beforeEach(() => {
        diamond.setMSSQLConfig(config.mssql);
    });
    after(() => {
        sqlPool.releaseAll();
    });
    describe('Cash Receipts', () => {
        it('Retrieves a Cash Receipt', async () => {
            let cashReceipt = await diamond.getCashReceiptByDocumentNumber(config.cashReceiptDocumentNumber);
            cashReceipt = await diamond.getCashReceiptByDocumentNumber(config.cashReceiptDocumentNumber);
            assert.ok(cashReceipt);
            assert.strictEqual(config.cashReceiptDocumentNumber, cashReceipt.documentNumber);
        });
        it('Returns undefined when document number is not a number', async () => {
            const cashReceipt = await diamond.getCashReceiptByDocumentNumber(config.cashReceiptDocumentNumberInvalid);
            assert.strictEqual(cashReceipt, undefined);
        });
        it('Returns undefined when document number is not found', async () => {
            const cashReceipt = await diamond.getCashReceiptByDocumentNumber(config.cashReceiptDocumentNumberNotFound);
            assert.strictEqual(cashReceipt, undefined);
        });
        it('Throws an error when SQL is misconfigured', async () => {
            diamond.setMSSQLConfig({
                server: 'localhost'
            });
            try {
                await diamond.getCashReceiptByDocumentNumber(config.cashReceiptDocumentNumber);
            }
            catch (_a) {
                assert.ok(1);
                return;
            }
            assert.fail();
        });
    });
    it('Clears caches without error', () => {
        diamond.clearCaches();
        assert.ok(1);
    });
});
