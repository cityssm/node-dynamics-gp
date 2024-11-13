import { type mssqlTypes } from '@cityssm/mssql-multi-pool';
import type { GPInvoiceDocumentType } from './types.js';
export declare function _getInvoiceDocumentTypes(mssqlConfig: mssqlTypes.config): Promise<GPInvoiceDocumentType[]>;
export default _getInvoiceDocumentTypes;
