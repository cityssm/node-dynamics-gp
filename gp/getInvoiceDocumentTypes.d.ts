import { type mssql } from '@cityssm/mssql-multi-pool';
import type { GPInvoiceDocumentType } from './types.js';
export declare function _getInvoiceDocumentTypes(mssqlConfig: mssql.config): Promise<GPInvoiceDocumentType[]>;
export default _getInvoiceDocumentTypes;
