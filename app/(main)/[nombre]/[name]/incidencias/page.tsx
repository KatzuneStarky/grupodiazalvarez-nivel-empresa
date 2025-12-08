"use client"

import IncidenciasFilters from "@/modules/mantenimiento/incidencias/components/incidencias-filters"
import { OperatorSidebar } from "@/modules/logistica/bdd/operadores/components/operator-sidebar"
import { IncidenciaCard } from "@/modules/mantenimiento/incidencias/components/incidencia-card"
import EquipoIdHeader from "@/modules/logistica/equipos/components/equipoId/equipo-id-header"
import { useAllOperatorData } from "@/modules/mantenimiento/hooks/use-all-operator-data"
import { ClipboardCheck } from "lucide-react"

const IncidenciasPage = () => {
    const {
        filteredIncidencias,
        mantenimientosData,
        setFilterEstado,
        operadorActual,
        setSearchTerm,
        setDateRange,
        filterEstado,
        archivosData,
        equipoData,
        searchTerm,
        dateRange,
    } = useAllOperatorData()

    return (
        <div className="w-full container mx-auto py-6 px-4 md:px-8">
            <EquipoIdHeader
                numMantenimientos={mantenimientosData?.length || 0}
                totalArchivos={archivosData?.length || 0}
                numTanques={equipoData?.tanques?.length || 0}
                equipo={equipoData}
                url={""}
            />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-4">
                <div className="col-span-1 lg:col-span-3 space-y-6">
                    <IncidenciasFilters
                        setFilterEstado={setFilterEstado}
                        setSearchTerm={setSearchTerm}
                        setDateRange={setDateRange}
                        filterEstado={filterEstado}
                        searchTerm={searchTerm}
                        dateRange={dateRange}
                    />

                    {filteredIncidencias.length > 0 ? (
                        <div className="space-y-4">
                            {filteredIncidencias.map((incidencia) => (
                                <IncidenciaCard
                                    key={incidencia.id}
                                    incidencia={incidencia}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg bg-muted/20">
                            <div className="rounded-full bg-muted p-4 mb-4">
                                <ClipboardCheck className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold">No se encontraron incidencias</h3>
                            <p className="text-muted-foreground max-w-sm mt-2 text-sm">
                                No hay registros que coincidan con tu búsqueda o filtros actuales.
                            </p>
                        </div>
                    )}
                </div>

                <div className="col-span-1">
                    <OperatorSidebar
                        operador={operadorActual}
                        equipo={equipoData}
                    />
                </div>
            </div>
        </div>
    )
}

export default IncidenciasPage