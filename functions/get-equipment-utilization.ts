import { ReporteViajes } from "@/modules/logistica/reportes-viajes/types/reporte-viajes"
import { EquipmentUtilization } from "@/types/equipment-utilization"

export function getEquipmentUtilization(trips: ReporteViajes[]): EquipmentUtilization[] {
  const equipmentMap = new Map<string, EquipmentUtilization>()

  trips.forEach((trip) => {
    const existing = equipmentMap.get(trip.Equipo)
    if (existing) {
      existing.totalTrips += 1
      existing.totalLiters += trip.LitrosA20 ?? 0
    } else {
      equipmentMap.set(trip.Equipo, {
        equipo: trip.Equipo,
        totalTrips: 1,
        totalLiters: trip.LitrosA20 ?? 0,
        avgEfficiency: 0,
        status: "mas usado",
      })
    }
  })

  return Array.from(equipmentMap.values()).map((eq) => ({
    ...eq,
    avgEfficiency: Math.round(eq.totalLiters / eq.totalTrips),
    status: eq.totalTrips > 10 ? "mas usado" : eq.totalTrips > 5 ? "poco usado" : "nada usado",
  }))
}