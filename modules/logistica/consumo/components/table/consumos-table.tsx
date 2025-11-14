"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { ConsumoData } from "../../types/consumo-data"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type SortField = "fecha" | "litrosCargados" | "rendimientoKmL" | "costoTotal"

interface ConsumoTableProps {
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
    handleSort: (field: SortField) => void
    currentData: ConsumoData[]
    sortIcon: JSX.ElementType
    sortedData: ConsumoData[]
    currentPage: number
    totalPages: number
    startIndex: number
    endIndex: number
}

const ConsumosTable = ({
    setCurrentPage,
    currentData,
    currentPage,
    handleSort,
    startIndex,
    sortedData,
    totalPages,
    sortIcon,
    endIndex,
}: ConsumoTableProps) => {
    const SortIcon = sortIcon

    return (
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
    )
}

export default ConsumosTable