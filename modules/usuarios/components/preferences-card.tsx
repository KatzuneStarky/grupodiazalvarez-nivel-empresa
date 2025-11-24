"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Bell, Clock, Globe, Languages, Settings } from "lucide-react"
import { SystemUser } from "@/types/usuario"

interface PreferencesCardProps {
    userBdd: SystemUser | null
}

export const PreferencesCard = ({ userBdd }: PreferencesCardProps) => {
    const preferencias = userBdd?.preferencias

    const defaultPreferences = {
        idioma: 'es' as const,
        zonaHoraria: 'America/Mexico_City',
        formatoFecha: 'DD/MM/YYYY' as const,
        formatoHora: '24h' as const,
        notificaciones: {
            email: true,
            push: true,
            sms: false
        }
    }

    const prefs = preferencias || defaultPreferences

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-purple-500" />
                    Preferencias
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Idioma */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                            <Languages className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                Idioma
                            </p>
                            <p className="text-xs text-slate-500">
                                Idioma de la interfaz
                            </p>
                        </div>
                    </div>
                    <Badge variant="secondary">
                        {prefs.idioma === 'es' ? 'Español' : 'English'}
                    </Badge>
                </div>

                {/* Zona Horaria */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                            <Globe className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                Zona Horaria
                            </p>
                            <p className="text-xs text-slate-500">
                                {prefs.zonaHoraria}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Formato de Fecha y Hora */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                            <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                Formato
                            </p>
                            <p className="text-xs text-slate-500">
                                Fecha: {prefs.formatoFecha} • Hora: {prefs.formatoHora}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Notificaciones */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-amber-600" />
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            Notificaciones
                        </p>
                    </div>

                    <div className="space-y-3 pl-6">
                        <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                            <Label htmlFor="email-notif" className="cursor-pointer">
                                <p className="text-sm font-medium">Email</p>
                                <p className="text-xs text-slate-500">Recibir notificaciones por correo</p>
                            </Label>
                            <Switch
                                id="email-notif"
                                checked={prefs.notificaciones.email}
                                disabled
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                            <Label htmlFor="push-notif" className="cursor-pointer">
                                <p className="text-sm font-medium">Push</p>
                                <p className="text-xs text-slate-500">Notificaciones en el navegador</p>
                            </Label>
                            <Switch
                                id="push-notif"
                                checked={prefs.notificaciones.push}
                                disabled
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                            <Label htmlFor="sms-notif" className="cursor-pointer">
                                <p className="text-sm font-medium">SMS</p>
                                <p className="text-xs text-slate-500">Mensajes de texto</p>
                            </Label>
                            <Switch
                                id="sms-notif"
                                checked={prefs.notificaciones.sms}
                                disabled
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
