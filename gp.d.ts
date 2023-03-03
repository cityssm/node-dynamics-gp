import * as config from './config.js';
export declare const setMSSQLConfig: typeof config.setMSSQLConfig;
export { getAccountByAccountIndex } from './gp/getAccountByAccountIndex.js';
export { getCustomerByCustomerNumber } from './gp/getCustomerByCustomerNumber.js';
export { getInvoiceByInvoiceNumber } from './gp/getInvoiceByInvoiceNumber.js';
export { getInvoiceDocumentTypes } from './gp/getInvoiceDocumentTypes.js';
export { getItemByItemNumber } from './gp/getItemByItemNumber.js';
export { getVendorByVendorId } from './gp/getVendorByVendorId.js';
export declare function clearCaches(): void;
