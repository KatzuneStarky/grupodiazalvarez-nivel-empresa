"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EstadoEmpresa } from "@/modules/administracion/enum/estado-empresa"
import { Empresa } from "@/modules/empresas/types/empresas"
import { Building2, Mail, Phone, User } from "lucide-react"
import ContactCard from "./contact-card"

const CompanyContactCard = ({
    empresa
}: {
    empresa: Empresa
}) => {
    return (
        <div className="space-y-4">
            <Card className="shadow-md">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={empresa.logoUrl || "/placeholder.svg"} alt={empresa.nombre} />
                                <AvatarFallback className="bg-gray-100">
                                    <Building2 className="h-6 w-6 text-gray-600" />
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-lg">{empresa.nombre}</CardTitle>
                                <p className="text-sm text-muted-foreground">RFC: {empresa.rfc}</p>
                                {empresa.industria && (
                                    <Badge variant="outline" className="mt-1">
                                        {empresa.industria}
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <Badge variant={empresa.estado === EstadoEmpresa.Activa ? "default" : "secondary"} className="text-xs">
                            {empresa.estado}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <a href={`mailto:${empresa.email}`} className="hover:text-blue-600">
                                {empresa.email}
                            </a>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <a href={`tel:${empresa.telefono}`} className="hover:text-blue-600">
                                {empresa.telefono}
                            </a>
                        </div>
                    </div>
                    {empresa.numeroEmpleados && (
                        <p className="text-sm text-muted-foreground mt-2">
                            <User className="h-4 w-4 inline mr-1" />
                            {empresa.numeroEmpleados} empleados
                        </p>
                    )}
                </CardContent>
            </Card>

            <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground ml-4">Contactos ({empresa.contactos.length})</h3>
                {empresa.contactos.map((contact, index) => (
                    <ContactCard key={index} contacto={contact} />
                ))}
            </div>
        </div>
    )
}

export default CompanyContactCard