import { type mssqlTypes } from '@cityssm/mssql-multi-pool';
import type { GPCustomer } from './types.js';
export declare function _getCustomerByCustomerNumber(mssqlConfig: mssqlTypes.config, customerNumber: string): Promise<GPCustomer | undefined>;
export default _getCustomerByCustomerNumber;
