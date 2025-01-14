import { type mssql } from '@cityssm/mssql-multi-pool';
import type { GPVendor } from './types.js';
export default function _getVendorByVendorId(mssqlConfig: mssql.config, vendorId: string): Promise<GPVendor | undefined>;
