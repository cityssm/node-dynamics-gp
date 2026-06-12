import type { GPInvoice } from '../gp/types.js'

export interface DiamondCashReceipt {
  isHistorical: 0 | 1
  transactionSource: string
  documentNumber: number
  batchNumber: string
  batchSource: string
  initials: string
  documentDate: Date

  description1: string
  description2: string
  description3: string
  description4: string
  description5: string
  description6: string

  details: DiamondCashReceiptDetails[]
  distributions: DiamondCashReceiptDistribution[]
  totalBalance: number
  totalTaxes: number
  total: number
  cashAmount: number
  chequeAmount: number
  chequeNumber: string
  creditCardAmount: number
  creditCardName: string
  otherAmount: number

  dateCreated: Date
  dateModified: Date
}

interface DiamondCashReceiptDetails {
  sequenceNumber: number
  accountCode: string
  outstandingAmount: number
  quantity: number
  lineAmount: number
  discountAmount: number
  taxAmount: number
  paidAmount: number
  postAmount: number
  description: string
}

interface DiamondCashReceiptDistribution {
  accountIndex: number
  accountNumber?: string
  accountDescription?: string
  accountCode: string
  taxDetailCode: string
  paidAmount: number
}

export interface DiamondTrialBalanceCode {
  trialBalanceCode?: string
  trialBalanceCodeDescription?: string
}

export type DiamondExtendedGPInvoice = DiamondTrialBalanceCode & GPInvoice

export interface DiamondTaxedProperty {
  rollNumber: string

  addressStreetName: string
  addressStreetNumber: string
  addressUnitQualifier: string

  legalDescription1: string
  legalDescription2: string
  legalDescription3: string
  legalDescription4: string
  legalDescription5: string

  dateCreated: Date
  dateModified: Date
}

export interface DiamondTaxedPropertyOwner {
  customerNumber: string
  ownerType: 'Mortgage Holder' | 'Primary Owner' | 'Secondary Owner' | 'Unknown'

  ownerDateCreated: Date
  ownerDateModified: Date

  customerName: string

  address1: string
  address2: string
  address3: string
  city: string
  state: string
  country: string
  zipCode: string

  phoneNumber1: string
  phoneNumber2: string
  phoneNumber3: string

  faxNumber: string

  customerDateCreated: Date
  customerDateModified: Date
}

export interface DiamondTaxedPropertyAssessment {
  assessmentYear: number
  assessedValue: number
}
