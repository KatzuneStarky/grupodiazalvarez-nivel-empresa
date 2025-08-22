"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientesCardProps } from "../../../types/logistics-cards";
import { ScrollArea } from "@/components/ui/scroll-area";
import SelectMes from "@/components/global/select-mes";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useState } from "react";


const ClientesCard: React.FC<ClientesCardProps> = ({
    mes,
    setMes,
    clientes,
    selectedClientes,
    handleClienteChange,
    capitalizedMonthName,
    children
}) => {
    const [searchTerm, setSearchTerm] = useState<string>("");

    const highlightSearchTerm = (text: string) => {
        if (!searchTerm) return text;

        const regex = new RegExp(`(${searchTerm})`, "gi");
        return text.split(regex).map((part, index) =>
            regex.test(part) ? <span key={index} className="bg-yellow-200">{part}</span> : part
        );
    };

    return (
        <Card className='w-full'>
            <CardHeader>
                <CardTitle className="flex flex-col 2xl:items-center justify-between space-y-0 pb-2 w-full gap-4">
                    <div className="flex items-center justify-between w-full gap-5">
                        <span className="text-2xl font-extrabold">
                            Clientes
                        </span>
                        <Input
                            type="text"
                            placeholder="Buscar clientes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <SelectMes value={mes} onChange={(value: string) => setMes(value)} />
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="pl-2 flex items-center justify-center">
                <ScrollArea className='h-[200px] w-full p-4'>
                    {clientes.length > 0 ? (
                        clientes.map((cliente) => (
                            <div
                                key={cliente}
                                className={`flex items-center p-1 mt-2 rounded-md ${selectedClientes.includes(cliente) ? "bg-emerald-300 text-black" : ""}`}
                            >
                                <Checkbox
                                    checked={selectedClientes.includes(cliente)}
                                    onCheckedChange={() => handleClienteChange([cliente])} // Pasa un array con un solo cliente
                                    className="mr-2"
                                />
                                <h3 className="text-lg font-semibold ml-2">
                                    {highlightSearchTerm(cliente)}
                                </h3>
                            </div>
                        ))
                    ) : (
                        <p className="font-bold flex items-center justify-center">
                            {/**
                             * {mes === capitalizedMonthName ? (
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
                            )}
                             */}
                        </p>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default ClientesCard;