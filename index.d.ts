import type { config as MSSQLConfig } from 'mssql';
import type { DiamondCashReceipt, DiamondExtendedGPInvoice, DiamondTaxedProperty, DiamondTaxedPropertyAssessment, DiamondTaxedPropertyOwner } from './diamond/types.js';
import { type GetVendorsFilters } from './gp/getVendors.js';
import type { GPAccount, GPCustomer, GPInvoice, GPInvoiceDocumentType, GPItemWithQuantities, GPItemWithQuantity, GPVendor } from './gp/types.js';
export interface DynamicsGPOptions {
    cacheTTL: number;
    documentCacheTTL: number;
}
export declare class DynamicsGP {
    #private;
    constructor(mssqlConfig: MSSQLConfig, options?: Partial<DynamicsGPOptions>);
    clearCaches(): void;
    findDiamondTaxedPropertiesByAddress(address: {
        civicNumber: string;
        streetName: string;
        unitNumberOrQualifier?: string;
    }, exactMatch?: boolean): Promise<DiamondTaxedProperty[]>;
    getAccountByAccountIndex(accountIndex: number | string): Promise<GPAccount | undefined>;
    getAllDiamondTaxedProperties(limit?: number, offset?: number): Promise<DiamondTaxedProperty[]>;
    getCustomerByCustomerNumber(customerNumber: string): Promise<GPCustomer | undefined>;
    getDiamondCashReceiptByDocumentNumber(documentNumber: number | string): Promise<DiamondCashReceipt | undefined>;
    getDiamondExtendedInvoiceByInvoiceNumber(invoiceNumber: string, invoiceDocumentTypeOrAbbreviationOrName?: number | string): Promise<DiamondExtendedGPInvoice | undefined>;
    getDiamondTaxedPropertyAssessmentsByRollNumber(rollNumber: string): Promise<DiamondTaxedPropertyAssessment[]>;
    getDiamondTaxedPropertyByRollNumber(rollNumber: string): Promise<DiamondTaxedProperty | undefined>;
    getDiamondTaxedPropertyOwnersByRollNumber(rollNumber: string): Promise<DiamondTaxedPropertyOwner[]>;
    getInvoiceByInvoiceNumber(invoiceNumber: string, invoiceDocumentTypeOrAbbreviationOrName?: number | string): Promise<GPInvoice | undefined>;
    getInvoiceDocumentTypes(): Promise<GPInvoiceDocumentType[]>;
    getItemByItemNumber(itemNumber: string): Promise<GPItemWithQuantities | undefined>;
    getItemsByLocationCodes(locationCodes?: string[]): Promise<GPItemWithQuantity[]>;
    getVendorByVendorId(vendorId: string): Promise<GPVendor | undefined>;
    getVendors(vendorFilters?: Partial<GetVendorsFilters>): Promise<GPVendor[]>;
    testConnection(): Promise<boolean>;
}
export type { DiamondCashReceipt, DiamondExtendedGPInvoice, DiamondTaxedProperty, DiamondTaxedPropertyAssessment, DiamondTaxedPropertyOwner } from './diamond/types.js';
export type { GetVendorsFilters } from './gp/getVendors.js';
export type { GPAccount, GPCustomer, GPInvoice, GPInvoiceDocumentType, GPItemWithQuantities, GPItemWithQuantity, GPVendor } from './gp/types.js';
