"use client"

import { parseFirebaseDate } from "@/utils/parse-timestamp-date";
import { OrdenDeConsumo } from "../../types/orden-de-consumo";
import { Card } from "@/components/ui/card";
import { es } from "date-fns/locale";
import { format } from "date-fns";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import OrdenesConsumoActions from "./actions";

interface OrdenesConsumoViewProps {
    data: OrdenDeConsumo[]
    getEstadoColor: (estado: string) => string
    formatFolio: (value: number) => string
}

const OrdenConsumoTable = ({
    data,
    getEstadoColor,
    formatFolio
}: OrdenesConsumoViewProps) => {
    return (
        <Card className="rounded-lg p-12">
            <Table className="w-full overflow-hidden">
                <TableHeader>
                    <TableRow>
                        <TableHead className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                            Folio
                        </TableHead>
                        <TableHead className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                            Fecha
                        </TableHead>
                        <TableHead className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                            Estado
                        </TableHead>
                        <TableHead className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                            Num. Económico
                        </TableHead>
                        <TableHead className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                            Operador
                        </TableHead>
                        <TableHead className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                            Kilometraje
                        </TableHead>
                        <TableHead className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                            Destino
                        </TableHead>
                        <TableHead className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                            Combustible (L)
                        </TableHead>
                        <TableHead className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                            Observaciones
                        </TableHead>
                        <TableHead className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                            Vista
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((orden) => (
                        <TableRow key={orden.id}>
                            <TableCell className="px-4 py-3 text-sm font-mono font-semibold">
                                {formatFolio(orden.folio)}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-sm">
                                {format(parseFirebaseDate(orden.fecha), "dd/MM/yyyy", { locale: es })}
                            </TableCell>
                            <TableCell className="px-4 py-3">
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getEstadoColor(
                                        orden.estado
                                    )}`}
                                >
                                    {orden.estado.replace(/_/g, ' ')}
                                </span>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-sm font-mono font-semibold">
                                {orden.numEconomico}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-sm font-mono font-semibold">
                                {orden.operador}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-sm font-mono font-semibold">
                                {orden.kilometraje} Km
                            </TableCell>
                            <TableCell className="px-4 py-3 text-sm font-mono font-semibold">
                                {orden.destino}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-sm font-mono font-semibold">
                                <div className="flex items-center gap-1">
                                    <span>{orden.mediciones.antes.diesel} Lts</span>
                                    <span className="text-gray-400">→</span>
                                    <span>{orden.mediciones.despues.diesel} Lts</span>
                                </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-sm font-mono font-semibold truncate">
                                {orden.observaciones !== "" ? orden.observaciones : "N/A"}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-sm font-mono font-semibold">
                                <OrdenesConsumoActions
                                    buttonVariant="default"
                                    orden={orden}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    )
}

export default OrdenConsumoTable