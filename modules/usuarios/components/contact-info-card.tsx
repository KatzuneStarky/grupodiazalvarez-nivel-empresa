"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MapPin, Phone } from "lucide-react"
import { SystemUser } from "@/types/usuario"

interface ContactInfoCardProps {
    userBdd: SystemUser | null
}

export const ContactInfoCard = ({ userBdd }: ContactInfoCardProps) => {
    const contacto = userBdd?.contacto

    if (!contacto || (!contacto.telefonoMovil && !contacto.telefonoOficina && !contacto.direccion)) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-green-500" />
                        Información de Contacto
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            No hay información de contacto registrada
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-green-500" />
                    Información de Contacto
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {contacto.telefonoMovil && (
                    <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                        <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                            <Phone className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">
                                Teléfono Móvil
                            </p>
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                {contacto.telefonoMovil}
                            </p>
                        </div>
                    </div>
                )}

                {contacto.telefonoOficina && (
                    <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                            <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">
                                Teléfono de Oficina
                            </p>
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                {contacto.telefonoOficina}
                            </p>
                        </div>
                    </div>
                )}

                {contacto.direccion && (
                    <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                            <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">
                                Dirección
                            </p>
                            <div className="text-sm font-bold text-slate-900 dark:text-slate-100 space-y-1">
                                <p>{contacto.direccion.calle}</p>
                                <p>
                                    {contacto.direccion.ciudad}, {contacto.direccion.estado} {contacto.direccion.codigoPostal}
                                </p>
                                <p>{contacto.direccion.pais}</p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
