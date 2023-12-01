import type { GPInvoice } from '../gp/types.js';
export interface DiamondCashReceipt {
    isHistorical: 0 | 1;
    transactionSource: string;
    documentNumber: number;
    batchNumber: string;
    batchSource: string;
    initials: string;
    documentDate: Date;
    description: string;
    description2: string;
    description3: string;
    description4: string;
    description5: string;
    description6: string;
    details: DiamondCashReceiptDetails[];
    distributions: DiamondCashReceiptDistribution[];
    totalBalance: number;
    totalTaxes: number;
    total: number;
    cashAmount: number;
    chequeAmount: number;
    chequeNumber: string;
    creditCardAmount: number;
    creditCardName: string;
    otherAmount: number;
    dateCreated: Date;
    dateModified: Date;
}
interface DiamondCashReceiptDetails {
    sequenceNumber: number;
    accountCode: string;
    outstandingAmount: number;
    quantity: number;
    lineAmount: number;
    discountAmount: number;
    taxAmount: number;
    paidAmount: number;
    postAmount: number;
    description: string;
}
interface DiamondCashReceiptDistribution {
    accountIndex: number;
    accountNumber?: string;
    accountDescription?: string;
    accountCode: string;
    taxDetailCode: string;
    paidAmount: number;
}
export interface DiamondTrialBalanceCode {
    trialBalanceCode?: string;
    trialBalanceCodeDescription?: string;
}
export type DiamondExtendedGPInvoice = GPInvoice & DiamondTrialBalanceCode;
export {};
