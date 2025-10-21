import { calculateAverageEfficiency, calculateTotalCost, calculateTotalFuel } from "./functions"
import { TruckRanking } from "../types/ranking-equipos"
import { ConsumoData } from "../types/consumo-data"

export function calculateTruckRanking(data: ConsumoData[]): TruckRanking[] {
    const truckMap = new Map<string, ConsumoData[]>()
    data.forEach((item) => {
        if (!truckMap.has(item.equipoId)) {
            truckMap.set(item.equipoId, [])
        }
        truckMap.get(item.equipoId)!.push(item)
    })

    const rankings: TruckRanking[] = []
    truckMap.forEach((items, equipoId) => {
        const totalFuelUsed = calculateTotalFuel(items)
        const averageEfficiency = calculateAverageEfficiency(items)
        const totalCost = calculateTotalCost(items)
        const equipoName = items[0]?.equipo?.numEconomico || equipoId

        rankings.push({
            equipoId,
            equipoName,
            totalFuelUsed,
            averageEfficiency,
            totalCost,
            isMostEfficient: false,
            isLeastEfficient: false,
        })
    })

    rankings.sort((a, b) => b.averageEfficiency - a.averageEfficiency)

    if (rankings.length > 0) {
        rankings[0].isMostEfficient = true
        rankings[rankings.length - 1].isLeastEfficient = true
    }

    return rankings
}