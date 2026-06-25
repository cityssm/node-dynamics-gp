import { type mssql } from '@cityssm/mssql-multi-pool';
import type { DiamondTaxedProperty } from './types.js';
export default function _getAllTaxedProperties(mssqlConfig: mssql.config, limit?: number, offset?: number): Promise<DiamondTaxedProperty[]>;
