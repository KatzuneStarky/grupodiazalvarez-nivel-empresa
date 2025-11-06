"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReporteViajes } from "../../reportes-viajes/types/reporte-viajes"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { formatCurrency } from "@/utils/format-currency"
import { formatNumber } from "@/utils/format-number"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"

interface RecentTripsTableProps {
    trips: ReporteViajes[]
}

export function RecentTripsTable({ trips }: RecentTripsTableProps) {
    const [searchTerm, setSearchTerm] = useState<string>("")

    const filteredTrips = trips.filter(
        (trip) =>
            trip.Cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trip.Operador.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trip.Producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trip.Municipio.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const orderedTrips = filteredTrips.sort((a, b) => {
        const dateA = parseFirebaseDate(a.Fecha)
        const dateB = parseFirebaseDate(b.Fecha)
        return dateB.getTime() - dateA.getTime()
    })

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-card-foreground">Viajes Recientes</CardTitle>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Buscar viajes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-muted-foreground">Fecha</TableHead>
                                <TableHead className="text-muted-foreground">Cliente</TableHead>
                                <TableHead className="text-muted-foreground">Operador</TableHead>
                                <TableHead className="text-muted-foreground">Producto</TableHead>
                                <TableHead className="text-muted-foreground">Litros A20</TableHead>
                                <TableHead className="text-muted-foreground">Municipio</TableHead>
                                <TableHead className="text-right text-muted-foreground">Flete</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orderedTrips.slice(0, 10).map((trip) => (
                                <TableRow key={trip.id}>
                                    <TableCell className="font-medium text-card-foreground">
                                        {format(parseFirebaseDate(trip.Fecha), "dd/MM/yyyy")}
                                    </TableCell>
                                    <TableCell className="text-card-foreground">{trip.Cliente}</TableCell>
                                    <TableCell className="text-card-foreground">{trip.Operador}</TableCell>
                                    <TableCell className="text-card-foreground">{trip.Producto}</TableCell>
                                    <TableCell className="text-card-foreground">{formatNumber(trip.LitrosA20 || 0)}</TableCell>
                                    <TableCell className="text-card-foreground">{trip.Municipio}</TableCell>
                                    <TableCell className="text-right font-medium text-card-foreground">
                                        {formatCurrency(trip.Flete || 0)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}