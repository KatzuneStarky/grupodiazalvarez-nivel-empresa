"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EquiposCardProps } from "../../../types/logistics-cards";
import { ScrollArea } from "@/components/ui/scroll-area";
import SelectMes from "@/components/global/select-mes";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const EquiposCard: React.FC<EquiposCardProps> = ({
    mes,
    setMes,
    equipos,
    selectedEquipos,
    capitalizedMonthName,
    handleEquiposChange,
    monthSelect,
    children
}) => {
    const [searchTerm, setSearchTerm] = useState<string>("");

    const filteredEquipos = equipos.filter((equipo) =>
        equipo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Card className='w-full'>
            <CardHeader>
                <CardTitle className="flex md:items-center 
                justify-between space-y-0 pb-2 w-full gap-4">
                    <span className="text-2xl font-extrabold w-full text-black 
                    dark:text-white">
                        Equipos
                    </span>
                    <Input
                        type="text"
                        placeholder="Buscar equipos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                    {monthSelect && (
                        <SelectMes value={mes}
                            onChange={(value: string) => setMes(value)} />
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="pl-2 flex items-center justify-center">
                <ScrollArea className='h-[200px] w-full p-4'>
                    {filteredEquipos.length > 0 && filteredEquipos.map(equipo => (
                        <div key={equipo} className={`flex items-center p-1 mt-2 rounded-md ${selectedEquipos.includes(equipo) ? "bg-emerald-300 text-black" : ""}`}>
                            <Checkbox
                                checked={selectedEquipos.includes(equipo)} // Controlamos el estado del checkbox
                                onCheckedChange={() => handleEquiposChange(equipo)} // Llamamos a handleEquiposChange para actualizar el estado
                                className="mr-2"
                            />
                            <h3 className="text-lg font-semibold ml-2">{equipo}</h3>
                        </div>
                    ))}
                    {
                        equipos.length === 0 &&
                        <p className="font-bold flex items-center justify-center">
                            {/**
                             * {
                                mes === capitalizedMonthName ?
                                    (
                                        <p className="flex flex-col items-center justify-center">
                                            <span>No hay datos en el mes actual ({mes})</span>
                                            <Lottie
                                                animationData={NoData}
                                                loop
                                                className="w-1/3"
                                            />
                                        </p>
                                    ) : (
                                        <p className="flex flex-col items-center justify-center">
                                            <span>No hay datos en el mes seleccionado ({mes})</span>
                                            <Lottie
                                                animationData={NoData}
                                                loop
                                                className="w-1/3"
                                            />
                                        </p>
                                    )
                            }
                             */}
                        </p>
                    }
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default EquiposCard;