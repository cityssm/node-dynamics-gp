import type { GPVendor } from './types';
export declare function getVendorByVendorId(vendorId: string): Promise<GPVendor>;
export declare function clearVendorCache(): void;
export default getVendorByVendorId;
