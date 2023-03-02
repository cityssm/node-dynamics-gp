import type { GPInvoice } from './types';
export declare function getInvoiceByInvoiceNumber(documentTypeOrAbbreviationOrName: number | string, invoiceNumber: string): Promise<GPInvoice>;
