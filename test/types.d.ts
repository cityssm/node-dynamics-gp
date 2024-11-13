import type { config as MSSQLConfig } from 'mssql';
export interface Config {
    mssql: MSSQLConfig;
    accountIndex: number;
    accountIndexNotFound: number;
    customerNumber: string;
    customerNumberNotFound: string;
    itemNumber: string;
    itemNumberNotFound: string;
    locationCodes: string[];
    vendorId: string;
    vendorIdNotFound: string;
    invoiceDocumentType: string;
    invoiceNumber: string;
    invoiceNumberNotFound: string;
    cashReceiptDocumentNumber: number | string;
    cashReceiptDocumentNumberInvalid: string;
    cashReceiptDocumentNumberNotFound: number;
}
