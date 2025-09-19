export function getBackgroundColorMagna(valorDia: number): string {
  if (valorDia >= 2) return "bg-emerald-700";
  if (valorDia === 1) return "bg-[rgb(0,165,81)]";
  if (valorDia > 1 && valorDia < 2) return "bg-emerald-600";
  if (valorDia > 0 && valorDia < 1) return "bg-[rgba(0,165,81,0.1)]";
  return "";
}