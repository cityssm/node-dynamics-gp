import { connect } from '@cityssm/mssql-multi-pool'
import { type config as MSSQLConfig, type IResult } from 'mssql'

import type { GPAccount } from './types.js'
import { buildAccountNumberFromSegments } from './utilities.js'

export async function _getAccountByAccountIndex(
  mssqlConfig: MSSQLConfig,
  accountIndex: number | string
): Promise<GPAccount | undefined> {
  let account: GPAccount | undefined

  const pool = await connect(mssqlConfig)

  const accountResult: IResult<GPAccount> = await pool
    .request()
    .input('accountIndex', accountIndex).query(`SELECT top 1
      [ACTINDX] as accountIndex,
      rtrim([ACTNUMBR_1]) as accountNumberSegment1,
      rtrim([ACTNUMBR_2]) as accountNumberSegment2,
      rtrim([ACTNUMBR_3]) as accountNumberSegment3,
      rtrim([ACTNUMBR_4]) as accountNumberSegment4,
      rtrim([ACTNUMBR_5]) as accountNumberSegment5,
      rtrim([ACTNUMBR_6]) as accountNumberSegment6,
      rtrim([ACTALIAS]) as accountAlias,
      rtrim([ACTDESCR]) as accountDescription,
      cast([ACTIVE] as bit) as active,
      [CREATDDT] as dateCreated,
      [MODIFDT] as dateModified
      FROM [GL00100]
      where ACTINDX = @accountIndex`)

  if (accountResult.recordset.length > 0) {
    account = accountResult.recordset[0]

    account.accountNumber = buildAccountNumberFromSegments([
      account.accountNumberSegment1,
      account.accountNumberSegment2,
      account.accountNumberSegment3,
      account.accountNumberSegment4,
      account.accountNumberSegment5,
      account.accountNumberSegment6
    ])
  }

  return account
}

export default _getAccountByAccountIndex
