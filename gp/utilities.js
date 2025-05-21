export function buildAccountNumberFromSegments(accountNumberSegments) {
    const joined = accountNumberSegments.join('-');
    let end = joined.length - 1;
    while (end >= 0 && joined.charAt(end) === '-') {
        end--;
    }
    return joined.slice(0, Math.max(0, end + 1));
}
