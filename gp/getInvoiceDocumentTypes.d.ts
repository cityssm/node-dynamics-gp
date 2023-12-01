import type { config as MSSQLConfig } from 'mssql';
import type { GPInvoiceDocumentType } from './types.js';
export declare function _getInvoiceDocumentTypes(mssqlConfig: MSSQLConfig): Promise<GPInvoiceDocumentType[]>;
export default _getInvoiceDocumentTypes;
