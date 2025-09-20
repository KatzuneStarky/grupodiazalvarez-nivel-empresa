"use client"

import { Equipo } from "../../bdd/equipos/types/equipos"
import { Button } from "@/components/ui/button"
import { Filter, Truck } from "lucide-react"

const NoEquiposFilter = ({
    filteredAndSortedEquipos,
    clearFilters,
}: {
    filteredAndSortedEquipos: Equipo[]
    clearFilters: () => void

}) => {
    return (
        <div>
            {filteredAndSortedEquipos.length === 0 && (
                <div className="text-center py-16">
                    <div className="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-6">
                        <Truck className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No se encontraron equipos</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        No hay equipos que coincidan con los filtros actuales. Intenta ajustar los criterios de búsqueda.
                    </p>
                    <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="border-border hover:bg-accent/10 bg-transparent"
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        Limpiar todos los filtros
                    </Button>
                </div>
            )}
        </div>
    )
}

export default NoEquiposFilter