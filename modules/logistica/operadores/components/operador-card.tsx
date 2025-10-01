"use client"

import { Calendar, CreditCard, Mail, MapPin, Phone, Shield, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Operador } from "../../bdd/operadores/types/operadores"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import OperatorActions from "./operator-actions"
import { Badge } from "@/components/ui/badge"
import { es } from "date-fns/locale"
import { format } from "date-fns"

const OperadorCard = ({
    operator,
    getInitials,
    directLink
}: {
    operator: Operador,
    getInitials: (nombre: string, apellidos: string) => string,
    directLink: string
}) => {
    return (
        <Card
            key={operator.id}
            className="transition-all duration-300 border-0 shadow-md hover:shadow-xl"
        >
            <CardHeader className="rounded-t-lg">
                <div className="flex items-start space-x-4">
                    <div className="relative">
                        <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                            <AvatarImage
                                src={operator.image || "/placeholder.svg"}
                                alt={`${operator.nombres} ${operator.apellidos}`}
                            />
                            <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-red-500 to-orange-600 text-white">
                                {getInitials(operator.nombres, operator.apellidos)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                            <Shield className="h-3 w-3 text-white" />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-300 leading-tight">{operator.nombres}</CardTitle>
                        <CardTitle className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">{operator.apellidos}</CardTitle>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-1">
                            <Mail className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
                            <span className="truncate dark:text-gray-200">{operator.email}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-2 text-green-500 dark:text-green-400" />
                            <span className="dark:text-gray-200">{operator.telefono}</span>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="dark:bg-gray-700 border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Licencia</span>
                        </div>
                        <Badge variant="secondary" className="font-mono text-xs">
                            {operator.numLicencia}
                        </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-300">Tipo:</span>

                        <Badge variant="outline" className="text-xs">
                            {operator.tipoLicencia}
                        </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-300">Emisor:</span>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{operator.emisor}</span>
                    </div>
                </div>

                <div className="dark:bg-gray-700 border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-red-500" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Información Personal</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="border rounded-lg p-2">
                            <div className="text-gray-500 dark:text-gray-300 mb-1">NSS</div>
                            <div className="font-mono font-medium text-gray-800 dark:text-gray-200">{operator.nss}</div>
                        </div>
                        <div className="border rounded-lg p-2">
                            <div className="text-gray-500 dark:text-gray-300 mb-1">Tipo de Sangre</div>
                            <Badge variant="destructive" className="text-xs font-bold">
                                {operator.tipoSangre}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="dark:bg-gray-700 border rounded-lg p-4 space-y-3">
                    <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-red-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dirección</span>
                    </div>
                    <div className="card border rounded-lg p-3">
                        <div className="text-sm text-gray-800 dark:text-black font-medium mb-1">
                            {operator.calle} #{operator.externo}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">
                            {operator.colonia} • CP {operator.cp}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <OperatorActions
                        className="flex items-center justify-end gap-2 pt-2"
                        operador={operator}
                        directLink={directLink}
                    />

                    <div className="flex gap-4 items-center">
                        <div className="flex flex-col text-xs text-gray-500">
                            <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>Creado:</span>
                            </div>
                            <span>{format(parseFirebaseDate(operator.createdAt), "dd/MM/yyyy HH:mm", { locale: es })}</span>
                        </div>
                        <div className="flex flex-col text-xs text-gray-500">
                            <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>Ultima actualizacion: </span>
                            </div>
                            <span>{format(parseFirebaseDate(operator.updatedAt), "dd/MM/yyyy HH:mm", { locale: es })}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default OperadorCard