"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReporteViajes } from "../../reportes-viajes/types/reporte-viajes";
import { formatCurrency } from "@/utils/format-currency";
import { formatNumber } from "@/utils/format-number";
import { useMemo } from "react";

interface TopClientsTableProps {
    trips: ReporteViajes[]
}

export function TopClientsTable({ trips }: TopClientsTableProps) {
    const topClients = useMemo(() => {
        const clientMap = new Map<string, { volume: number; revenue: number; trips: number }>()

        trips.forEach((trip) => {
            const existing = clientMap.get(trip.Cliente)
            if (existing) {
                existing.volume += trip.LitrosA20 ?? 0
                existing.revenue += trip.Flete ?? 0
                existing.trips += 1
            } else {
                clientMap.set(trip.Cliente, {
                    volume: trip.LitrosA20 ?? 0,
                    revenue: trip.Flete ?? 0,
                    trips: 1,
                })
            }
        })

        return Array.from(clientMap.entries())
            .map(([cliente, data]) => ({ cliente, ...data }))
            .sort((a, b) => b.volume - a.volume)
            .slice(0, 5)
    }, [trips])

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-card-foreground">Top Clientes</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-muted-foreground">Cliente</TableHead>
                            <TableHead className="text-muted-foreground">Viajes</TableHead>
                            <TableHead className="text-muted-foreground">Volumen (L)</TableHead>
                            <TableHead className="text-right text-muted-foreground">Ingresos</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {topClients.map((client) => (
                            <TableRow key={client.cliente}>
                                <TableCell className="font-medium text-card-foreground">{client.cliente}</TableCell>
                                <TableCell className="text-card-foreground">{client.trips}</TableCell>
                                <TableCell className="text-card-foreground">{formatNumber(client.volume)}</TableCell>
                                <TableCell className="text-right font-medium text-card-foreground">
                                    {formatCurrency(client.revenue)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}