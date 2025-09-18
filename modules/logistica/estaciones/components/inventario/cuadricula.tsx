"use client"

import { InventarioEstaciones } from "../../types/inventarios"
import { Ref, useEffect, useState } from "react"
import { Calendar } from "lucide-react"

const weekdays = [
    'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
];

interface CuadriculaProps {
    estacionesOrdenadas: InventarioEstaciones[],
    componentRef: Ref<HTMLDivElement>
}

const Cuadricula = ({
    estacionesOrdenadas,
    componentRef,
}: CuadriculaProps) => {
    const [estacionesSeleccionadas, setEstacionesSeleccionadas] = useState<{
        [key: string]: { dia: string; valores: { [key: string]: number } };
    }>({});

    const [estacionesSeleccionadas2, setEstacionesSeleccionadas2] = useState<{
        [key: string]: { dia: string; valores2: { [key: string]: number } };
    }>({});

    const [estacionesSeleccionadas3, setEstacionesSeleccionadas3] = useState<{
        [key: string]: { dia: string; valores3: { [key: string]: number } };
    }>({});

    useEffect(() => {
        const savedEstacionesSeleccionadas = localStorage.getItem('estacionesSeleccionadas');
        const savedEstacionesSeleccionadas2 = localStorage.getItem('estacionesSeleccionadas2');
        const savedEstacionesSeleccionadas3 = localStorage.getItem('estacionesSeleccionadas3');

        if (savedEstacionesSeleccionadas) {
            setEstacionesSeleccionadas(JSON.parse(savedEstacionesSeleccionadas));
        }
        if (savedEstacionesSeleccionadas2) {
            setEstacionesSeleccionadas2(JSON.parse(savedEstacionesSeleccionadas2));
        }
        if (savedEstacionesSeleccionadas3) {
            setEstacionesSeleccionadas3(JSON.parse(savedEstacionesSeleccionadas3));
        }
    }, []);

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
                        className="bg-white dark:bg-black rounded-lg shadow-lg px-6 hover:shadow-xl transition-shadow duration-300 min-w-[280px]"
                        key={index}>
                        <div className="flex items-center gap-3 mb-4 mt-2">
                            <Calendar className="text-blue-600 text-xl mt-2" />
                            <h3 className="text-sm font-bold text-gray-800 dark:text-white">{data.estacion}</h3>
                        </div>

                        <div className="border-4 rounded-lg overflow-hidden mb-4">
                            <div className="grid grid-cols-7 border">
                                {weekdays.map((day, index) => (
                                    <div
                                        key={index}
                                        className="p-2 text-center text-sm font-medium border-r last:border-r-0 bg-gray-100 text-gray-600"
                                    >
                                        {day.slice(0, 3)}
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 w-full">
                                {weekdays.map((day, index) => {
                                    const valores = estacionesSeleccionadas[data.estacion]?.valores || {};
                                    const valorDia = valores[day] || 0;
                                    return (
                                        (
                                            <div
                                                key={index}
                                                className={`py-3 text-center text-xs border-r last:border-r-0 ${valorDia > 0
                                                    ? 'bg-[rgba(0,165,81,0.3)] dark:bg-emerald-600 text-black dark:text-white font-medium'
                                                    : 'text-gray-400'
                                                    }`}
                                            >
                                                {valorDia > 0
                                                    ? valorDia < 1 ? valorDia.toFixed(2) : valorDia
                                                    : '-'}
                                            </div>
                                        )
                                    )
                                })}
                            </div>
                            <div className="grid grid-cols-7 w-full">
                                {weekdays.map((day, index) => {
                                    const valores = estacionesSeleccionadas2[data.estacion]?.valores2 || {};
                                    const valorDia = valores[day] || 0;
                                    return (
                                        (
                                            <div
                                                key={index}
                                                className={`py-3 text-center text-xs border-r last:border-r-0 ${valorDia > 0
                                                    ? 'bg-[rgba(213,43,30,0.3)] dark:bg-red-600 text-black dark:text-white font-medium'
                                                    : 'text-gray-400'
                                                    }`}
                                            >
                                                {valorDia > 0
                                                    ? valorDia < 1 ? valorDia.toFixed(2) : valorDia
                                                    : '-'}
                                            </div>
                                        )
                                    )
                                })}
                            </div>
                            <div className="grid grid-cols-7 w-full">
                                {weekdays.map((day, index) => {
                                    const valores = estacionesSeleccionadas3[data.estacion]?.valores3 || {};
                                    const valorDia = valores[day] || 0;
                                    return (
                                        (
                                            <div
                                                key={index}
                                                className={`py-3 text-center text-xs border-r last:border-r-0 ${valorDia > 0
                                                    ? 'bg-[rgba(55,55,53,0.3)] dark:bg-gray-500 text-black dark:text-white font-medium'
                                                    : 'text-gray-400'
                                                    }`}
                                            >
                                                {valorDia > 0
                                                    ? valorDia < 1 ? valorDia.toFixed(2) : valorDia
                                                    : '-'}
                                            </div>
                                        )
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Cuadricula