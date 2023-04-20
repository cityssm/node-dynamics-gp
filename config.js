export let _mssqlConfig;
export function setMSSQLConfig(mssqlConfig) {
    _mssqlConfig = mssqlConfig;
}
export const cacheTTL = 3 * 60;
export const documentCacheTTL = 60;
export const queryErrorMessage = 'Query Error: Check your database credentials.';
