import { _mssqlConfig } from '../config.js';
import * as sqlPool from '@cityssm/mssql-multi-pool';
import Debug from 'debug';
const debug = Debug('dynamics-gp:gp:getInvoiceDocumentTypes');
export async function getInvoiceDocumentTypes() {
    let invoiceDocumentTypes;
    try {
        const pool = await sqlPool.connect(_mssqlConfig);
        const result = await pool.request()
            .query(`SELECT [DOCTYPE] as invoiceDocumentType,
        rtrim([DOCTYABR]) as documentTypeAbbreviation,
        rtrim([DOCTYNAM]) as documentTypeName
        FROM [IVC40101]
        order by DEX_ROW_ID`);
        invoiceDocumentTypes = result.recordset;
    }
    catch (error) {
        debug(error);
    }
    debug(invoiceDocumentTypes);
    return invoiceDocumentTypes;
}
