import { type mssql } from '@cityssm/mssql-multi-pool';
import type { GPItemWithQuantities } from './types.js';
export default function _getItemByItemNumber(mssqlConfig: mssql.config, itemNumber: string): Promise<GPItemWithQuantities | undefined>;
