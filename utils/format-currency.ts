export const formatCurrency = (value: number): string => {
    return `
        $${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
    `;
};

export function formatCurrencyInvoice(value: number, currency: string = 'MXN') {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: currency
    }).format(value)
}