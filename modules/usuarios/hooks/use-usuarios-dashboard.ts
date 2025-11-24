"use client"

import { SortDirection, SortField, UserFilters, ViewMode } from "../types/user"
import { SystemUser } from "@/types/usuario"
import { useMemo, useState } from "react"

export const useUsuariosDashboard = (usuarios: SystemUser[]) => {
    const ITEMS_PER_PAGE_OPTIONS = [12, 24, 48, 96]
    const [viewMode, setViewMode] = useState<ViewMode>("table")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0])
    const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set())
    const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null)
    const [detailModalOpen, setDetailModalOpen] = useState(false)
    const [sortField, setSortField] = useState<SortField>("creadoEn")
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
    const [filters, setFilters] = useState<UserFilters>({
        search: "",
        estado: "",
        tipoRegistro: "",
        rol: "",
        empresaId: "",
        departamento: "",
        cargo: "",
        fechaCreacionDesde: undefined,
        fechaCreacionHasta: undefined,
        ultimoAccesoDesde: undefined,
        ultimoAccesoHasta: undefined,
    })

    const filteredAndSortedUsers = useMemo(() => {
        const filtered = usuarios.filter((user) => {
            const matchesSearch =
                !filters.search ||
                user.nombre?.toLowerCase().includes(filters.search.toLowerCase()) ||
                user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
                user.empleadoId?.toLowerCase().includes(filters.search.toLowerCase())

            const matchesEstado = !filters.estado || user.estado === filters.estado
            const matchesTipoRegistro = !filters.tipoRegistro || user.tipoRegistro === filters.tipoRegistro
            const matchesRol = !filters.rol || user.rol === filters.rol
            const matchesEmpresa = !filters.empresaId || user.empresaId === filters.empresaId
            const matchesDepartamento = !filters.departamento || user.informacionProfesional?.departamento === filters.departamento
            const matchesCargo = !filters.cargo || user.informacionProfesional?.cargo === filters.cargo

            const creadoEnDate = user.creadoEn.toDate()
            const matchesFechaCreacion =
                (!filters.fechaCreacionDesde || creadoEnDate >= filters.fechaCreacionDesde) &&
                (!filters.fechaCreacionHasta || creadoEnDate <= filters.fechaCreacionHasta)

            const ultimoAccesoDate = user.ultimoAcceso?.toDate()
            const matchesUltimoAcceso =
                (!filters.ultimoAccesoDesde || (ultimoAccesoDate && ultimoAccesoDate >= filters.ultimoAccesoDesde)) &&
                (!filters.ultimoAccesoHasta || (ultimoAccesoDate && ultimoAccesoDate <= filters.ultimoAccesoHasta))

            return (
                matchesSearch &&
                matchesEstado &&
                matchesTipoRegistro &&
                matchesRol &&
                matchesEmpresa &&
                matchesDepartamento &&
                matchesCargo &&
                matchesFechaCreacion &&
                matchesUltimoAcceso
            )
        })

        filtered.sort((a, b) => {
            let aValue: any = a[sortField]
            let bValue: any = b[sortField]

            // Convert Timestamp fields to Date for comparison
            if (sortField === "creadoEn" || sortField === "ultimoAcceso") {
                aValue = (aValue as any)?.toDate?.() ?? aValue
                bValue = (bValue as any)?.toDate?.() ?? bValue
            }

            if (sortField === "rol") {
                aValue = a.rol || ""
                bValue = b.rol || ""
            }

            if (aValue === undefined || aValue === null) aValue = ""
            if (bValue === undefined || bValue === null) bValue = ""

            if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
            if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
            return 0
        })
        return filtered
    }, [usuarios, filters, sortField, sortDirection])

    const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedUsers = filteredAndSortedUsers.slice(startIndex, startIndex + itemsPerPage)
    const selectedUsers = usuarios.filter((user) => selectedUserIds.has(user.uid))

    const handleFiltersChange = (newFilters: UserFilters) => {
        setFilters(newFilters)
        setCurrentPage(1)
    }

    const handleClearFilters = () => {
        setFilters({
            search: "",
            estado: "",
            tipoRegistro: "",
            rol: "",
            empresaId: "",
            departamento: "",
            cargo: "",
            fechaCreacionDesde: undefined,
            fechaCreacionHasta: undefined,
            ultimoAccesoDesde: undefined,
            ultimoAccesoHasta: undefined,
        })
        setCurrentPage(1)
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleViewUser = (user: SystemUser) => {
        setSelectedUser(user)
        setDetailModalOpen(true)
    }

    const handleSelectUser = (userId: string, selected: boolean) => {
        const newSelected = new Set(selectedUserIds)
        if (selected) {
            newSelected.add(userId)
        } else {
            newSelected.delete(userId)
        }
        setSelectedUserIds(newSelected)
    }

    const handleSelectAll = (selected: boolean) => {
        if (selected) {
            setSelectedUserIds(new Set(paginatedUsers.map((user) => user.uid)))
        } else {
            setSelectedUserIds(new Set())
        }
    }

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("asc")
        }
    }

    return {
        viewMode,
        setViewMode,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        selectedUserIds,
        setSelectedUserIds,
        selectedUser,
        setSelectedUser,
        detailModalOpen,
        setDetailModalOpen,
        sortField,
        sortDirection,
        filters,
        setFilters,
        filteredAndSortedUsers,
        totalPages,
        startIndex,
        paginatedUsers,
        selectedUsers,
        handleFiltersChange,
        handleClearFilters,
        handlePageChange,
        handleViewUser,
        handleSelectUser,
        handleSelectAll,
        handleSort,
    }
}