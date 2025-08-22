"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductosCardProps } from "../../../types/logistics-cards";
import { tailwindColorMapping } from "../../../constants/colors";
import { ScrollArea } from "@/components/ui/scroll-area";
import SelectMes from "@/components/global/select-mes";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

const ProductosCard: React.FC<ProductosCardProps> = ({
    mes,
    setMes,
    productos,
    selectedProductos,
    capitalizedMonthName,
    handleProductosChange,
    monthSelect
}) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const uniqueProductos = Array.from(new Set(productos));

    const filteredProductos = uniqueProductos.filter((producto) =>
        producto.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Card className='w-full'>
            <CardHeader>
                <CardTitle className="flex flex-col md:flex-row md:items-center 
                justify-between space-y-0 pb-2 w-full gap-4">
                    <span className="text-2xl font-extrabold w-full 
                        text-black dark:text-white">
                        Productos
                    </span>
                    <div className="flex flex-col xl:flex-row xl:items-center gap-4 w-full text-black dark:text-white">
                        <Input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className=""
                        />
                        {monthSelect && (
                            <SelectMes value={mes}
                                onChange={(value: string) => setMes(value)} />
                        )}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="pl-2 flex items-center justify-center">
                <ScrollArea className='h-52 w-full p-4'>
                    {filteredProductos.length > 0 && filteredProductos.map(producto => (
                        <div
                            key={producto}
                            className={cn(
                                "flex items-center p-1 mt-2 rounded-md",
                                selectedProductos.includes(producto) ? tailwindColorMapping[producto] : "bg-transparent"
                            )}
                        >
                            <Checkbox
                                checked={selectedProductos.includes(producto)}
                                onCheckedChange={() => handleProductosChange(producto)}
                                className="mr-2"
                            />
                            <h3 className="text-lg font-semibold ml-2">{producto}</h3>
                        </div>
                    ))}
                    {
                        productos.length === 0 &&
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

export default ProductosCard;