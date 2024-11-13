import type { Config } from './types.js'

// Secrets OK
// https://github.com/potatoqualitee/mssqlsuite

export const config: Config = {
  mssql: {
    server: 'localhost',
    user: 'sa',
    // eslint-disable-next-line sonarjs/no-hardcoded-credentials
    password: 'dbatools.I0',
    database: 'Dynamics',
    options: {
      encrypt: false
    }
  },

  accountIndex: 1,
  accountIndexNotFound: -1,

  customerNumber: 'CUST001',
  customerNumberNotFound: 'X',

  itemNumber: '01-0001-00001',
  itemNumberNotFound: 'X',

  locationCodes: [''],

  vendorId: 'VEND001',
  vendorIdNotFound: 'X',

  invoiceDocumentType: 'IVC',
  invoiceNumber: 'IVC000001',
  invoiceNumberNotFound: 'X',

  cashReceiptDocumentNumber: 1,
  cashReceiptDocumentNumberInvalid: 'X',
  cashReceiptDocumentNumberNotFound: 2
}
