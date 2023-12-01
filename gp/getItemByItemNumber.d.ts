import type { config as MSSQLConfig } from 'mssql';
import type { GPItem } from './types.js';
export declare function _getItemByItemNumber(mssqlConfig: MSSQLConfig, itemNumber: string): Promise<GPItem | undefined>;
export default _getItemByItemNumber;
