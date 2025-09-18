import { EstacionServicio } from "../types/estacion"
import { useMemo, useState } from "react"

export const useEstacionesTableFilters = (estaciones: EstacionServicio[]) => {
    const [selectedStation, setSelectedStation] = useState<EstacionServicio | null>(null)
    const [productFilter, setProductFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [cityFilter, setCityFilter] = useState<string>("all")
    const [searchTerm, setSearchTerm] = useState<string>("")

    const cities = Array.from(new Set(estaciones.map((s) => s.direccion.ciudad)))

    const filteredStations = useMemo(() => {
        return estaciones.filter((station) => {
            const matchesSearch =
                station.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                station.direccion.ciudad.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesCity = cityFilter === "all" || station.direccion.ciudad === cityFilter
            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && station.activo) ||
                (statusFilter === "inactive" && !station.activo)
            const matchesProduct = productFilter === "all" || station.productos?.includes(productFilter as any)

            return matchesSearch && matchesCity && matchesStatus && matchesProduct
        })
    }, [estaciones])

    const handleStationSelect = (station: EstacionServicio) => {
        setSelectedStation(station)
    }

    return {
        selectedStation,
        filteredStations,
        cities,
        productFilter,
        setProductFilter,
        statusFilter,
        setStatusFilter,
        cityFilter,
        setCityFilter,
        searchTerm,
        setSearchTerm,
        handleStationSelect,
        setSelectedStation
    }
}