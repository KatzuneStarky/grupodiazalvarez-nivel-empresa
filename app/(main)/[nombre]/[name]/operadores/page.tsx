"use client"

import { SortField, useOperadoresFilters } from "@/modules/logistica/operadores/hooks/use-operadores-filters"
import OperadorFilters from "@/modules/logistica/operadores/components/operador-filters"
import OperadorPagination from "@/modules/logistica/operadores/components/pagination"
import OperadorTable from "@/modules/logistica/operadores/components/operador-table"
import OperadorCard from "@/modules/logistica/operadores/components/operador-card"
import { ChevronDown, ChevronUp, Plus, User } from "lucide-react"
import { useDirectLink } from "@/hooks/use-direct-link"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const OperadoresPage = () => {
    const {
        currentPage,
        setCurrentPage,
        totalPages,
        paginatedOperators,
        handleSort,
        sortField,
        sortOrder,
        getInitials,
        searchTerm,
        setSearchTerm,
        filteredAndSortedOperators,
        setTipoLicenciaFilter,
        tipoLicenciaFilter,
        emisorLicencia,
        setEmisorLicencia,
        dateRange,
        setDateRange,
        setTipoSangre,
        tipoSange
    } = useOperadoresFilters({ itemsPerPage: 6 })

    const { directLink } = useDirectLink("operadores")
    const router = useRouter()

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return null
        return sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <User className="h-12 w-12 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Operadores</h1>
                        <p className="text-muted-foreground">
                            Administre la informacion de sus estaciones de servicio
                        </p>
                    </div>
                </div>

                <Button
                    className="sm:w-auto"
                    onClick={() => router.push(`${directLink}/nuevo`)}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo operador
                </Button>
            </div>

            <Separator className="mt-4 mb-8" />

            <OperadorFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterLicencia={tipoLicenciaFilter}
                setFilterLicencia={setTipoLicenciaFilter}
                emisorLicencia={emisorLicencia}
                setEmisorLicencia={setEmisorLicencia}
                setDateRange={setDateRange}
                dateRange={dateRange}
                setTipoSangre={setTipoSangre}
                tipoSangre={tipoSange}
            />

            <Separator className="my-8" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedOperators.map((operator) => (
                    <OperadorCard
                        operator={operator}
                        getInitials={getInitials}
                        directLink={directLink}
                        key={operator.id}
                    />
                ))}
            </div>


            {filteredAndSortedOperators.length > 0 && (
                <>
                    <Separator className="my-8" />
                    <OperadorTable
                        SortIcon={SortIcon}
                        getInitials={getInitials}
                        handleSort={handleSort}
                        paginatedOperators={paginatedOperators}
                        directLink={directLink}
                    />
                    <OperadorPagination
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={totalPages}
                    />
                </>
            )}
        </div>
    )
}

export default OperadoresPage