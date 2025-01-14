import { DEBUG_ENABLE_NAMESPACES as DEBUG_ENABLE_NAMESPACES_MSSQL } from '@cityssm/mssql-multi-pool/debug'

/**
 * The debug namespace for this package.
 */
export const DEBUG_NAMESPACE = 'dynamics-gp'

/**
 * The debug namespaces string to enable debug output for this package.
 */
export const DEBUG_ENABLE_NAMESPACES = [
  `${DEBUG_NAMESPACE}:*`,
  DEBUG_ENABLE_NAMESPACES_MSSQL
].join(',')
