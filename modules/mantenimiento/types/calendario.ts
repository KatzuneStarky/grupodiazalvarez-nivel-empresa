import { Mantenimiento } from "@/modules/logistica/bdd/equipos/types/mantenimiento"
import { Equipo } from "@/modules/logistica/bdd/equipos/types/equipos"

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  resource: {
    mantenimiento: Mantenimiento | null
    equipo: Equipo | null
    urgency: "safe" | "warning" | "urgent"
  }
}