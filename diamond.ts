import * as config from './config.js'

export const setMSSQLConfig = config.setMSSQLConfig

export { getCashReceiptByDocumentNumber } from './diamond/getCashReceiptByDocumentNumber.js'

import { clearCashReceiptCache } from './diamond/getCashReceiptByDocumentNumber.js'

export function clearCaches() {
  clearCashReceiptCache()
}
