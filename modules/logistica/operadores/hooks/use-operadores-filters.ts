import { useOperadores } from "../../bdd/operadores/hooks/use-estaciones"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { endOfDay, isValid, startOfDay } from "date-fns"
import { DateRange } from "react-day-picker"
import { useMemo, useState } from "react"

export type SortField = "nombres" | "numLicencia"
export type SortOrder = "asc" | "desc"

export const useOperadoresFilters = ({
    itemsPerPage
}: {
    itemsPerPage: number
}) => {
    const [tipoLicenciaFilter, setTipoLicenciaFilter] = useState<string>("")
    const [emisorLicencia, setEmisorLicencia] = useState<string>("")
    const [sortField, setSortField] = useState<SortField>("nombres")
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
    const [tipoSange, setTipoSangre] = useState<string>("")
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")

    const { operadores } = useOperadores()

    const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
        if (operadores.length === 0) return undefined;
        const fechas = operadores.map(e => new Date(e.createdAt).getTime());
        return {
            from: new Date(Math.min(...fechas)),
            to: new Date(Math.max(...fechas)),
        };
    });

    const filteredAndSortedOperators = useMemo(() => {
        const filtered = operadores.filter((operator) => {
            const fullName = `${operator.nombres} ${operator.apellidos}`.toLowerCase()
            const fecha = parseFirebaseDate(operator.createdAt);
            const search = searchTerm.toLowerCase()

            if (!(fecha instanceof Date) || !isValid(fecha)) return false;

            if (dateRange?.from && fecha < startOfDay(new Date(dateRange.from))) return false;
            if (dateRange?.to && fecha > endOfDay(new Date(dateRange.to))) return false;

            const matchTipoLicencia =
                tipoLicenciaFilter === "all" ||
                operator.tipoLicencia?.toLowerCase().trim()
                    .includes(tipoLicenciaFilter.toLowerCase().trim())

            const matchEmisorLicencia =
                emisorLicencia === "all" ||
                operator.emisor?.toLowerCase().trim()
                    .includes(emisorLicencia.toLowerCase().trim())

            const matchTipoSangre =
                tipoSange === "all" ||
                operator.tipoSangre?.toLowerCase().trim()
                    .includes(tipoSange.toLowerCase().trim())

            const matchSearch = search === "" || fullName.includes(search) ||
                operator.numLicencia.toLowerCase().includes(search) ||
                operator.nss.toLowerCase().includes(search) ||
                operator.curp.toLowerCase().includes(search) ||
                operator.ine.toLowerCase().includes(search) ||
                operator.telefono.toLowerCase().includes(search)

            return matchSearch && matchTipoLicencia && matchEmisorLicencia && matchTipoSangre
        })

        filtered.sort((a, b) => {
            const aValue =
                sortField === "nombres"
                    ? `${a.nombres} ${a.apellidos}`
                    : a[sortField as keyof typeof a]
            const bValue =
                sortField === "nombres"
                    ? `${b.nombres} ${b.apellidos}`
                    : b[sortField as keyof typeof b]

            return sortOrder === "asc"
                ? String(aValue).localeCompare(String(bValue))
                : String(bValue).localeCompare(String(aValue))
        })

        return filtered
    }, [
        operadores,
        searchTerm,
        sortField,
        sortOrder,
        tipoLicenciaFilter,
        emisorLicencia,
        dateRange,
        tipoSange
    ])

    const paginatedOperators = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        return filteredAndSortedOperators.slice(startIndex, startIndex + itemsPerPage)
    }, [filteredAndSortedOperators, currentPage])

    const getInitials = (nombres: string, apellidos: string) => {
        return `${nombres.charAt(0)}${apellidos.charAt(0)}`.toUpperCase()
    }

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortOrder("asc")
        }
    }

    const totalPages = Math.ceil(filteredAndSortedOperators.length / itemsPerPage)

    return {
        getInitials,
        handleSort,
        currentPage,
        setCurrentPage,
        searchTerm,
        setSearchTerm,
        sortField,
        sortOrder,
        paginatedOperators,
        totalPages,
        filteredAndSortedOperators,
        setTipoLicenciaFilter,
        tipoLicenciaFilter,
        setEmisorLicencia,
        emisorLicencia,
        dateRange,
        setDateRange,
        tipoSange,
        setTipoSangre
    }
}