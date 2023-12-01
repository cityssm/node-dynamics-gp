import { type config as MSSQLConfig } from 'mssql';
import type { GPAccount } from './types.js';
export declare function _getAccountByAccountIndex(mssqlConfig: MSSQLConfig, accountIndex: number | string): Promise<GPAccount | undefined>;
export default _getAccountByAccountIndex;
