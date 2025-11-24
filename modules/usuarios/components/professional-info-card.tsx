"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Building, Calendar, Hash, MapPin, Phone, User } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"

interface ProfessionalInfoCardProps {
    userBdd: any
}

export const ProfessionalInfoCard = ({ userBdd }: ProfessionalInfoCardProps) => {
    const professionalInfo = userBdd?.informacionProfesional

    if (!professionalInfo) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-blue-500" />
                        Información Profesional
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-500">No hay información profesional disponible.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-500" />
                    Información Profesional
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {professionalInfo.cargo && (
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Briefcase className="h-4 w-4" />
                                <span>Cargo</span>
                            </div>
                            <p className="font-medium">{professionalInfo.cargo}</p>
                        </div>
                    )}

                    {professionalInfo.departamento && (
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Building className="h-4 w-4" />
                                <span>Departamento</span>
                            </div>
                            <p className="font-medium">{professionalInfo.departamento}</p>
                        </div>
                    )}

                    {professionalInfo.fechaIngreso && (
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Calendar className="h-4 w-4" />
                                <span>Fecha de Ingreso</span>
                            </div>
                            <p className="font-medium">
                                {format(parseFirebaseDate(professionalInfo.fechaIngreso), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                            </p>
                        </div>
                    )}

                    {professionalInfo.numeroEmpleado && (
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Hash className="h-4 w-4" />
                                <span>Número de Empleado</span>
                            </div>
                            <p className="font-medium">{professionalInfo.numeroEmpleado}</p>
                        </div>
                    )}

                    {professionalInfo.supervisor && (
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <User className="h-4 w-4" />
                                <span>Supervisor</span>
                            </div>
                            <p className="font-medium">{professionalInfo.supervisor}</p>
                        </div>
                    )}

                    {professionalInfo.ubicacionOficina && (
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <MapPin className="h-4 w-4" />
                                <span>Ubicación de Oficina</span>
                            </div>
                            <p className="font-medium">{professionalInfo.ubicacionOficina}</p>
                        </div>
                    )}

                    {professionalInfo.extension && (
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Phone className="h-4 w-4" />
                                <span>Extensión</span>
                            </div>
                            <p className="font-medium">{professionalInfo.extension}</p>
                        </div>
                    )}
                </div>

                {!professionalInfo.cargo && !professionalInfo.departamento && !professionalInfo.fechaIngreso && (
                    <p className="text-sm text-slate-500">No hay información profesional completa disponible.</p>
                )}
            </CardContent>
        </Card>
    )
}
