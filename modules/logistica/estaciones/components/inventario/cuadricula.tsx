"use client"

import { InventarioEstaciones } from "../../types/inventarios"
import { weekdays } from "../../constants/weekdays"
import { Ref, useEffect, useState } from "react"
import { Calendar } from "lucide-react"

interface CuadriculaProps {
    estacionesOrdenadas: InventarioEstaciones[],
    componentRef: Ref<HTMLDivElement>
}

type FuelConfig = { key: string; color: string }

const fuelConfigs: FuelConfig[] = [
    { key: "estacionesSeleccionadas", color: "bg-[rgba(0,165,81,0.3)] dark:bg-emerald-600" },
    { key: "estacionesSeleccionadas2", color: "bg-[rgba(213,43,30,0.3)] dark:bg-red-600" },
    { key: "estacionesSeleccionadas3", color: "bg-[rgba(55,55,53,0.3)] dark:bg-gray-500" },
]

type FuelState = {
    dia: string
    valores: Record<string, number>
}

const Cuadricula = ({
    estacionesOrdenadas,
    componentRef,
}: CuadriculaProps) => {
    const [fuelStates, setFuelStates] = useState<Record<string, Record<string, FuelState>>>({})

    useEffect(() => {
        const newStates: any = {}
        fuelConfigs.forEach(({ key }) => {
            const saved = localStorage.getItem(key)
            if (saved) newStates[key] = JSON.parse(saved)
        })
        setFuelStates(newStates)
    }, [])

    const renderFuelRow = (estacion: string, config: FuelConfig) => {
        const valores = fuelStates[config.key]?.[estacion]?.valores || {}

        return (
            <div className="grid grid-cols-7 w-full">
                {weekdays.map((day) => {
                    const valorDia = valores[day] || 0
                    return (
                        <div
                            key={`${config.key}-${estacion}-${day}`} // único por fuel + estación + día
                            className={`py-3 text-center text-xs border-r last:border-r-0 ${valorDia > 0
                                    ? `${config.color} text-black dark:text-white font-medium`
                                    : "text-gray-400"
                                }`}
                        >
                            {valorDia > 0
                                ? valorDia < 1
                                    ? valorDia.toFixed(2)
                                    : valorDia.toFixed(2)
                                : "-"}
                        </div>
                    )
                })}
            </div>
        )
    }

    return (
        <div className="mx-auto container">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                Vista general
            </h2>
            <div
                ref={componentRef}
                className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-6 printable-grid"
            >
                {estacionesOrdenadas.map((data, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-black rounded-lg shadow-lg px-6 hover:shadow-xl transition-shadow duration-300 min-w-[280px]"
                    >
                        <div className="flex items-center gap-3 mb-4 mt-2">
                            <Calendar className="text-blue-600 text-xl mt-2" />
                            <h3 className="text-sm font-bold text-gray-800 dark:text-white">
                                {data.estacion}
                            </h3>
                        </div>

                        <div className="border-4 rounded-lg overflow-hidden mb-4">
                            <div className="grid grid-cols-7 border">
                                {weekdays.map((day, index) => (
                                    <div
                                        key={`${day}-${index}`}
                                        className="p-2 text-center text-sm font-medium border-r last:border-r-0 bg-gray-100 text-gray-600"
                                    >
                                        {day.slice(0, 3)}
                                    </div>
                                ))}
                            </div>

                            {fuelConfigs.map((config) => renderFuelRow(data.estacion, config))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Cuadricula