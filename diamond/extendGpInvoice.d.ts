import type { config as MSSQLConfig } from 'mssql';
import type { GPInvoice } from '../gp/types.js';
import type { DiamondExtendedGPInvoice } from './types.js';
export default function _extendGpInvoice(mssqlConfig: MSSQLConfig, gpInvoice: GPInvoice): Promise<DiamondExtendedGPInvoice>;
