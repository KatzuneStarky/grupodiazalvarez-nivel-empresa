"use client"

import { getBackgroundColorMagna } from "../../../constants/background-color";
import { getGradientMagna } from "../../../constants/gradient-color";
import { InventarioEstaciones } from "../../../types/inventarios"
import { separarValor } from "../../../functions/separar-valor";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { weekdays } from "../../../constants/weekdays";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface TableProps {
    inventarios: InventarioEstaciones[]
}

const TablaMagna = ({
    inventarios
}: TableProps) => {
    const [estacionesSeleccionadas, setEstacionesSeleccionadas] = useLocalStorage<{
        [key: string]: { dia: string; valores: { [key: string]: number } }
    }>("estacionesSeleccionadas", {});

    function handleSeleccionarDia(estacion: string, dia: string, valor: number) {
        const valores = separarValor(valor, dia);
        setEstacionesSeleccionadas((prev) => ({
            ...prev,
            [estacion]: { dia, valores },
        }));
    }

    return (
        <div className="container mx-auto px-4 py-8 overflow-x-auto">
            <table
                className="w-full min-w-[800px] bg-[rgba(0,165,81,0.1)] border-collapse"
                role="grid"
                aria-label="Inventory Table"
            >
                <thead className="bg-[rgb(0,165,81)] text-white">
                    <tr>
                        <th className="p-4 font-bold text-left border border-gray-200 w-32">Estación</th>
                        {weekdays.map((day) => (
                            <th
                                key={day}
                                className="p-4 font-bold text-center border border-gray-200 capitalize"
                            >
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
                            key={`${item.estacion}-${index}`}
                            className="transition-all duration-200"
                            role="row"
                        >
                            <td className="border border-gray-200 w-fit text-xs text-center p-2">
                                {item.estacion}
                            </td>

                            {weekdays.map((dia) => {
                                const valores = estacionesSeleccionadas[item.estacion]?.valores || {};
                                const valorDia = valores[dia] || 0;

                                return (
                                    <td
                                        key={`${item.estacion}-${dia}`}
                                        onClick={() => handleSeleccionarDia(item.estacion, dia, item.dInventariados1 || 0)}
                                        className={`text-center border border-gray-200 cursor-pointer transition-colors duration-200 ${getBackgroundColorMagna(valorDia)}`}
                                        role="cell"
                                        style={getGradientMagna(valorDia)}
                                    >
                                        {valorDia > 0 ? valorDia.toFixed(2) : "-"}
                                    </td>
                                );
                            })}

                            <td className="text-center border border-gray-200 w-4">
                                <Button
                                    variant="destructive"
                                    className="w-fit place-self-center"
                                    onClick={() => handleSeleccionarDia(item.estacion, "", 0)}
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

export default TablaMagna