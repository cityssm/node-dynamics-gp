import type { config as MSSQLConfig } from 'mssql';
export { extendGPInvoice, getDiamondExtendedGPInvoice } from './diamond/getDiamondExtendedGPInvoice.js';
export { getCashReceiptByDocumentNumber } from './diamond/getCashReceiptByDocumentNumber.js';
export declare function clearCaches(): void;
export declare function hasMSSQLConfig(): boolean;
export declare function setMSSQLConfig(mssqlConfig: MSSQLConfig): void;
