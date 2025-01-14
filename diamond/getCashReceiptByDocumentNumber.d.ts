import { type mssql } from '@cityssm/mssql-multi-pool';
import type { DiamondCashReceipt } from './types.js';
export declare function _getCashReceiptByDocumentNumber(mssqlConfig: mssql.config, documentNumber: number | string): Promise<DiamondCashReceipt | undefined>;
export default _getCashReceiptByDocumentNumber;
