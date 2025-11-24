"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Calendar, CreditCard, Globe, IdCard } from "lucide-react"
import { SystemUser } from "@/types/usuario"
import { format, differenceInDays } from "date-fns"
import { es } from "date-fns/locale"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"

interface DriverLicenseCardProps {
    userBdd: SystemUser | null
}

export const DriverLicenseCard = ({ userBdd }: DriverLicenseCardProps) => {
    const licencia = userBdd?.logistica?.licenciaConducir

    if (!licencia) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <IdCard className="h-5 w-5 text-blue-500" />
                        Licencia de Conducir
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            No hay licencia de conducir registrada
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const vencimiento = parseFirebaseDate(licencia.vencimiento)
    const diasParaVencer = differenceInDays(vencimiento, new Date())

    let estadoBadge = {
        variant: "default" as const,
        text: "Vigente",
        color: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
    }

    if (diasParaVencer < 0) {
        estadoBadge = {
            variant: "default" as const,
            text: "Vencida",
            color: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200"
        }
    } else if (diasParaVencer <= 30) {
        estadoBadge = {
            variant: "default" as const,
            text: "Por Vencer",
            color: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200"
        }
    }

    return (
        <Card className={diasParaVencer <= 30 ? "border-amber-200 dark:border-amber-800" : ""}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <IdCard className="h-5 w-5 text-blue-500" />
                        Licencia de Conducir
                    </CardTitle>
                    <Badge className={estadoBadge.color}>
                        {estadoBadge.text}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {diasParaVencer <= 30 && diasParaVencer >= 0 && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                                Licencia próxima a vencer
                            </p>
                            <p className="text-xs text-amber-700 dark:text-amber-300">
                                Vence en {diasParaVencer} día{diasParaVencer !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                )}

                {diasParaVencer < 0 && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-red-800 dark:text-red-200">
                                Licencia vencida
                            </p>
                            <p className="text-xs text-red-700 dark:text-red-300">
                                Vencida hace {Math.abs(diasParaVencer)} día{Math.abs(diasParaVencer) !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                            <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">
                                Número
                            </p>
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">
                                {licencia.numero}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                            <IdCard className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">
                                Tipo
                            </p>
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                Tipo {licencia.tipo}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                        <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                            <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">
                                Vencimiento
                            </p>
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                {format(vencimiento, "PPP", { locale: es })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                            <Globe className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">
                                País de Emisión
                            </p>
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                {licencia.paisEmision}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
