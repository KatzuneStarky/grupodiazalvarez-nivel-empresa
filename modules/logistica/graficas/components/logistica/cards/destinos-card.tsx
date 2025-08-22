"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DescripcionesCardProps } from "../../../types/logistics-cards";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const DescripcionesCard: React.FC<DescripcionesCardProps> = ({
    mes,
    setMes,
    descripciones,
    selectedDescripciones,
    capitalizedMonthName,
    handleDescripcionesChange
}) => {
    const [searchTerm, setSearchTerm] = useState<string>("");

    const filteredDescripciones = descripciones.filter((descripcion) =>
        descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Card className='w-full'>
            <CardHeader>
                <CardTitle className="flex flex-col md:flex-row md:items-center 
                justify-between space-y-0 pb-2 w-full gap-4">
                    <span className="text-2xl font-extrabold w-full">
                        Descripciones
                    </span>
                    <Input
                        type="text"
                        placeholder="Buscar descripciones..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-4"
                    />
                </CardTitle>
            </CardHeader>
            <CardContent className="pl-2 flex items-center justify-center">
                <ScrollArea className='h-[200px] w-full p-4'>
                    {filteredDescripciones.length > 0 && filteredDescripciones.map(d => (
                        <div key={d} className={`flex items-center p-1 mt-2 rounded-md ${selectedDescripciones.includes(d) ? "bg-emerald-300 text-black" : ""}`}>
                            <Checkbox
                                checked={selectedDescripciones.includes(d)}
                                onCheckedChange={() => handleDescripcionesChange(d)}
                                className="mr-2"
                            />
                            <h3 className="text-lg font-semibold ml-2">{d}</h3>
                        </div>
                    ))}
                    {
                        descripciones.length === 0 &&
                        <p className="font-bold flex items-center justify-center">
                            {/**
                             * {
                                mes === capitalizedMonthName ?
                                    (
                                        <div className="flex flex-col items-center justify-center">
                                            <span>No hay datos en el mes actual ({mes})</span>
                                            <Lottie
                                                animationData={NoData}
                                                loop
                                                className="w-1/3"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center">
                                            <span>No hay datos en el mes seleccionado ({mes})</span>
                                            <Lottie
                                                animationData={NoData}
                                                loop
                                                className="w-1/3"
                                            />
                                        </div>
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

export default DescripcionesCard;