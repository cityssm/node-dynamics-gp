import { type mssql } from '@cityssm/mssql-multi-pool';
import type { DiamondCashReceipt } from './types.js';
export default function _getCashReceiptByDocumentNumber(mssqlConfig: mssql.config, documentNumber: number | string): Promise<DiamondCashReceipt | undefined>;
