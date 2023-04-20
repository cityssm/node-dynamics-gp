import { _mssqlConfig, cacheTTL } from '../config.js';
import * as sqlPool from '@cityssm/mssql-multi-pool';
import Debug from 'debug';
const debug = Debug('dynamics-gp:gp:getInvoiceDocumentTypes');
let documentTypesCache;
let documentTypesCacheExpiryMillis = 0;
export async function getInvoiceDocumentTypes() {
    let invoiceDocumentTypes = documentTypesCache;
    if (invoiceDocumentTypes === undefined ||
        documentTypesCacheExpiryMillis < Date.now()) {
        try {
            const pool = await sqlPool.connect(_mssqlConfig);
            const result = await pool.request()
                .query(`SELECT [DOCTYPE] as invoiceDocumentType,
          rtrim([DOCTYABR]) as documentTypeAbbreviation,
          rtrim([DOCTYNAM]) as documentTypeName
          FROM [IVC40101]
          order by DEX_ROW_ID`);
            invoiceDocumentTypes = result.recordset;
            documentTypesCache = invoiceDocumentTypes;
            documentTypesCacheExpiryMillis = Date.now() + cacheTTL * 1000;
        }
        catch (error) {
            debug('Query Error: Check your database credentials.');
            debug(error);
            throw error;
        }
    }
    else {
        debug('Cache hit');
    }
    debug(invoiceDocumentTypes);
    return invoiceDocumentTypes;
}
export function clearInvoiceDocumentTypesCache() {
    documentTypesCache = undefined;
    documentTypesCacheExpiryMillis = 0;
}
export default getInvoiceDocumentTypes;
