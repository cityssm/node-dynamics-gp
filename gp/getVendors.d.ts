import { type mssql } from '@cityssm/mssql-multi-pool';
import type { GPVendor } from './types.js';
export interface GetVendorsFilters {
    vendorId: string;
    notVendorClassIds: string[];
    vendorClassIds: string[];
    vendorNameContains: string[];
    vendorNameDoesNotContain: string[];
    lastPurchaseDateMin: Date;
}
export default function _getVendors(mssqlConfig: mssql.config, vendorFilters?: Partial<GetVendorsFilters>): Promise<GPVendor[]>;
