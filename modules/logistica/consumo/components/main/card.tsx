"use client"

import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { OrdenDeConsumo } from "../../types/orden-de-consumo"
import { Card } from "@/components/ui/card"
import { es } from "date-fns/locale"
import { format } from "date-fns"
import OrdenesConsumoActions from "./actions"

interface OrdenesConsumoViewProps {
    data: OrdenDeConsumo
    getEstadoColor: (estado: string) => string
    formatFolio: (value: number) => string
}

const OrdenConsumoCard = ({
    data,
    getEstadoColor,
    formatFolio
}: OrdenesConsumoViewProps) => {
    return (
        <Card className="p-5">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <div className="text-2xl font-bold font-mono">
                        {formatFolio(data.folio)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                        {format(parseFirebaseDate(data.fecha), 'dd/MM/yyyy HH:mm:ss', { locale: es })}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getEstadoColor(
                            data.estado
                        )}`}
                    >
                        {data.estado.replace(/_/g, ' ')}
                    </span>

                    <OrdenesConsumoActions
                        buttonVariant="ghost"
                        orden={data}
                    />
                </div>
            </div>

            <div className="mb-2 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold">
                        {data.numEconomico}
                    </span>
                    <span className="text-sm">•</span>
                    <span className="text-sm">{data.operador}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium">{data.kilometraje.toLocaleString()}</span> km
                    <span className="mx-2">•</span>
                    {data.destino}
                </div>
            </div>

            <div className="space-y-3 mb-4">
                <div className="text-xs font-semibold uppercase tracking-wider">
                    Mediciones de Combustible
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                        <div className="text-xs text-gray-600 dark:text-white mb-1">Antes</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {data.mediciones.antes.diesel}
                            <span className="text-xs font-normal text-gray-500 dark:text-white ml-1">L</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-white mt-1 space-y-0.5">
                            <div>Tanque: {data.mediciones.antes.medidaTanque}</div>
                            <div>Tablero: {data.mediciones.antes.medidaTablero}</div>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                        <div className="text-xs text-gray-600 dark:text-white mb-1">Después</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {data.mediciones.despues.diesel}
                            <span className="text-xs font-normal text-gray-500 dark:text-white ml-1">L</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-white mt-1 space-y-0.5">
                            <div>Tanque: {data.mediciones.despues.medidaTanque}</div>
                            <div>Tablero: {data.mediciones.despues.medidaTablero}</div>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-2">
                    <div className="text-xs text-blue-600 font-medium">
                        Consumo:{' '}
                        <span className="font-bold">
                            {Math.abs(data.mediciones.despues.diesel - data.mediciones.antes.diesel)} L
                        </span>
                    </div>
                </div>
            </div>

            {data.observaciones && (
                <div className="pt-3 border-t border-gray-100">
                    <div className="text-xs font-semibold text-gray-700 mb-1">
                        Observaciones
                    </div>
                    <div className="text-sm text-gray-600 italic">
                        {data.observaciones}
                    </div>
                </div>
            )}
        </Card>
    )
}

export default OrdenConsumoCard