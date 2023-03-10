import type { GPCustomer } from './types';
export declare function getCustomerByCustomerNumber(customerNumber: string): Promise<GPCustomer>;
export declare function clearCustomerCache(): void;
export default getCustomerByCustomerNumber;
