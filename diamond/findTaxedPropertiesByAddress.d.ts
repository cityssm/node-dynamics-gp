import { type mssql } from '@cityssm/mssql-multi-pool';
import type { DiamondTaxedProperty } from './types.js';
export default function _findTaxedPropertiesByAddress(mssqlConfig: mssql.config, address: {
    civicNumber: string;
    streetName: string;
    unitNumberOrQualifier?: string;
}, exactMatch?: boolean): Promise<DiamondTaxedProperty[]>;
