import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EquipmentUtilization } from "@/types/equipment-utilization"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface EquipmentUtilizationTableProps {
  data: EquipmentUtilization[]
}

export function EquipmentUtilizationTable({ data }: EquipmentUtilizationTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "mas usado":
        return "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
      case "poco usado":
        return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
      case "nada usado":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      default:
        return ""
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "mas usado":
        return "Mas usado"
      case "poco usado":
        return "Poco usado"
      case "nada usado":
        return "Nada usado"
      default:
        return status
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Utilización de Equipos</CardTitle>
        <CardDescription>Estado y rendimiento de la flota</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="space-y-4 h-[200px] px-4">
          {data.map((equipment) => (
            <div key={equipment.equipo} className="flex items-center justify-between border-b pb-3 last:border-0">
              <div className="space-y-1">
                <p className="font-medium">{equipment.equipo}</p>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>{equipment.totalTrips} viajes</span>
                  <span>{equipment.totalLiters.toLocaleString()} L</span>
                  <span>{equipment.avgEfficiency} L/viaje</span>
                </div>
              </div>
              <Badge className={getStatusColor(equipment.status)}>{getStatusLabel(equipment.status)}</Badge>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}