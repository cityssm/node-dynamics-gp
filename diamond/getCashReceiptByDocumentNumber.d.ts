import type { config as MSSQLConfig } from 'mssql';
import type { DiamondCashReceipt } from './types.js';
export declare function _getCashReceiptByDocumentNumber(mssqlConfig: MSSQLConfig, documentNumber: number | string): Promise<DiamondCashReceipt | undefined>;
export default _getCashReceiptByDocumentNumber;
