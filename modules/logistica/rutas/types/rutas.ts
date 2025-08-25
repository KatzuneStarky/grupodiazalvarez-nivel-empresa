import { ClasificacionRuta, PuntoGeografico, TipoViaje, Trayecto } from "../../equipos/types/rutas"

export interface Ruta {
  id: string
  idCliente: string
  cliente?: []
  origen: PuntoGeografico
  destino: PuntoGeografico
  descripcion: string
  tipoViaje: TipoViaje
  clasificacion: ClasificacionRuta
  activa: boolean
  viajeFacturable: boolean
  trayecto: Trayecto
}

export interface RouteMapProps {
  origen?: PuntoGeografico | null
  destino?: PuntoGeografico | null
  onOriginSelect?: (point: PuntoGeografico) => void
  onDestinationSelect?: (point: PuntoGeografico) => void
  selectionMode?: "none" | "origin" | "destination"
  editable?: boolean
  className?: string
}