import { type mssqlTypes } from '@cityssm/mssql-multi-pool';
import type { GPInvoice } from './types.js';
export default function _getInvoiceByInvoiceNumber(mssqlConfig: mssqlTypes.config, invoiceNumber: string, invoiceDocumentTypeOrAbbreviationOrName?: number | string): Promise<GPInvoice | undefined>;
