import type { config as MSSQLConfig } from 'mssql';
export { getCashReceiptByDocumentNumber } from './diamond/getCashReceiptByDocumentNumber.js';
export declare function clearCaches(): void;
export declare function setMSSQLConfig(mssqlConfig: MSSQLConfig): void;
