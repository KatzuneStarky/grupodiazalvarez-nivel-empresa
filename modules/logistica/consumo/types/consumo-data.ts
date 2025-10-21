import { ReporteViajes } from "../../reportes-viajes/types/reporte-viajes"
import { Operador } from "../../bdd/operadores/types/operadores"
import { Equipo } from "../../bdd/equipos/types/equipos"
import { ConsumoCombustible } from "./consumo"

export interface ConsumoData extends ConsumoCombustible {
    equipo?: Equipo
    viaje?: ReporteViajes
    operador?: Operador
}