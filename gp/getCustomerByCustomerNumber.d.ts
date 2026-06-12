import { type mssql } from '@cityssm/mssql-multi-pool';
import type { GPCustomer } from './types.js';
export default function _getCustomerByCustomerNumber(mssqlConfig: mssql.config, customerNumber: string): Promise<GPCustomer | undefined>;
