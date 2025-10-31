"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import ConsumoAlertsDialog from "@/modules/logistica/consumo/components/consumo-alerts-dialog"
import { ArrowDownIcon, ArrowUpIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useConsumo } from "@/modules/logistica/consumo/hooks/use-consumo"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import PageTitle from "@/components/custom/page-title"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Icon from "@/components/global/icon"
import { Card } from "@/components/ui/card"
import { useState } from "react"

type SortField = "fecha" | "litrosCargados" | "rendimientoKmL" | "costoTotal"
type SortDirection = "asc" | "desc"

const ConsumoTablaPage = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [sortField, setSortField] = useState<SortField>("fecha")
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
    const itemsPerPage = 40

    const { consumo, loading } = useConsumo()

    const sortedData = [...consumo].sort((a, b) => {
        let aValue: number | Date = 0
        let bValue: number | Date = 0

        switch (sortField) {
            case "fecha":
                aValue = parseFirebaseDate(a.fecha)
                bValue = parseFirebaseDate(b.fecha)
                break
            case "litrosCargados":
                aValue = a.litrosCargados || 0
                bValue = b.litrosCargados || 0
                break
            case "rendimientoKmL":
                aValue = a.rendimientoKmL || 0
                bValue = b.rendimientoKmL || 0
                break
            case "costoTotal":
                aValue = a.costoTotal || 0
                bValue = b.costoTotal || 0
                break
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
        return 0
    })

    const totalPages = Math.ceil(sortedData.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentData = sortedData.slice(startIndex, endIndex)

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("desc")
        }
    }

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return null
        return sortDirection === "asc" ? (
            <ArrowUpIcon className="h-3 w-3 inline ml-1" />
        ) : (
            <ArrowDownIcon className="h-3 w-3 inline ml-1" />
        )
    }

    return (
        <div className="container mx-auto px-8 py-6">
            <PageTitle
                title="Tabla Consumo"
                description="Gestine y administre el consumo de la flota"
                icon={
                    <Icon iconName="picon:fuel" className="w-12 h-12" />
                }
                hasActions={true}
                actions={
                    <div className="flex items-center gap-2">
                        <ConsumoAlertsDialog alerts={[]} />
                    </div>
                }
            />
            <Separator className="my-4" />

            {loading ? (
                <Skeleton className="h-[500]" />
            ) : (
                <>
                    <Card className="p-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="cursor-pointer" onClick={() => handleSort("fecha")}>
                                        Fecha <SortIcon field="fecha" />
                                    </TableHead>
                                    <TableHead>Equipo</TableHead>
                                    <TableHead>Operador</TableHead>
                                    <TableHead>Viaje</TableHead>
                                    <TableHead className="text-right cursor-pointer" onClick={() => handleSort("litrosCargados")}>
                                        Consumo <SortIcon field="litrosCargados" />
                                    </TableHead>
                                    <TableHead className="text-right cursor-pointer" onClick={() => handleSort("rendimientoKmL")}>
                                        Efficiencia <SortIcon field="rendimientoKmL" />
                                    </TableHead>
                                    <TableHead className="text-right cursor-pointer" onClick={() => handleSort("costoTotal")}>
                                        Costo Total <SortIcon field="costoTotal" />
                                    </TableHead>
                                    <TableHead className="text-center">Notas</TableHead>
                                    <TableHead>Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center text-muted-foreground">
                                            No hay datos para mostrar
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    currentData.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{parseFirebaseDate(item.fecha).toLocaleDateString("es-MX")}</TableCell>
                                            <TableCell className="font-medium">{item.equipo?.numEconomico || item.equipoId}</TableCell>
                                            <TableCell>{`${item.operador?.nombres} ${item.operador?.apellidos}` || item.operadorId || "-"}</TableCell>
                                            <TableCell className="max-w-[200px] truncate">
                                                {item.viaje?.DescripcionDelViaje || item.viajeId || "-"}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {item.litrosCargados.toLocaleString("es-MX", { minimumFractionDigits: 2 })} L
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {item.rendimientoKmL
                                                    ? `${item.rendimientoKmL.toLocaleString("es-MX", { minimumFractionDigits: 2 })} km/L`
                                                    : "-"}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {item.costoTotal
                                                    ? `$${item.costoTotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`
                                                    : "-"}
                                            </TableCell>
                                            <TableCell className="max-w-[150px] truncate text-center">{item.observaciones || "-"}</TableCell>
                                            <TableCell className="max-w-[150px] truncate"></TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </Card>

                    {totalPages > 0 && (
                        <div className="flex items-center justify-between mt-4">
                            <p className="text-sm text-muted-foreground">
                                Mostrando {startIndex + 1} de {Math.min(endIndex, sortedData.length)}, de un total de {sortedData.length} registros
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeftIcon className="h-4 w-4" />
                                </Button>
                                <span className="text-sm">
                                    Pagina {currentPage} de {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronRightIcon className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default ConsumoTablaPage