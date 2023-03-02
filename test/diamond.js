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
        const cashReceipt = await diamond.getCashReceiptByDocumentNumber(cashReceiptDocumentNumber);
        assert.ok(cashReceipt);
        assert.strictEqual(cashReceiptDocumentNumber, cashReceipt.documentNumber);
    });
});
