import { type mssql } from '@cityssm/mssql-multi-pool';
import type { GPInvoice } from './types.js';
export default function _getInvoiceByInvoiceNumber(mssqlConfig: mssql.config, invoiceNumber: string, invoiceDocumentTypeOrAbbreviationOrName?: number | string): Promise<GPInvoice | undefined>;
