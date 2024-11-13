import { type mssqlTypes } from '@cityssm/mssql-multi-pool';
import type { GPVendor } from './types.js';
export default function _getVendorByVendorId(mssqlConfig: mssqlTypes.config, vendorId: string): Promise<GPVendor | undefined>;
