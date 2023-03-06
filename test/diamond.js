import assert from 'node:assert';
import * as diamond from '../diamond.js';
import * as sqlPool from '@cityssm/mssql-multi-pool';
import { mssqlConfig, cashReceiptDocumentNumber } from './config.test.js';
describe('dynamics-gp/diamond', () => {
    after(() => {
        sqlPool.releaseAll();
    });
    it('Retrieves a Cash Receipt', async () => {
        diamond.setMSSQLConfig(mssqlConfig);
        let cashReceipt = await diamond.getCashReceiptByDocumentNumber(cashReceiptDocumentNumber);
        cashReceipt = await diamond.getCashReceiptByDocumentNumber(cashReceiptDocumentNumber);
        assert.ok(cashReceipt);
        assert.strictEqual(cashReceiptDocumentNumber, cashReceipt.documentNumber);
    });
    it('Clears caches without error', () => {
        diamond.clearCaches();
        assert.ok(1);
    });
});
