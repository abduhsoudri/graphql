export function formatXpForCard(amount) {
    if (amount >= 1000000) {
        return { value: (amount / 1000000).toFixed(2), unit: 'MB' };
    }
    if (amount >= 1000) {
        return { value: (amount / 1000).toFixed(0), unit: 'kB' };
    }
    return { value: amount, unit: 'B' };
}

export function formatXpForProject(amount) {
    if (amount >= 1000) {
        return `${Math.round(amount / 1000)} kB`;
    }
    return `${amount} B`;
}
