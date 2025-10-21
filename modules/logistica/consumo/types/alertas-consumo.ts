export interface AlertaConsumo {
  id: string
  type: "critical" | "warning" | "normal"
  message: string
  equipoId: string
  fecha: Date
}