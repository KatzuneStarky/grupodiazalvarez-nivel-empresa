"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MunicipiosCardProps } from "../../../types/logistics-cards";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const MunicipiosCard: React.FC<MunicipiosCardProps> = ({
    mes,
    setMes,
    municipios,
    monthSelect,
    selectedMunicipios,
    capitalizedMonthName,
    handleMunicipiosChange
}) => {
    const [searchTerm, setSearchTerm] = useState<string>("");

    const filteredMunicipio = municipios.filter((municipio) =>
        municipio.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Card className='w-full'>
            <CardHeader>
                <CardTitle className="flex flex-col md:flex-row md:items-center 
                justify-between space-y-0 pb-2 w-full gap-4">
                    <span className="text-2xl font-extrabold w-full">
                        Municipios
                    </span>
                    <Input
                        type="text"
                        placeholder="Buscar municipio..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-4"
                    />
                </CardTitle>
            </CardHeader>
            <CardContent className="pl-2 flex items-center justify-center">
                <ScrollArea className='h-[200px] w-full p-4'>
                    {filteredMunicipio.length > 0 && filteredMunicipio.map(d => (
                        <div key={d} className={`flex items-center p-1 mt-2 rounded-md ${selectedMunicipios.includes(d) ? "bg-emerald-300 text-black" : ""}`}>
                            <Checkbox
                                checked={selectedMunicipios.includes(d)}
                                onCheckedChange={() => handleMunicipiosChange(d)}
                                className="mr-2"
                            />
                            <h3 className="text-lg font-semibold ml-2">{d}</h3>
                        </div>
                    ))}
                    {
                        municipios.length === 0 &&
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

export default MunicipiosCard;