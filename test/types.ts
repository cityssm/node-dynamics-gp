import type * as mssql from 'mssql'

export interface Config {
  mssql: mssql.config

  accountIndex: number
  customerNumber: string
  itemNumber: string
  vendorId: string

  invoiceDocumentType: string
  invoiceNumber: string

  cashReceiptDocumentNumber: number | string
}