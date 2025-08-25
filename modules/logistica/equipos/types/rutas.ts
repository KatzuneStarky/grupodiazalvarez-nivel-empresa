export type ClasificacionRuta = "material peligroso" | "grava de 3/4" | "cemento" | "arena" | "agua"
export type TipoViaje = "local" | "foráneo"

export interface PuntoGeografico {
  nombre: string
  latitud: number
  longitud: number
}

export interface Trayecto {
  id: string
  origen: PuntoGeografico
  destino: PuntoGeografico
  kilometros: number
  horas: number
  tipoTrayecto: "sencillo" | "redondo" | "otro"
  activo: boolean
}

export interface Ruta {
  id: string
  idCliente: string
  cliente?: []
  origen: PuntoGeografico | null
  destino: PuntoGeografico | null
  descripcion: string
  tipoViaje: TipoViaje
  clasificacion: ClasificacionRuta
  activa: boolean
  viajeFacturable: boolean
  trayecto: Trayecto
  createdAt: Date
  updatedAt: Date
}