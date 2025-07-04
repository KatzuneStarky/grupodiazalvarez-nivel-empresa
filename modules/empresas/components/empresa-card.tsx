"use client"

import { EstadoEmpresa } from "@/modules/administracion/enum/estado-empresa"
import { Empresa } from "../types/empresas"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import Image from "next/image"
import { Building2, Edit, Globe, Info, Mail, MapPin, Phone, Trash2, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import DetallesEmpresaDialogo from "./detalles-empresa-dialogo"

interface CompanyCardProps {
    empresa: Empresa
    onEdit: (empresa: Empresa) => void
    onDelete: (id: string) => void
}

const EmpresaCard = ({
    empresa,
    onEdit,
    onDelete
}: CompanyCardProps) => {
    const getEstadoBadgeVariant = (estado: EstadoEmpresa) => {
        switch (estado) {
            case EstadoEmpresa.Activa:
                return "default"
            case EstadoEmpresa.Suspendida:
                return "secondary"
            case EstadoEmpresa.Cerrada:
                return "destructive"
            default:
                return "secondary"
        }
    }

    return (
        <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        {empresa.logoUrl ? (
                            <Image
                                src={empresa.logoUrl || "/placeholder.svg"}
                                alt={`${empresa.nombre} logo`}
                                width={48}
                                height={48}
                                className="rounded-lg object-cover"
                            />
                        ) : (
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                                <Building2 className="h-6 w-6 text-muted-foreground" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg truncate">{empresa.nombre}</h3>
                            <p className="text-sm text-muted-foreground truncate">{empresa.razonSocial || empresa.rfc}</p>
                        </div>
                    </div>
                    <Badge variant={getEstadoBadgeVariant(empresa.estado)} className="capitalize">{empresa.estado}</Badge>
                </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{empresa.direccion}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{empresa.email}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span>{empresa.telefono}</span>
                    </div>

                    {empresa.direccionWeb && (
                        <div className="flex items-center gap-2 text-sm">
                            <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <a
                                href={empresa.direccionWeb}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline truncate"
                            >
                                {empresa.direccionWeb}
                            </a>
                        </div>
                    )}
                </div>

                <Separator />

                <div className="space-y-2">
                    {empresa.industria && (
                        <div className="flex items-center gap-2 text-sm">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span>{empresa.industria}</span>
                        </div>
                    )}

                    {empresa.numeroEmpleados && (
                        <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{empresa.numeroEmpleados} empleados</span>
                        </div>
                    )}
                </div>

                {empresa.descripcion && (
                    <>
                        <Separator />
                        <p className="text-sm text-muted-foreground line-clamp-3">{empresa.descripcion}</p>
                    </>
                )}

                <Separator />

                <div className="space-y-2">
                    <h4 className="text-sm font-medium">Configuraciones</h4>
                    <div className="flex flex-wrap gap-1">
                        {empresa.configuraciones.notificacionesEmail && (
                            <Badge variant="outline" className="text-xs">
                                Email
                            </Badge>
                        )}
                        {empresa.configuraciones.reportesAutomaticos && (
                            <Badge variant="outline" className="text-xs">
                                Reportes
                            </Badge>
                        )}
                        {empresa.configuraciones.accesoPublico && (
                            <Badge variant="outline" className="text-xs">
                                Público
                            </Badge>
                        )}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-4">
                <div className="flex gap-2 w-full">
                    <Button variant="outline" size="sm" onClick={() => onEdit(empresa)} className="flex-1">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(empresa.id)}
                        className="flex-1 text-destructive hover:text-destructive"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                    </Button>
                    <DetallesEmpresaDialogo empresa={empresa}>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                            <Info className="h-4 w-4 mr-2" />
                            Detalles
                        </Button>
                    </DetallesEmpresaDialogo>
                </div>
            </CardFooter>
        </Card>
    )
}

export default EmpresaCard