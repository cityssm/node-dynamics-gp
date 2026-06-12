import { type mssql, connect } from '@cityssm/mssql-multi-pool'

import type { GPAccount } from './types.js'
import { buildAccountNumberFromSegments } from './utilities.js'

/**
 * Retrieves a GP account by its account index.
 * @param mssqlConfig - The configuration for the SQL Server connection.
 * @param accountIndex - The account index to look up.
 * @returns A promise that resolves to the GP account, or undefined if not found.
 */
export default async function _getAccountByAccountIndex(
  mssqlConfig: mssql.config,
  accountIndex: number | string
): Promise<GPAccount | undefined> {
  const pool = await connect(mssqlConfig)

  const accountResult = await pool
    .request()
    .input('accountIndex', accountIndex)
    .query<GPAccount>(/* sql */ `
      SELECT
        TOP 1 [ACTINDX] AS accountIndex,
        rtrim([ACTNUMBR_1]) AS accountNumberSegment1,
        rtrim([ACTNUMBR_2]) AS accountNumberSegment2,
        rtrim([ACTNUMBR_3]) AS accountNumberSegment3,
        rtrim([ACTNUMBR_4]) AS accountNumberSegment4,
        rtrim([ACTNUMBR_5]) AS accountNumberSegment5,
        rtrim([ACTNUMBR_6]) AS accountNumberSegment6,
        rtrim([ACTALIAS]) AS accountAlias,
        rtrim([ACTDESCR]) AS accountDescription,
        cast([ACTIVE] AS BIT) AS active,
        [CREATDDT] AS dateCreated,
        [MODIFDT] AS dateModified
      FROM
        [GL00100]
      WHERE
        ACTINDX = @accountIndex
    `)

  const account: GPAccount | undefined =
    accountResult.recordset.length > 0 ? accountResult.recordset[0] : undefined

  if (account !== undefined) {
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
