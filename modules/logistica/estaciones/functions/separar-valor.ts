import { weekdays } from "../constants/weekdays";

export function separarValor(valor: number, diaSeleccionado: string): { [key: string]: number } {
  const resultado: { [key: string]: number } = {};
  const startIndex = weekdays.indexOf(diaSeleccionado);

  const entero = Math.floor(valor);
  const decimal = valor - entero;

  for (let i = 0; i < entero; i++) {
    const dia = weekdays[(startIndex + i) % 7];
    resultado[dia] = (resultado[dia] || 0) + 1;
  }

  if (decimal > 0) {
    const diaExtra = weekdays[(startIndex + entero) % 7];
    resultado[diaExtra] = (resultado[diaExtra] || 0) + decimal;
  }

  return resultado;
}