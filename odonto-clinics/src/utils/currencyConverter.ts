/**Converte para Reais @param {string} amount - valor em reais BRL*/
export function currencyConverter(amount:string) {
    const numericPrice = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
    const cents = Math.round(numericPrice*100)
    return cents;
}