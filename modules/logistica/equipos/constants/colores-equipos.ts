import { EstadoEquipos } from "../../bdd/equipos/enum/estado-equipos"

export function getStatusColor(estado: EstadoEquipos): string {
  switch (estado.toLowerCase()) {
    case "activo":
    case "operativo":
      return "bg-green-500"
    case "mantenimiento":
      return "bg-yellow-500"
    case "fuera de servicio":
    case "inactivo":
      return "bg-red-500"
    case "en ruta":
      return "bg-blue-500"
    case "cargando":
      return "bg-purple-500"
    default:
      return "bg-gray-500"
  }
}

export function getPriorityColor(prioridad: EstadoEquipos): string {
  switch (prioridad.toLowerCase()) {
    case "alta":
      return "text-red-600 bg-red-50"
    case "media":
      return "text-yellow-600 bg-yellow-50"
    case "baja":
      return "text-green-600 bg-green-50"
    default:
      return "text-gray-600 bg-gray-50"
  }
}