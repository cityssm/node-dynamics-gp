import { type mssqlTypes } from '@cityssm/mssql-multi-pool';
import type { GPItemWithQuantity } from './types.js';
export default function _getItemsByLocationCodes(mssqlConfig: mssqlTypes.config, locationCodes?: string[]): Promise<GPItemWithQuantity[]>;
