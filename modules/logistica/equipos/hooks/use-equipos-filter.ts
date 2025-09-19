import { EstadoEquipos } from "../../bdd/equipos/enum/estado-equipos"
import { useEquipos } from "../../bdd/equipos/hooks/use-equipos"
import { Equipo } from "../../bdd/equipos/types/equipos"
import { useMemo, useState } from "react"

type SortField = "numEconomico" | "year" | "marca" | "modelo"
type SortOrder = "asc" | "desc"

export const useEquiposFilter = (onEquipoClick?: (equipo: Equipo) => void) => {
    const [selectedEquipo, setSelectedEquipo] = useState<Equipo | null>(null)
    const [grupoUnidadFilter, setGrupoUnidadFilter] = useState<string>("all")
    const [tipoUnidadFilter, setTipoUnidadFilter] = useState<string>("all")
    const [sortField, setSortField] = useState<SortField>("numEconomico")
    const [modeloFilter, setModeloFilter] = useState<string>("all")
    const [estadoFilter, setEstadoFilter] = useState<string>("all")
    const [marcaFilter, setMarcaFilter] = useState<string>("all")
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
    const [searchTerm, setSearchTerm] = useState("")

    const { equipos } = useEquipos()

    const uniqueMarcas = useMemo(() => [...new Set(equipos.map((e) => e.marca))], [equipos])
    const uniqueModelos = useMemo(() => [...new Set(equipos.map((e) => e.modelo))], [equipos])
    const uniqueTiposUnidad = useMemo(() => [...new Set(equipos.map((e) => e.tipoUnidad).filter(Boolean))], [equipos])
    const uniqueGruposUnidad = useMemo(() => [...new Set(equipos.map((e) => e.grupoUnidad))], [equipos])
    const filteredAndSortedEquipos = useMemo(() => {
        const filtered = equipos.filter((equipo) => {
            const matchesSearch =
                searchTerm === "" ||
                equipo.numEconomico.toLowerCase().includes(searchTerm.toLowerCase()) ||
                equipo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                equipo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (equipo.placas && equipo.placas.toLowerCase().includes(searchTerm.toLowerCase()))

            const matchesMarca = marcaFilter === "all" || equipo.marca === marcaFilter
            const matchesModelo = modeloFilter === "all" || equipo.modelo === modeloFilter
            const matchesTipoUnidad = tipoUnidadFilter === "all" || equipo.tipoUnidad === tipoUnidadFilter
            const matchesGrupoUnidad = grupoUnidadFilter === "all" || equipo.grupoUnidad === grupoUnidadFilter
            const matchesEstado = estadoFilter === "all" || equipo.estado === estadoFilter

            return matchesSearch && matchesMarca && matchesModelo && matchesTipoUnidad && matchesGrupoUnidad && matchesEstado
        })

        filtered.sort((a, b) => {
            let aValue: string | number
            let bValue: string | number

            switch (sortField) {
                case "numEconomico":
                    aValue = a.numEconomico
                    bValue = b.numEconomico
                    break
                case "year":
                    aValue = a.year
                    bValue = b.year
                    break
                case "marca":
                    aValue = a.marca
                    bValue = b.marca
                    break
                case "modelo":
                    aValue = a.modelo
                    bValue = b.modelo
                    break
                default:
                    aValue = a.numEconomico
                    bValue = b.numEconomico
            }

            if (typeof aValue === "string" && typeof bValue === "string") {
                return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
            } else {
                return sortOrder === "asc" ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number)
            }
        })

        return filtered
    }, [
        equipos,
        searchTerm,
        marcaFilter,
        modeloFilter,
        tipoUnidadFilter,
        grupoUnidadFilter,
        estadoFilter,
        sortField,
        sortOrder,
    ])

    const clearFilters = () => {
    setSearchTerm("")
    setMarcaFilter("all")
    setModeloFilter("all")
    setTipoUnidadFilter("all")
    setGrupoUnidadFilter("all")
    setEstadoFilter("all")
  }

  const getEstadoBadgeVariant = (estado: EstadoEquipos) => {
    switch (estado) {
      case EstadoEquipos.DISPONIBLE:
        return "default"
      case EstadoEquipos.DISPONIBLE_CON_DETALLES:
        return "secondary"
      case EstadoEquipos.EN_TALLER:
        return "outline"
      case EstadoEquipos.FUERA_DE_SERVICIO:
        return "destructive"
      default:
        return "secondary"
    }
  }

  const handleCardClick = (equipo: Equipo) => {
    setSelectedEquipo(equipo)
    onEquipoClick?.(equipo)
  }

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }
}