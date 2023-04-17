import * as config from './config.js'

import type { config as MSSQLConfig } from 'mssql'

export {
  extendGPInvoice,
  getDiamondExtendedGPInvoice
} from './diamond/getDiamondExtendedGPInvoice.js'
export { getCashReceiptByDocumentNumber } from './diamond/getCashReceiptByDocumentNumber.js'

import { clearCaches as clearExtendGPInvoiceCaches } from './diamond/getDiamondExtendedGPInvoice.js'
import { clearCashReceiptCache } from './diamond/getCashReceiptByDocumentNumber.js'

export function clearCaches() {
  clearCashReceiptCache()
  clearExtendGPInvoiceCaches()
}

export function hasMSSQLConfig(): boolean {
  return config._mssqlConfig !== undefined
}

export function setMSSQLConfig(mssqlConfig: MSSQLConfig) {
  config.setMSSQLConfig(mssqlConfig)
  clearCaches()
}
