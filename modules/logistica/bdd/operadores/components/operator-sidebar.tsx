"use client"

import { User, Phone, Mail, IdCard, Truck, AlertCircle, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EquipoConMantenimientos } from "../../equipos/types/mantenimiento"
import { Separator } from "@/components/ui/separator"
import { Operador } from "../types/operadores"
import { Badge } from "@/components/ui/badge"

interface OperatorSidebarProps {
    operador?: Operador
    equipo?: EquipoConMantenimientos | null
}

export const OperatorSidebar = ({ operador, equipo }: OperatorSidebarProps) => {
    if (!operador) return null

    return (
        <div className="sticky top-6 space-y-6">
            <Card className="border-2 shadow-sm">
                <CardHeader className="pb-3 text-center">
                    <div className="mx-auto bg-secondary/20 p-4 rounded-full w-fit mb-2">
                        <User className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-bold">
                        {operador.nombres} {operador.apellidos}
                    </CardTitle>
                    <div className="flex justify-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs font-normal">
                            ID: {operador.id.slice(0, 8)}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Información de Contacto */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <IdCard className="h-4 w-4" />
                            Datos Personales
                        </h4>
                        <Separator />
                        <div className="grid gap-3 text-sm">
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span className="truncate" title={operador.email}>{operador.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span>{operador.telefono}</span>
                            </div>
                            {operador.numLicencia && (
                                <div className="flex flex-col gap-1 mt-1 bg-secondary/10 p-2 rounded-md border">
                                    <span className="text-xs text-muted-foreground">Licencia</span>
                                    <span className="font-medium">{operador.numLicencia}</span>
                                    <span className="text-xs text-muted-foreground">Tipo: {operador.tipoLicencia}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Información del Equipo */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <Truck className="h-4 w-4" />
                            Equipo Asignado
                        </h4>
                        <Separator />
                        {equipo ? (
                            <div className="grid gap-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Económico:</span>
                                    <span className="font-bold text-lg">{equipo.numEconomico}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Estado:</span>
                                    <Badge variant={equipo.activo ? "default" : "destructive"} className="gap-1">
                                        {equipo.activo ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                                        {equipo.activo ? "Activo" : "Inactivo"}
                                    </Badge>
                                </div>
                                <div className="bg-secondary/10 p-2 rounded-md border mt-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">Placas:</span>
                                        <span className="font-medium">{equipo.placas || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between text-xs mt-1">
                                        <span className="text-muted-foreground">Marca:</span>
                                        <span className="font-medium">{equipo.marca || "N/A"}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4 text-muted-foreground text-sm bg-secondary/10 rounded-lg border border-dashed">
                                Sin equipo asignado
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
