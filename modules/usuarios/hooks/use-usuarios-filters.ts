"use client"

import { UserFilters } from "../types/user"
import { useState } from "react"

export const useUsuariosFilters = (filters: UserFilters, onFiltersChange: (filters: UserFilters) => void) => {
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)

    const updateFilter = (key: keyof UserFilters, value: string | Date | undefined) => {
        onFiltersChange({ ...filters, [key]: value })
    }

    const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
        if (key === "search") return value !== ""
        if (
            key === "fechaCreacionDesde" ||
            key === "fechaCreacionHasta" ||
            key === "ultimoAccesoDesde" ||
            key === "ultimoAccesoHasta"
        ) {
            return value !== undefined
        }
        return value !== ""
    })

    const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
        if (key === "search") return value !== ""
        if (
            key === "fechaCreacionDesde" ||
            key === "fechaCreacionHasta" ||
            key === "ultimoAccesoDesde" ||
            key === "ultimoAccesoHasta"
        ) {
            return value !== undefined
        }
        return value !== ""
    }).length

    return {
        isAdvancedOpen,
        setIsAdvancedOpen,
        updateFilter,
        hasActiveFilters,
        activeFilterCount
    }
}