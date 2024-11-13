import { type mssqlTypes } from '@cityssm/mssql-multi-pool';
import type { DiamondCashReceipt } from './types.js';
export declare function _getCashReceiptByDocumentNumber(mssqlConfig: mssqlTypes.config, documentNumber: number | string): Promise<DiamondCashReceipt | undefined>;
export default _getCashReceiptByDocumentNumber;
