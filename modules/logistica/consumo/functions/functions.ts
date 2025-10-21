import { ConsumoData } from "../types/consumo-data";

export function calculateTotalFuel(data: ConsumoData[]): number {
    return data.reduce((sum, item) => sum + (item.litrosCargados || 0), 0)
}

export function calculateAverageEfficiency(data: ConsumoData[]): number {
    const validData = data.filter((item) => item.rendimientoKmL && item.rendimientoKmL > 0)
    if (validData.length === 0) return 0

    const sum = validData.reduce((acc, item) => acc + (item.rendimientoKmL || 0), 0)
    return sum / validData.length
}

export function calculateTotalCost(data: ConsumoData[]): number {
  return data.reduce((sum, item) => sum + (item.costoTotal || 0), 0)
}