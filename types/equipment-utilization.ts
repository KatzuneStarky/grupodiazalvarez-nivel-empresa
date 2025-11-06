export interface EquipmentUtilization {
  equipo: string
  totalTrips: number
  totalLiters: number
  avgEfficiency: number
  status: "mas usado" | "poco usado" | "nada usado"
}