import { type mssql } from '@cityssm/mssql-multi-pool';
import type { DiamondTaxedPropertyOwner } from './types.js';
export default function _getTaxedPropertyOwnersByRollNumber(mssqlConfig: mssql.config, rollNumber: number | string): Promise<DiamondTaxedPropertyOwner[]>;
