import type { Config } from './types'

// Secrets OK
// https://github.com/potatoqualitee/mssqlsuite

export const config: Config = {
  mssql: {
    server: 'localhost',
    user: 'sa',
    password: 'dbatools.I0',
    database: 'Dynamics'
  },

  accountIndex: 1,
  customerNumber: 'CUST001',
  itemNumber: '01-0001-00001',
  vendorId: 'VEND001',

  invoiceDocumentType: 'IVC',
  invoiceNumber: 'IVC000001',

  cashReceiptDocumentNumber: 1
}