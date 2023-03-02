import { _mssqlConfig, cacheTTL } from '../config.js';
import * as sqlPool from '@cityssm/mssql-multi-pool';
import { buildAccountNumberFromSegments } from './utilities.js';
import Debug from 'debug';
const debug = Debug('dynamics-gp:gp:getAccountByAccountIndex');
import NodeCache from 'node-cache';
const accountCache = new NodeCache({ stdTTL: cacheTTL });
export async function getAccountByAccountIndex(accountIndex) {
    let account = accountCache.get(accountIndex);
    if (account === undefined) {
        try {
            const pool = await sqlPool.connect(_mssqlConfig);
            const accountResult = await pool
                .request()
                .input('accountIndex', accountIndex).query(`SELECT
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
            if (accountResult.recordset && accountResult.recordset.length > 0) {
                account = accountResult.recordset[0];
                account.accountNumber = buildAccountNumberFromSegments([
                    account.accountNumberSegment1,
                    account.accountNumberSegment2,
                    account.accountNumberSegment3,
                    account.accountNumberSegment4,
                    account.accountNumberSegment5,
                    account.accountNumberSegment6
                ]);
            }
            accountCache.set(accountIndex, account);
        }
        catch (error) {
            debug(error);
        }
    }
    else {
        debug(`Cache hit: ${accountIndex}`);
    }
    debug(account);
    return account;
}
export default getAccountByAccountIndex;
