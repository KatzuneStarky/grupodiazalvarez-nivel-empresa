"use client"

import { InventarioEstaciones } from "../../../types/inventarios"
import { separarValor } from "../../../functions/separar-valor";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { weekdays } from "../../../constants/weekdays";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface TableProps {
    inventarios: InventarioEstaciones[]
}

const TablaDiesel = ({
    inventarios
}: TableProps) => {
    const [estacionesSeleccionadas, setEstacionesSeleccionadas] = useLocalStorage<{
        [key: string]: { dia: string; valores: { [key: string]: number } }
    }>("estacionesSeleccionadas3", {});

    function handleSeleccionarDia(estacion: string, dia: string, valor: number) {
        const valores = separarValor(valor, dia);
        setEstacionesSeleccionadas((prev) => ({
            ...prev,
            [estacion]: { dia, valores },
        }));
    }

    return (
        <div className="container mx-auto px-4 py-8 overflow-x-auto">
            <table className="w-full min-w-[800px] bg-[rgba(55,55,53,0.1)] border-collapse" role="grid" aria-label="Inventory Table">
                <thead className='bg-[rgb(55,55,53)] text-white'>
                    <tr>
                        <th className="p-4 font-bold text-left border border-gray-200 w-32">
                            Estación
                        </th>
                        {weekdays.map((day) => (
                            <th key={day} className="p-4 font-bold text-center border border-gray-200 capitalize">
                                {day}
                            </th>
                        ))}
                        <th className="p-4 font-bold text-center border border-gray-200 w-8">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {inventarios.map((item, index) => (
                        <tr
                            key={`${item.estacion} - ${index}`}
                            className="transition-all duration-200"
                            role="row"
                        >
                            <td className="border border-gray-200 w-fit text-xs text-center">{item.estacion}</td>
                            {weekdays.map((dia, index) => {
                                const valores = estacionesSeleccionadas[item.estacion]?.valores || {};
                                const valorDia = valores[dia] || 0;

                                let background = '';
                                if (valorDia >= 2) {
                                    background = 'bg-gray-700';
                                } else if (valorDia === 1) {
                                    background = 'bg-[rgb(55,55,53)]';
                                } else if (valorDia > 1 && valorDia < 2) {
                                    background = 'bg-gray-600';
                                } else if (valorDia > 0 && valorDia < 1) {
                                    background = 'bg-[rgba(55,55,53,0.1)]'
                                }

                                return (
                                    <td
                                        key={`${index}`}
                                        onClick={() =>
                                            handleSeleccionarDia(item.estacion, dia, item.dInventariados3 || 0)
                                        }
                                        className={`text-center border border-gray-200 
                                                cursor-pointer transition-colors duration-200 ${background}
                                                ${valorDia ? "text-white" : "text-black"}`}
                                        role="cell"
                                        style={
                                            valorDia > 1 && valorDia < 2
                                                ? {
                                                    background: `linear-gradient(to right, #1A1A17 ${(valorDia % 1) * 100
                                                        }%, transparent ${(
                                                            valorDia % 1
                                                        )}%)`,
                                                }
                                                : {}
                                        }
                                    >
                                        {valorDia > 0 ? valorDia.toFixed(2) : '-'}
                                    </td>
                                )
                            })}
                            <td className="text-center border border-gray-200 w-4">
                                <Button
                                    variant={"destructive"}
                                    className='w-fit place-self-center'
                                    onClick={() =>
                                        handleSeleccionarDia(item.estacion, "", 0)
                                    }
                                >
                                    <Trash />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TablaDiesel