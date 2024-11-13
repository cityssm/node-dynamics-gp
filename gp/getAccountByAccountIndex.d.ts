import { type mssqlTypes } from '@cityssm/mssql-multi-pool';
import type { GPAccount } from './types.js';
export default function _getAccountByAccountIndex(mssqlConfig: mssqlTypes.config, accountIndex: number | string): Promise<GPAccount | undefined>;
