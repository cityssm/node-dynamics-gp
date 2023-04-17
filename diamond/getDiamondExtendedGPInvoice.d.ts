import type { GPInvoice } from '../gp/types.js';
import type { DiamondExtendedGPInvoice } from './types.js';
export declare function extendGPInvoice(gpInvoice: GPInvoice): Promise<DiamondExtendedGPInvoice>;
export declare function getDiamondExtendedGPInvoice(invoiceNumber: string, invoiceDocumentTypeOrAbbreviationOrName?: number | string): Promise<DiamondExtendedGPInvoice | undefined>;
export declare function clearCaches(): void;
export default getDiamondExtendedGPInvoice;
