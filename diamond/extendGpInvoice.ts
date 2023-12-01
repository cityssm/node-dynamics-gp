import { connect } from '@cityssm/mssql-multi-pool'
import type { config as MSSQLConfig } from 'mssql'

import type { GPInvoice } from '../gp/types.js'

import type {
  DiamondExtendedGPInvoice,
  DiamondTrialBalanceCode
} from './types.js'

export async function _extendGpInvoice(
  mssqlConfig: MSSQLConfig,
  gpInvoice: GPInvoice
): Promise<DiamondExtendedGPInvoice> {
  const diamondInvoice = gpInvoice as DiamondExtendedGPInvoice

  // Trial Balance Code

  let trialBalanceCode: DiamondTrialBalanceCode | undefined

  const pool = await connect(mssqlConfig)

  const tbcResult = await pool
    .request()
    .input('invoiceNumber', gpInvoice.invoiceNumber).query(`SELECT top 1
      t.dCUSTTBCODE as trialBalanceCode,
      t.dDESC as trialBalanceCodeDescription
      FROM SF120 i
      inner join SF023 t on i.dcusttbcode = t.dcusttbcode
      where docnumbr = @invoiceNumber`)

  if (tbcResult.recordset.length > 0) {
    trialBalanceCode = tbcResult.recordset[0]
  }

  if (trialBalanceCode !== undefined) {
    diamondInvoice.trialBalanceCode = trialBalanceCode.trialBalanceCode
    diamondInvoice.trialBalanceCodeDescription =
      trialBalanceCode.trialBalanceCodeDescription
  }

  return diamondInvoice
}

export default _extendGpInvoice
