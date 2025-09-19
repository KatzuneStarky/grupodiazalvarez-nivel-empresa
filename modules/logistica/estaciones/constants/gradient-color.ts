export function getGradientMagna(valorDia: number) {
    if (valorDia > 1 && valorDia < 2) {
        const percent = (valorDia % 1) * 100;
        return { background: `linear-gradient(to right, #027319 ${percent}%, transparent ${percent}%)` };
    }
    return {};
}