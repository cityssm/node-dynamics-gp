export function buildAccountNumberFromSegments(
  accountNumberSegments: string[]
): string {
  return accountNumberSegments.join('-').replace(/-+$/, '')
}
