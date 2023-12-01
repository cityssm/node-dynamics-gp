import type { config as MSSQLConfig } from 'mssql';
import type { GPInvoice } from './types.js';
export declare function _getInvoiceByInvoiceNumber(mssqlConfig: MSSQLConfig, invoiceNumber: string, invoiceDocumentTypeOrAbbreviationOrName?: number | string): Promise<GPInvoice | undefined>;
export default _getInvoiceByInvoiceNumber;
