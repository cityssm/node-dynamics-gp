import { type mssql } from '@cityssm/mssql-multi-pool';
import type { DiamondTaxedPropertyAssessment } from './types.js';
export default function _getTaxedPropertyAssessmentsByRollNumber(mssqlConfig: mssql.config, rollNumber: number | string): Promise<DiamondTaxedPropertyAssessment[]>;
