import { _mssqlConfig, cacheTTL } from '../config.js';
import * as sqlPool from '@cityssm/mssql-multi-pool';
import Debug from 'debug';
const debug = Debug('dynamics-gp:gp:getVendorByVendorId');
import NodeCache from 'node-cache';
const vendorCache = new NodeCache({ stdTTL: cacheTTL });
export async function getVendorByVendorId(vendorId) {
    var _a;
    let vendor = (_a = vendorCache.get(vendorId)) !== null && _a !== void 0 ? _a : undefined;
    if (vendor === undefined && !vendorCache.has(vendorId)) {
        try {
            const pool = await sqlPool.connect(_mssqlConfig);
            const vendorResult = await pool.request().input('vendorId', vendorId)
                .query(`SELECT 
          rtrim([VENDORID]) as vendorId,
          rtrim([VENDNAME]) as vendorName,
          rtrim([VNDCHKNM]) as vendorCheckName,
          rtrim([VENDSHNM]) as shortName,
          rtrim([VNDCNTCT]) as contactPerson,
          rtrim([ADDRESS1]) as address1,
          rtrim([ADDRESS2]) as address2,
          rtrim([ADDRESS3]) as address3,
          rtrim([CITY]) as city,
          rtrim([STATE]) as state,
          rtrim([COUNTRY]) as country,
          rtrim([ZIPCODE]) as zipCode,
          rtrim([PHNUMBR1]) as phoneNumber1,
          rtrim([PHNUMBR2]) as phoneNumber2,
          rtrim([PHONE3]) as phoneNumber3,
          rtrim([FAXNUMBR]) as faxNumber,
          rtrim([COMMENT1]) as comment1,
          rtrim([COMMENT2]) as comment2,
          [CREATDDT] as dateCreated,
          [MODIFDT] as dateModified
          FROM [PM00200]
          where VENDORID = @vendorId`);
            if (vendorResult.recordset && vendorResult.recordset.length > 0) {
                vendor = vendorResult.recordset[0];
            }
            vendorCache.set(vendorId, vendor);
        }
        catch (error) {
            debug('Query Error: Check your database credentials.');
            debug(error);
            throw error;
        }
    }
    else {
        debug(`Cache hit: ${vendorId}`);
    }
    debug(vendor);
    return vendor;
}
export function clearVendorCache() {
    vendorCache.flushAll();
}
export default getVendorByVendorId;
