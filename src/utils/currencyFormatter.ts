export const formatCurrency = (value: number): string => {
    const valueInReais = value / 100;
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(valueInReais);
};


export const parseCurrency = (value: string): number => {
    const numericString = value.replace(/\D/g, '');

    if (!numericString) return 0;

    return parseInt(numericString, 10);
};


export const filterNumericInput = (value: string, newChar: string): string => {
    if (!/^\d$/.test(newChar)) {
        return value;
    }

    return value + newChar;
};