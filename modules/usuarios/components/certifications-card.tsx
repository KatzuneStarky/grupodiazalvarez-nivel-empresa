"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Building, Calendar, CreditCard } from "lucide-react"
import { SystemUser } from "@/types/usuario"
import { format, isPast } from "date-fns"
import { es } from "date-fns/locale"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"

interface CertificationsCardProps {
    userBdd: SystemUser | null
}

export const CertificationsCard = ({ userBdd }: CertificationsCardProps) => {
    const certificaciones = userBdd?.logistica?.certificaciones || []

    if (certificaciones.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-amber-500" />
                        Certificaciones
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            No hay certificaciones registradas
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
                        <Award className="h-5 w-5 text-amber-500" />
                        Certificaciones
                    </CardTitle>
                    <Badge variant="secondary">
                        {certificaciones.length} certificación{certificaciones.length !== 1 ? 'es' : ''}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {certificaciones.map((cert, index) => {
                    const isExpired = cert.vencimiento && isPast(parseFirebaseDate(cert.vencimiento))

                    return (
                        <div
                            key={index}
                            className={`p-4 rounded-lg border ${isExpired
                                    ? 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10'
                                    : 'border-slate-100 dark:border-slate-800'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-start gap-3 flex-1">
                                    <div className={`p-2 rounded-lg ${isExpired
                                            ? 'bg-red-100 dark:bg-red-900/50'
                                            : 'bg-amber-100 dark:bg-amber-900/50'
                                        }`}>
                                        <Award className={`h-4 w-4 ${isExpired
                                                ? 'text-red-600 dark:text-red-400'
                                                : 'text-amber-600 dark:text-amber-400'
                                            }`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                            {cert.nombre}
                                        </p>
                                        {cert.institucion && (
                                            <p className="text-xs text-slate-500 mt-1">
                                                {cert.institucion}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {isExpired && (
                                    <Badge variant="destructive" className="text-xs">
                                        Vencida
                                    </Badge>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-3">
                                {cert.numero && (
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-3 w-3 text-slate-400" />
                                        <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                                            {cert.numero}
                                        </span>
                                    </div>
                                )}
                                {cert.vencimiento && (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-3 w-3 text-slate-400" />
                                        <span className={`text-xs ${isExpired
                                                ? 'text-red-600 dark:text-red-400 font-medium'
                                                : 'text-slate-600 dark:text-slate-400'
                                            }`}>
                                            {format(parseFirebaseDate(cert.vencimiento), "PP", { locale: es })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}
