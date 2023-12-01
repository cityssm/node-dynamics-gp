import type { config as MSSQLConfig } from 'mssql';
import type { DiamondCashReceipt, DiamondExtendedGPInvoice } from './diamond/types.js';
import type { GPAccount, GPCustomer, GPInvoice, GPInvoiceDocumentType, GPItem, GPVendor } from './gp/types.js';
export interface DynamicsGPOptions {
    cacheTTL: number;
    documentCacheTTL: number;
}
export declare class DynamicsGP {
    #private;
    constructor(mssqlConfig: MSSQLConfig, options?: Partial<DynamicsGPOptions>);
    clearCaches(): void;
    getAccountByAccountIndex(accountIndex: number | string): Promise<GPAccount | undefined>;
    getCustomerByCustomerNumber(customerNumber: string): Promise<GPCustomer | undefined>;
    getInvoiceByInvoiceNumber(invoiceNumber: string, invoiceDocumentTypeOrAbbreviationOrName?: number | string): Promise<GPInvoice | undefined>;
    getInvoiceDocumentTypes(): Promise<GPInvoiceDocumentType[]>;
    getItemByItemNumber(itemNumber: string): Promise<GPItem | undefined>;
    getVendorByVendorId(vendorId: string): Promise<GPVendor | undefined>;
    getDiamondCashReceiptByDocumentNumber(documentNumber: number | string): Promise<DiamondCashReceipt | undefined>;
    getDiamondExtendedInvoiceByInvoiceNumber(invoiceNumber: string, invoiceDocumentTypeOrAbbreviationOrName?: number | string): Promise<DiamondExtendedGPInvoice | undefined>;
}
export type { GPAccount, GPCustomer, GPInvoice, GPInvoiceDocumentType, GPItem, GPVendor } from './gp/types.js';
export type { DiamondCashReceipt, DiamondExtendedGPInvoice } from './diamond/types.js';
