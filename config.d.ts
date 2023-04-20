import type { config as MSSQLConfig } from 'mssql';
export declare let _mssqlConfig: MSSQLConfig;
export declare function setMSSQLConfig(mssqlConfig: MSSQLConfig): void;
export declare const cacheTTL: number;
export declare const documentCacheTTL = 60;
export declare const queryErrorMessage = "Query Error: Check your database credentials.";
