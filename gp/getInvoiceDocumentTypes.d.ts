import { type mssql } from '@cityssm/mssql-multi-pool';
import type { GPInvoiceDocumentType } from './types.js';
export default function _getInvoiceDocumentTypes(mssqlConfig: mssql.config): Promise<GPInvoiceDocumentType[]>;
