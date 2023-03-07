import type * as mssql from 'mssql';
export interface Config {
    mssql: mssql.config;
    accountIndex: number;
    accountIndexNotFound: number;
    customerNumber: string;
    customerNumberNotFound: string;
    itemNumber: string;
    itemNumberNotFound: string;
    vendorId: string;
    vendorIdNotFound: string;
    invoiceDocumentType: string;
    invoiceNumber: string;
    invoiceNumberNotFound: string;
    cashReceiptDocumentNumber: number | string;
    cashReceiptDocumentNumberInvalid: string;
    cashReceiptDocumentNumberNotFound: number;
}
