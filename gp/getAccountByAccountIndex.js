import { connect } from '@cityssm/mssql-multi-pool';
import { buildAccountNumberFromSegments } from './utilities.js';
export async function _getAccountByAccountIndex(mssqlConfig, accountIndex) {
    const pool = await connect(mssqlConfig);
    const accountResult = await pool
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
      where ACTINDX = @accountIndex`);
    const account = accountResult.recordset.length > 0 ? accountResult.recordset[0] : undefined;
    if (account !== undefined) {
        account.accountNumber = buildAccountNumberFromSegments([
            account.accountNumberSegment1,
            account.accountNumberSegment2,
            account.accountNumberSegment3,
            account.accountNumberSegment4,
            account.accountNumberSegment5,
            account.accountNumberSegment6
        ]);
    }
    return account;
}
export default _getAccountByAccountIndex;
