import { type mssql } from '@cityssm/mssql-multi-pool';
import type { GPAccount } from './types.js';
export default function _getAccountByAccountIndex(mssqlConfig: mssql.config, accountIndex: number | string): Promise<GPAccount | undefined>;
