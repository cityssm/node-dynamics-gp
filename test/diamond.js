import assert from 'node:assert';
import * as diamond from '../diamond.js';
import * as sqlPool from '@cityssm/mssql-multi-pool';
import { config } from './config.js';
describe('dynamics-gp/diamond', () => {
    before(() => {
        diamond.setMSSQLConfig(config.mssql);
    });
    after(() => {
        sqlPool.releaseAll();
    });
    it('Retrieves a Cash Receipt', async () => {
        let cashReceipt = await diamond.getCashReceiptByDocumentNumber(config.cashReceiptDocumentNumber);
        cashReceipt = await diamond.getCashReceiptByDocumentNumber(config.cashReceiptDocumentNumber);
        assert.ok(cashReceipt);
        assert.strictEqual(config.cashReceiptDocumentNumber, cashReceipt.documentNumber);
    });
    it('Clears caches without error', () => {
        diamond.clearCaches();
        assert.ok(1);
    });
});
