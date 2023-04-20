import { _mssqlConfig, cacheTTL, queryErrorMessage } from '../config.js'
import * as sqlPool from '@cityssm/mssql-multi-pool'

import * as gp from '../gp.js'

import type { GPInvoice } from '../gp/types.js'
import type {
  DiamondExtendedGPInvoice,
  DiamondTrialBalanceCode
} from './types.js'

import Debug from 'debug'
const debug = Debug('dynamics-gp:diamond:getTrialBalanceCodeByInvoiceNumber')

import NodeCache from 'node-cache'
const trialBalanceCodeCache = new NodeCache({ stdTTL: cacheTTL })

export async function extendGPInvoice(
  gpInvoice: GPInvoice
): Promise<DiamondExtendedGPInvoice> {
  const diamondInvoice = gpInvoice as DiamondExtendedGPInvoice

  // Trial Balance Code

  let trialBalanceCode: DiamondTrialBalanceCode | undefined =
    trialBalanceCodeCache.get(diamondInvoice.invoiceNumber) ?? undefined

  if (
    trialBalanceCode === undefined &&
    !trialBalanceCodeCache.has(diamondInvoice.invoiceNumber)
  ) {
    try {
      const pool = await sqlPool.connect(_mssqlConfig)

      const tbcResult = await pool
        .request()
        .input('invoiceNumber', gpInvoice.invoiceNumber).query(`SELECT
          t.dCUSTTBCODE as trialBalanceCode,
          t.dDESC as trialBalanceCodeDescription
          FROM [SF120] i
          inner join SF023 t on i.dcusttbcode = t.dcusttbcode
          where docnumbr = @invoiceNumber`)

      if (tbcResult.recordset && tbcResult.recordset.length > 0) {
        trialBalanceCode = tbcResult.recordset[0]
      }

      trialBalanceCodeCache.set(diamondInvoice.invoiceNumber, trialBalanceCode)
    } catch (error) {
      debug(queryErrorMessage)
      throw error
    }
  } else {
    debug(`Cache hit: ${diamondInvoice.invoiceNumber}`)
  }

  debug(trialBalanceCode)

  if (trialBalanceCode !== undefined) {
    diamondInvoice.trialBalanceCode = trialBalanceCode.trialBalanceCode
    diamondInvoice.trialBalanceCodeDescription =
      trialBalanceCode.trialBalanceCodeDescription
  }

  return diamondInvoice
}

export async function getDiamondExtendedGPInvoice(
  invoiceNumber: string,
  invoiceDocumentTypeOrAbbreviationOrName?: number | string
): Promise<DiamondExtendedGPInvoice | undefined> {
  if (!gp.hasMSSQLConfig()) {
    gp.setMSSQLConfig(_mssqlConfig)
  }

  const gpInvoice = await gp.getInvoiceByInvoiceNumber(
    invoiceNumber,
    invoiceDocumentTypeOrAbbreviationOrName
  )

  if (!gpInvoice) {
    return undefined
  }

  const diamondInvoice = await extendGPInvoice(gpInvoice)

  return diamondInvoice
}

export function clearCaches() {
  trialBalanceCodeCache.flushAll()
}

export default getDiamondExtendedGPInvoice
