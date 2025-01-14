import { DEBUG_ENABLE_NAMESPACES as DEBUG_ENABLE_NAMESPACES_MSSQL } from '@cityssm/mssql-multi-pool/debug';
export const DEBUG_NAMESPACE = 'dynamics-gp';
export const DEBUG_ENABLE_NAMESPACES = [
    `${DEBUG_NAMESPACE}:*`,
    DEBUG_ENABLE_NAMESPACES_MSSQL
].join(',');
