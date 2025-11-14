"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReporteViajes } from "../../reportes-viajes/types/reporte-viajes";
import { parseFirebaseDate } from "@/utils/parse-timestamp-date";
import { Badge } from "@/components/ui/badge"
import { meses } from "@/constants/meses";
import { format } from "date-fns";
import { useMemo } from "react";

interface EquipmentTableProps {
    trips: ReporteViajes[],
    mes: string
    year: number
}

export function EquipmentTable({ trips, mes, year }: EquipmentTableProps) {
    const equipment = useMemo(() => {
        const equipmentMap = new Map<string, { operator: string; lastTrip: Date; trips: number }>()

        trips.forEach((trip) => {
            const existing = equipmentMap.get(trip.Equipo)
            if (!existing || trip.Fecha > existing.lastTrip) {
                equipmentMap.set(trip.Equipo, {
                    operator: trip.Operador,
                    lastTrip: trip.Fecha,
                    trips: (existing?.trips || 0) + 1,
                })
            }
        })

        return Array.from(equipmentMap.entries())
            .map(([equipo, data]) => ({ equipo, ...data }))
            .sort((a, b) => parseFirebaseDate(b.lastTrip).getTime() - parseFirebaseDate(a.lastTrip).getTime())
    }, [trips])

    const getStatusBadge = (
        lastTrip: Date,
        year?: number,
        month?: string
    ) => {
        const monthIndex = month ? meses.indexOf(month) : undefined;
        const referenceDate = (year && monthIndex !== undefined && monthIndex >= 0)
            ? new Date(year, monthIndex, 1)
            : new Date();

        const lastTripDate = parseFirebaseDate(lastTrip);
        const daysSince = Math.floor(
            (referenceDate.getTime() - lastTripDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSince < 2)
            return <Badge className="bg-primary text-primary-foreground">Activo</Badge>;
        if (daysSince < 7)
            return <Badge variant="secondary">Reciente</Badge>;
        return <Badge variant="outline">Inactivo</Badge>;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-card-foreground">Uso de Equipos y Operadores</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-muted-foreground">Equipo</TableHead>
                            <TableHead className="text-muted-foreground">Operador</TableHead>
                            <TableHead className="text-muted-foreground">Viajes</TableHead>
                            <TableHead className="text-muted-foreground">Último Viaje</TableHead>
                            <TableHead className="text-muted-foreground">Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {equipment.map((item) => (
                            <TableRow key={item.equipo}>
                                <TableCell className="font-medium text-card-foreground">{item.equipo}</TableCell>
                                <TableCell className="text-card-foreground">{item.operator}</TableCell>
                                <TableCell className="text-card-foreground">{item.trips}</TableCell>
                                <TableCell className="text-card-foreground">{format(parseFirebaseDate(item.lastTrip), "dd/MM/yyyy")}</TableCell>
                                <TableCell>{getStatusBadge(item.lastTrip, year, mes)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}