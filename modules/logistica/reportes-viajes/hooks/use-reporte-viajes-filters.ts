import { useReporteViajes } from "./use-reporte-viajes"
import { useArea } from "@/context/area-context"
import { useMemo, useState } from "react"

export type SortField = "Fecha" | "Cliente" | "LitrosA20" | "Flete"
export type SortDirection = "asc" | "desc"

export const useReporteViajesFilters = () => {
    const [seleccionarMunicipio, setSelectMunicipio] = useState<string>("all")
    const [sortDireccion, setSortDireccion] = useState<SortDirection>("desc")
    const [selectedProducto, setSelectedProducto] = useState<string>("all")
    const [selectedCliente, setSelectedCliente] = useState<string>("all")
    const [selectedYear, setSelectedYear] = useState<string>("all")
    const [sortField, setSortField] = useState<SortField>("Fecha")
    const [selectedMes, setSelectedMes] = useState<string>("all")
    const [itemsPerPage, setItemsPerPage] = useState<number>(10)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [searchTerm, setSearchTerm] = useState<string>("")

    const { reporteViajes } = useReporteViajes()
    const { area } = useArea()

    const uniqueProducts
        = useMemo(() => [...new Set(reporteViajes.map((report) => report.Producto))].sort(), [reporteViajes])
    const uniqueClients
        = useMemo(() => [...new Set(reporteViajes.map((report) => report.Cliente))].sort(), [reporteViajes])
    const uniqueMunicipalities
        = useMemo(() => [...new Set(reporteViajes.map((report) => report.Municipio))].sort(), [reporteViajes])
    const uniqueYears = useMemo(() => {
        return [...new Set(
            reporteViajes
                .map((report) => Number(report.Year))
                .filter((y) => Number.isFinite(y))
        )].sort();
    }, [reporteViajes]);

    const filteredAndSortedData = useMemo(() => {
        const filtered = reporteViajes.filter((report) => {
            const matchesSearch =
                !searchTerm ||
                report.Cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.Producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.Operador.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.Municipio.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesMonth = selectedMes === "all" || report.Mes === selectedMes
            const matchesYear = selectedYear === "all" || report.Year?.toString() === selectedYear
            const matchesProduct = selectedProducto === "all" || report.Producto === selectedProducto
            const matchesClient = selectedCliente === "all" || report.Cliente === selectedCliente
            const matchesMunicipality = seleccionarMunicipio === "all" || report.Municipio === seleccionarMunicipio

            return matchesSearch && matchesMonth && matchesYear && matchesProduct && matchesClient && matchesMunicipality
        })

        filtered.sort((a, b) => {
            let aValue: any = a[sortField]
            let bValue: any = b[sortField]

            if (sortField === "Fecha") {
                aValue = new Date(aValue).getTime()
                bValue = new Date(bValue).getTime()
            } else if (typeof aValue === "string") {
                aValue = aValue.toLowerCase()
                bValue = bValue.toLowerCase()
            }

            if (sortDireccion === "asc") {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
            }
        })

        return filtered
    }, [
        searchTerm,
        selectedMes,
        selectedYear,
        selectedProducto,
        selectedCliente,
        seleccionarMunicipio,
        sortField,
        sortDireccion,
        reporteViajes
    ])

    const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)
    const paginatedData = filteredAndSortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDireccion(sortDireccion === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDireccion("asc")
        }
    }    

    const clearFilters = () => {
        setSearchTerm("")
        setSelectedMes("all")
        setSelectedYear("all")
        setSelectedProducto("all")
        setSelectedCliente("all")
        setSelectMunicipio("all")
        setCurrentPage(1)
    }

    return {
        reporteViajes,
        area,
        seleccionarMunicipio,
        setSelectMunicipio,
        sortDireccion,
        setSortDireccion,
        selectedProducto,
        setSelectedProducto,
        selectedCliente,
        setSelectedCliente,
        selectedYear,
        setSelectedYear,
        sortField,
        setSortField,
        selectedMes,
        setSelectedMes,
        itemsPerPage,
        setItemsPerPage,
        currentPage,
        setCurrentPage,
        searchTerm,
        setSearchTerm,
        uniqueClients,
        uniqueProducts,
        uniqueMunicipalities,
        totalPages,
        paginatedData,
        handleSort,
        clearFilters,
        filteredAndSortedData,
        uniqueYears
    }
}