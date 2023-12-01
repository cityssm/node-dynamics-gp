import { type config as MSSQLConfig } from 'mssql';
import type { GPCustomer } from './types.js';
export declare function _getCustomerByCustomerNumber(mssqlConfig: MSSQLConfig, customerNumber: string): Promise<GPCustomer | undefined>;
export default _getCustomerByCustomerNumber;
