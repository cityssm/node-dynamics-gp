export interface GPAccount {
  accountIndex: number
  accountNumber: string
  accountNumberSegment1: string
  accountNumberSegment2: string
  accountNumberSegment3: string
  accountNumberSegment4: string
  accountNumberSegment5: string
  accountNumberSegment6: string

  accountAlias: string
  accountDescription: string
  active: boolean

  dateCreated: Date
  dateModified: Date
}

export interface GPCustomer {
  customerNumber: string
  customerName: string
  customerClass: string
  contactPerson: string
  statementName: string
  shortName: string

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

  dateCreated: Date
  dateModified: Date
}

export interface GPInvoiceDocumentType {
  invoiceDocumentType: number
  documentTypeAbbreviation: string
  documentTypeName: string
}

export interface GPInvoice extends GPInvoiceDocumentType {
  isHistorical: 0 | 1
  invoiceNumber: string
  batchNumber: string
  batchSource: string
  customerNumber: string
  customerName: string
  documentDate: Date
  lineItems: GPInvoiceLineItem[]
  datePosted: Date
  datePostedGl: Date
  dateQuoted: Date
  dateOrdered: Date
  termDiscountDate: Date
  dateDue: Date
  documentAmount: number
  subtotal: number
  freightAmount: number
  miscellaneousAmount: number
  tradeDiscountAmount: number
  taxAmount: number
  accountAmount: number
  paymentReceived: number
  codAmount: number
  contactPerson: string

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

  comment1: string
  comment2: string
  comment3: string
  comment4: string

  dateCreated: Date
  dateModified: Date
}

export interface GPInvoiceLineItem {
  lineItemNumber: number
  itemNumber: string
  quantity: number
  quantityInService: number
  quantityInUse: number
  quantityDamaged: number
  quantityReturned: number
  quantityOnHand: number
  existingQuantitySelected: number
  unitOfMeasurement: string
  unitCost: number
  extendedCost: number
  quantityAllocated: number
  locationCode: string
  extendedPrice: number
  unitPrice: number
  taxAmount: number
  itemDescription: string
  shipDateExpected: Date
  shipDateActual: Date
  shipDateRequested: Date
}

interface GPItem {
  itemNumber: string
  itemDescription: string
  itemShortName: string
  itemType: string
  itemGenericDescription: string
  standardCost: number
  currentCost: number
  dateCreated: Date
  dateModified: Date
}

interface GPItemQuantity {
  locationCode: string
  binNumber: string
  primaryVendorId: string
  beginningQuantity: number
  lastOrderedQuantity: number
  lastOrderedDate: Date
  lastOrderedVendorId: string
  lastReceiptedQuantity: number
  lastReceiptedDate: Date
  quantityRequisitioned: number
  quantityOnOrder: number
  quantityBackOrdered: number
  quantityDropShipped: number
  quantityInUse: number
  quantityInService: number
  quantityReturned: number
  quantityDamaged: number
  quantityOnHand: number
  quantityAllocated: number
  quantityCommitted: number
  quantitySold: number
  lastCountDateTime: Date
  nextCountDateTime: Date
}

export type GPItemWithQuantity = GPItem & GPItemQuantity

export interface GPItemWithQuantities extends GPItem {
  quantities: GPItemQuantity[]
}

export interface GPVendor {
  vendorId: string
  vendorName: string
  vendorCheckName: string
  shortName: string
  contactPerson: string

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

  comment1: string
  comment2: string

  vendorClassId: string

  dateCreated: Date
  dateModified: Date
  lastPurchaseDate: Date
}
