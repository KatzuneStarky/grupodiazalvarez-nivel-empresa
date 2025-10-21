import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { AlertaConsumo } from "../types/alertas-consumo"
import { ConsumoData } from "../types/consumo-data"

export function detectEfficiencyDrops(data: ConsumoData[]): AlertaConsumo[] {
    const alerts: AlertaConsumo[] = []

    const sortedData = [...data].sort((a, b) => {
        const dateA = parseFirebaseDate(a.fecha) || new Date()
        const dateB = parseFirebaseDate(b.fecha) || new Date()
        return dateA.getTime() - dateB.getTime()
    })

    const validCosts = sortedData.filter((item) => item.costoLitro && item.costoLitro > 0)
    const avgCostPerLiter =
        validCosts.length > 0 ? validCosts.reduce((sum, item) => sum + (item.costoLitro || 0), 0) / validCosts.length : 0

    const truckMap = new Map<string, ConsumoData[]>()
    sortedData.forEach((item) => {
        if (!truckMap.has(item.equipoId)) {
            truckMap.set(item.equipoId, [])
        }
        truckMap.get(item.equipoId)!.push(item)
    })

    truckMap.forEach((items, equipoId) => {
        for (let i = 1; i < items.length; i++) {
            const current = items[i]
            const previous = items[i - 1]

            if (current.rendimientoKmL && previous.rendimientoKmL && previous.rendimientoKmL > 0) {
                const dropPercentage = ((previous.rendimientoKmL - current.rendimientoKmL) / previous.rendimientoKmL) * 100

                if (dropPercentage > 20) {
                    alerts.push({
                        id: `drop-${current.id}`,
                        type: "critical",
                        message: `Sudden efficiency drop of ${dropPercentage.toFixed(1)}% detected for ${current.equipo?.numEconomico || equipoId
                            }`,
                        equipoId,
                        fecha: current.fecha instanceof Date ? current.fecha : new Date(),
                    })
                }
            }

            if (current.rendimientoKmL && current.rendimientoKmL < 2.5) {
                alerts.push({
                    id: `low-efficiency-${current.id}`,
                    type: "warning",
                    message: `Low fuel efficiency (${current.rendimientoKmL.toFixed(2)} km/L) for ${current.equipo?.numEconomico || equipoId
                        }`,
                    equipoId,
                    fecha: current.fecha instanceof Date ? current.fecha : new Date(),
                })
            }

            if (current.costoLitro && avgCostPerLiter > 0) {
                const costDifference = ((current.costoLitro - avgCostPerLiter) / avgCostPerLiter) * 100
                if (costDifference > 15) {
                    alerts.push({
                        id: `high-cost-${current.id}`,
                        type: "warning",
                        message: `Fuel cost ${costDifference.toFixed(1)}% above average for ${current.equipo?.numEconomico || equipoId
                            }`,
                        equipoId,
                        fecha: current.fecha instanceof Date ? current.fecha : new Date(),
                    })
                }
            }
        }
    })

    return alerts
}