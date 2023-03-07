import type { GPInvoice } from './types';
export declare function getInvoiceByInvoiceNumber(invoiceNumber: string, invoiceDocumentTypeOrAbbreviationOrName?: number | string): Promise<GPInvoice>;
export default getInvoiceByInvoiceNumber;
