import * as config from './config.js';
export { getCashReceiptByDocumentNumber } from './diamond/getCashReceiptByDocumentNumber.js';
import { clearCashReceiptCache } from './diamond/getCashReceiptByDocumentNumber.js';
export function clearCaches() {
    clearCashReceiptCache();
}
export function setMSSQLConfig(mssqlConfig) {
    config.setMSSQLConfig(mssqlConfig);
    clearCaches();
}
