import type { DiamondCashReceipt } from './types';
export declare function getCashReceiptByDocumentNumber(documentNumber: number | string): Promise<DiamondCashReceipt | undefined>;
export declare function clearCashReceiptCache(): void;
export default getCashReceiptByDocumentNumber;
