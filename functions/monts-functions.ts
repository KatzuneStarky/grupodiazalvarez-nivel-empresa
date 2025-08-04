import { meses } from "@/constants/meses";

export const getCurrentMonthCapitalized = (): string => {
    const date = new Date();
    const monthIndex = date.getMonth();
    const capitalizedMonthName
        = meses[monthIndex].charAt(0).toUpperCase()
        + meses[monthIndex].slice(1);

    return capitalizedMonthName
}

export const getPreviousMonthCapitalized = (): string => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    const month = date.toLocaleString('default', { month: 'long' });
    return month.charAt(0).toUpperCase() + month.slice(1);
};

export const getPreviousMonth = (mes: string): string => {
    const currentMonthIndex = meses.indexOf(mes);
    const previousMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;
    return meses[previousMonthIndex];
};

export const getMonthNameCapitalized = (monthIndex: number): string => {
    if (monthIndex < 0 || monthIndex > 11) {
        monthIndex = (monthIndex % 12 + 12) % 12; // Asegura que esté entre 0-11
    }
    return meses[monthIndex].charAt(0).toUpperCase() + meses[monthIndex].slice(1);
};