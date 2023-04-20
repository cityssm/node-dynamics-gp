import type { config as MSSQLConfig } from 'mssql'

export let _mssqlConfig: MSSQLConfig

/**
 * 
 * @param mssqlConfig SQL Server credentials with read access
 */
export function setMSSQLConfig(mssqlConfig: MSSQLConfig): void {
  _mssqlConfig = mssqlConfig
}

/**
 * Time in seconds until cached lookup records expire
 */
export const cacheTTL = 3 * 60

/**
 * Time in seconds until cached document records expire
 */
export const documentCacheTTL = 60

export const queryErrorMessage = 'Query Error: Check your database credentials.'