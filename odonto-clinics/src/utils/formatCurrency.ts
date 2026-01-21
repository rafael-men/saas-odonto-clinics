const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    currency: 'BRL',
    style: 'currency',
    minimumFractionDigits: 0
});

export function formatCurrency(value: number) {
    return currencyFormatter.format(value);
}