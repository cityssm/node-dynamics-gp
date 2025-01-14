import { type mssql } from '@cityssm/mssql-multi-pool';
import type { GPItemWithQuantity } from './types.js';
export default function _getItemsByLocationCodes(mssqlConfig: mssql.config, locationCodes?: string[]): Promise<GPItemWithQuantity[]>;
