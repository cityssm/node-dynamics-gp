export function buildAccountNumberFromSegments(accountNumberSegments) {
    return accountNumberSegments.join('-').replace(/-+$/, '');
}
