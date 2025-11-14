"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { parseFirebaseDate } from '@/utils/parse-timestamp-date'
import { SortDirection, SortField } from '../hooks/use-reporte-viajes-filters'
import { ChevronDown, ChevronUp, Truck } from 'lucide-react'
import { ReporteViajes } from '../types/reporte-viajes'
import { formatNumber } from '@/utils/format-number'
import { es } from 'date-fns/locale'
import { format } from 'date-fns'
import React from 'react'

interface ReporteViajesTableProps {
    getStatusBadge: (value: string) => React.ReactNode
    handleSort: (field: SortField) => void
    paginatedData: ReporteViajes[]
    sortDirection: SortDirection
    sortField: SortField
}

const ReporteViajesTable = ({
    getStatusBadge,
    sortDirection,
    paginatedData,
    handleSort,
    sortField
}: ReporteViajesTableProps) => {
    return (
        <Table className="overflow-hidden">
            <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                    <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("Fecha")}>
                        <div className="flex items-center gap-2">
                            Fecha
                            {sortField === "Fecha" &&
                                (sortDirection === "asc" ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                ))}
                        </div>
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("Cliente")}>
                        <div className="flex items-center gap-2">
                            Cliente
                            {sortField === "Cliente" &&
                                (sortDirection === "asc" ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                ))}
                        </div>
                    </TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Equipo</TableHead>
                    <TableHead>Operador</TableHead>
                    <TableHead>Municipio</TableHead>
                    <TableHead>M3</TableHead>
                    <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("LitrosA20")}>
                        <div className="flex items-center gap-2">
                            Litros A20
                            {sortField === "LitrosA20" &&
                                (sortDirection === "asc" ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                ))}
                        </div>
                    </TableHead>
                    <TableHead>Litros Descargados</TableHead>
                    <TableHead>Factura Pemex</TableHead>
                    <TableHead>Estado A20</TableHead>
                    <TableHead>Estado Natural</TableHead>
                    <TableHead>Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {paginatedData.length >= 1 ? paginatedData.map((report, index) => {

                    return (
                        <TableRow key={report.id} className={index % 2 === 0 ? "bg-muted/20" : ""}>
                            <TableCell className="font-medium">{format(parseFirebaseDate(report.Fecha), "dd/MM/yyyy", { locale: es })}</TableCell>
                            <TableCell className="font-medium">{report.Cliente}</TableCell>
                            <TableCell>{report.Producto}</TableCell>
                            <TableCell>{report.Equipo}</TableCell>
                            <TableCell>{report.Operador}</TableCell>
                            <TableCell>{report.Municipio}</TableCell>
                            <TableCell>{report.M3}</TableCell>
                            <TableCell>{report.LitrosA20?.toLocaleString()}</TableCell>
                            <TableCell>{report.LitrosDescargadosEstaciones?.toLocaleString()}</TableCell>
                            <TableCell>{report.FacturaPemex}</TableCell>
                            <TableCell>{getStatusBadge(formatNumber(report.FALTANTESYOSOBRANTESA20 || 0))}</TableCell>
                            <TableCell>{getStatusBadge(formatNumber(report.FALTANTESYOSOBRANTESALNATURAL || 0))}</TableCell>

                            <TableCell>
                                a
                            </TableCell>
                        </TableRow>
                    )
                }) : (
                    <TableRow className="">
                        <TableCell colSpan={16} className="text-center text-2xl p-14">
                            <Truck className="h-6 w-6 inline-block mr-2" />
                            No hay viajes disponibles
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}

export default ReporteViajesTable