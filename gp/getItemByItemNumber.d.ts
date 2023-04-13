import type { GPItem } from './types';
export declare function getItemByItemNumber(itemNumber: string): Promise<GPItem | undefined>;
export declare function clearItemCache(): void;
export default getItemByItemNumber;
