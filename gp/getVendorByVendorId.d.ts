import type { config as MSSQLConfig } from 'mssql';
import type { GPVendor } from './types.js';
export declare function _getVendorByVendorId(mssqlConfig: MSSQLConfig, vendorId: string): Promise<GPVendor | undefined>;
export default _getVendorByVendorId;
