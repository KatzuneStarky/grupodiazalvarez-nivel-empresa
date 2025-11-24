"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Mail, Phone, User } from "lucide-react"
import { SystemUser } from "@/types/usuario"

interface EmergencyContactCardProps {
    userBdd: SystemUser | null
}

export const EmergencyContactCard = ({ userBdd }: EmergencyContactCardProps) => {
    const emergencyContact = userBdd?.contactoEmergencia

    if (!emergencyContact) {
        return (
            <Card className="border-amber-200 dark:border-amber-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                        Contacto de Emergencia
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-center">
                        <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                            ⚠️ No hay contacto de emergencia registrado
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                            Es importante agregar un contacto de emergencia
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-amber-200 dark:border-amber-800">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                        Contacto de Emergencia
                    </CardTitle>
                    <Badge variant="outline" className="border-amber-500 text-amber-700 dark:text-amber-300">
                        Importante
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg border border-amber-100 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                        <User className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-1">
                            Nombre
                        </p>
                        <p className="text-sm font-bold text-amber-900 dark:text-amber-100">
                            {emergencyContact.nombre}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg border border-amber-100 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                        <Phone className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-1">
                            Teléfono
                        </p>
                        <p className="text-sm font-bold text-amber-900 dark:text-amber-100">
                            {emergencyContact.telefono}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg border border-amber-100 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                        <User className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-1">
                            Relación
                        </p>
                        <p className="text-sm font-bold text-amber-900 dark:text-amber-100 capitalize">
                            {emergencyContact.relacion}
                        </p>
                    </div>
                </div>

                {emergencyContact.email && (
                    <div className="flex items-start gap-3 p-3 rounded-lg border border-amber-100 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                            <Mail className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-1">
                                Email
                            </p>
                            <p className="text-sm font-bold text-amber-900 dark:text-amber-100">
                                {emergencyContact.email}
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
