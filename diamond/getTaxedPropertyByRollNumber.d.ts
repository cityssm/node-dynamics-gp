import { type mssql } from '@cityssm/mssql-multi-pool';
import type { DiamondTaxedProperty } from './types.js';
export default function _getTaxedPropertyByRollNumber(mssqlConfig: mssql.config, rollNumber: number | string): Promise<DiamondTaxedProperty | undefined>;
