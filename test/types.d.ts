import type { mssql } from '@cityssm/mssql-multi-pool';
export interface Config {
    mssql: mssql.config;
    accountIndex: number;
    accountIndexNotFound: number;
    customerNumber: string;
    customerNumberNotFound: string;
    itemNumber: string;
    itemNumberNotFound: string;
    locationCodes: string[];
    vendorId: string;
    vendorIdNotFound: string;
    notVendorClassIds: string[];
    vendorClassIds: string[];
    vendorNameContains: string[];
    vendorNameDoesNotContain: string[];
    invoiceDocumentType: string;
    invoiceNumber: string;
    invoiceNumberNotFound: string;
    cashReceiptDocumentNumber: number | string;
    cashReceiptDocumentNumberInvalid: string;
    cashReceiptDocumentNumberNotFound: number;
}
