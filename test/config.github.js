export const config = {
    mssql: {
        server: 'localhost',
        user: 'sa',
        password: 'dbatools.I0',
        database: 'Dynamics',
        options: {
            encrypt: false
        }
    },
    accountIndex: 1,
    customerNumber: 'CUST001',
    itemNumber: '01-0001-00001',
    vendorId: 'VEND001',
    invoiceDocumentType: 'IVC',
    invoiceNumber: 'IVC000001',
    invoiceNumberNotFound: 'X',
    cashReceiptDocumentNumber: 1,
    cashReceiptDocumentNumberInvalid: 'X',
    cashReceiptDocumentNumberNotFound: 2
};
