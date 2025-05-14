/**
 * Joins the segments of an account number into a single string.
 * It removes any trailing hyphens from the joined string.
 * @param accountNumberSegments - The segments of the account number.
 * @returns The full account number as a string.
 */
export function buildAccountNumberFromSegments(
  accountNumberSegments: string[]
): string {
  const joined = accountNumberSegments.join('-')
  let end = joined.length - 1
  while (end >= 0 && joined.charAt(end) === '-') {
    end--
  }
  return joined.slice(0, Math.max(0, end + 1))
}
