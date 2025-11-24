"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck } from "lucide-react"
import { SystemUser } from "@/types/usuario"

interface AssignedVehiclesCardProps {
    userBdd: SystemUser | null
}

export const AssignedVehiclesCard = ({ userBdd }: AssignedVehiclesCardProps) => {
    const vehiculosAsignados = userBdd?.logistica?.vehiculosAsignados || []

    if (vehiculosAsignados.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5 text-blue-500" />
                        Vehículos Asignados
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            No hay vehículos asignados
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5 text-blue-500" />
                        Vehículos Asignados
                    </CardTitle>
                    <Badge variant="secondary">
                        {vehiculosAsignados.length} vehículo{vehiculosAsignados.length !== 1 ? 's' : ''}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {vehiculosAsignados.map((vehiculoId, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                            <Truck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                Vehículo #{index + 1}
                            </p>
                            <p className="text-xs text-slate-500 font-mono">
                                ID: {vehiculoId}
                            </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                            Asignado
                        </Badge>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
