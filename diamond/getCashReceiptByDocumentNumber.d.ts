import type { DiamondCashReceipt } from './types';
export declare function getCashReceiptByDocumentNumber(documentNumber: number | string): Promise<DiamondCashReceipt>;
export declare function clearCashReceiptCache(): void;
export default getCashReceiptByDocumentNumber;
