import { type mssqlTypes } from '@cityssm/mssql-multi-pool';
import type { GPItemWithQuantities } from './types.js';
export default function _getItemByItemNumber(mssqlConfig: mssqlTypes.config, itemNumber: string): Promise<GPItemWithQuantities | undefined>;
