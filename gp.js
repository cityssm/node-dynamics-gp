import * as config from './config.js';
export const setMSSQLConfig = config.setMSSQLConfig;
export { getAccountByAccountIndex } from './gp/getAccountByAccountIndex.js';
export { getCustomerByCustomerNumber } from './gp/getCustomerByCustomerNumber.js';
export { getInvoiceByInvoiceNumber } from './gp/getInvoiceByInvoiceNumber.js';
export { getInvoiceDocumentTypes } from './gp/getInvoiceDocumentTypes.js';
export { getItemByItemNumber } from './gp/getItemByItemNumber.js';
export { getVendorByVendorId } from './gp/getVendorByVendorId.js';
import { clearAccountCache } from './gp/getAccountByAccountIndex.js';
import { clearCustomerCache } from './gp/getCustomerByCustomerNumber.js';
import { clearItemCache } from './gp/getItemByItemNumber.js';
import { clearVendorCache } from './gp/getVendorByVendorId.js';
export function clearCaches() {
    clearAccountCache();
    clearCustomerCache();
    clearItemCache();
    clearVendorCache();
}
