import type { GPAccount } from './types';
export declare function getAccountByAccountIndex(accountIndex: number | string): Promise<GPAccount>;
export declare function clearAccountCache(): void;
export default getAccountByAccountIndex;
