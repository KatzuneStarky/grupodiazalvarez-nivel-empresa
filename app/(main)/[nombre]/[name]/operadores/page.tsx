"use client"

import { SortField, useOperadoresFilters } from "@/modules/logistica/operadores/hooks/use-operadores-filters"
import { exportOperadores } from "@/functions/excel-export/operadores/export/export-operadores"
import OperadorFilters from "@/modules/logistica/operadores/components/operador-filters"
import OperadorPagination from "@/modules/logistica/operadores/components/pagination"
import OperadorTable from "@/modules/logistica/operadores/components/operador-table"
import OperadorCard from "@/modules/logistica/operadores/components/operador-card"
import { ChevronDown, ChevronUp, Plus, User } from "lucide-react"
import { useDirectLink } from "@/hooks/use-direct-link"
import PageTitle from "@/components/custom/page-title"
import { Separator } from "@/components/ui/separator"
import { IconFileExport } from "@tabler/icons-react"
import { useArea } from "@/context/area-context"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const OperadoresPage = () => {
    const {
        filteredAndSortedOperators,
        setTipoLicenciaFilter,
        tipoLicenciaFilter,
        paginatedOperators,
        setEmisorLicencia,
        emisorLicencia,
        setCurrentPage,
        setSearchTerm,
        setTipoSangre,
        setDateRange,
        currentPage,
        getInitials,
        totalPages,
        handleSort,
        searchTerm,
        sortField,
        sortOrder,
        dateRange,
        tipoSange,
        operadores
    } = useOperadoresFilters({ itemsPerPage: 6 })

    const { directLink } = useDirectLink("operadores")
    const { area } = useArea()
    const router = useRouter()

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return null
        return sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
    }

    const exportDataOperadores = async () => {
        try {
            toast.promise(exportOperadores(operadores, area?.nombre || ""), {
                loading: "Exportando datos...",
                success: "Datos exportados con éxito",
                error: "Error al exportar datos"
            })
        } catch (error) {
            console.log(error);
            toast.error("Error al exportar datos")
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <PageTitle
                description="Administre la informacion de sus estaciones de servicio"
                icon={<User className="h-12 w-12 text-primary" />}
                title="Operadores"
                hasActions={true}
                actions={
                    <>
                        <Button
                            className="sm:w-auto"
                            onClick={() => exportDataOperadores()}
                        >
                            <IconFileExport className="w-4 h-4 mr-2" />
                            Exportar Datos
                        </Button>

                        <Button
                            className="sm:w-auto"
                            onClick={() => router.push(`${directLink}/nuevo`)}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Nuevo operador
                        </Button>
                    </>
                }
            />

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
                    <div className="space-y-6">
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
                    </div>
                </>
            )}
        </div>
    )
}

export default OperadoresPage