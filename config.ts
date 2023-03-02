import type { config as MSSQLConfig } from 'mssql'

export let _mssqlConfig: MSSQLConfig

export function setMSSQLConfig(mssqlConfig: MSSQLConfig): void {
  _mssqlConfig = mssqlConfig
}

export const cacheTTL = 2 * 60