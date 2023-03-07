import * as config from './config.js'

import type { config as MSSQLConfig } from 'mssql'

export { getCashReceiptByDocumentNumber } from './diamond/getCashReceiptByDocumentNumber.js'

import { clearCashReceiptCache } from './diamond/getCashReceiptByDocumentNumber.js'

export function clearCaches() {
  clearCashReceiptCache()
}

export function setMSSQLConfig (mssqlConfig: MSSQLConfig) {
  config.setMSSQLConfig(mssqlConfig)
  clearCaches()
}