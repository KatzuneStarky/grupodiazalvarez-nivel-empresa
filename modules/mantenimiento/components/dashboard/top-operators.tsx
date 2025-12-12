"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { Operador } from "@/modules/logistica/bdd/operadores/types/operadores"

interface TopOperatorsProps {
    operadores: Operador[];
    equipos: any[];
}

const TopOperators = ({ operadores, equipos }: TopOperatorsProps) => {
    // Get operators with their equipment info
    const operatorsWithEquipment = operadores
        .filter(op => op.idEquipo)
        .map(op => {
            const equipo = equipos.find(e => e.id === op.idEquipo)
            return {
                ...op,
                equipo,
                hasIssues: equipo?.estado === 'MANTENIMIENTO' || equipo?.estado === 'FUERA_SERVICIO'
            }
        })
        .slice(0, 5)

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-medium">Operadores Activos</CardTitle>
                <CardDescription>Estado actual de operadores</CardDescription>
            </CardHeader>
            <CardContent>
                {operatorsWithEquipment.length === 0 ? (
                    <div className="text-sm text-muted-foreground text-center py-4">
                        No hay operadores activos
                    </div>
                ) : (
                    <div className="space-y-3">
                        {operatorsWithEquipment.map((op) => (
                            <div key={op.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                                        {op.nombres.charAt(0)}{op.apellidos.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium leading-none">
                                            {op.nombres} {op.apellidos}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {op.equipo ? `Unidad ${op.equipo.numEconomico}` : 'Sin unidad'}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    {op.hasIssues ? (
                                        <Badge variant="destructive" className="text-[10px]">
                                            <AlertCircle className="h-3 w-3 mr-1" />
                                            Alerta
                                        </Badge>
                                    ) : op.equipo ? (
                                        <Badge variant="default" className="text-[10px]">
                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                            Activo
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="text-[10px]">
                                            <Clock className="h-3 w-3 mr-1" />
                                            Standby
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default TopOperators
