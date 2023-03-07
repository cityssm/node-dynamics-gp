import * as config from './config.js';
export { getAccountByAccountIndex } from './gp/getAccountByAccountIndex.js';
export { getCustomerByCustomerNumber } from './gp/getCustomerByCustomerNumber.js';
export { getInvoiceByInvoiceNumber } from './gp/getInvoiceByInvoiceNumber.js';
export { getInvoiceDocumentTypes } from './gp/getInvoiceDocumentTypes.js';
export { getItemByItemNumber } from './gp/getItemByItemNumber.js';
export { getVendorByVendorId } from './gp/getVendorByVendorId.js';
import { clearAccountCache } from './gp/getAccountByAccountIndex.js';
import { clearCustomerCache } from './gp/getCustomerByCustomerNumber.js';
import { clearInvoiceCache } from './gp/getInvoiceByInvoiceNumber.js';
import { clearInvoiceDocumentTypesCache } from './gp/getInvoiceDocumentTypes.js';
import { clearItemCache } from './gp/getItemByItemNumber.js';
import { clearVendorCache } from './gp/getVendorByVendorId.js';
export function clearCaches() {
    clearAccountCache();
    clearCustomerCache();
    clearInvoiceCache();
    clearInvoiceDocumentTypesCache();
    clearItemCache();
    clearVendorCache();
}
export function setMSSQLConfig(mssqlConfig) {
    config.setMSSQLConfig(mssqlConfig);
    clearCaches();
}
