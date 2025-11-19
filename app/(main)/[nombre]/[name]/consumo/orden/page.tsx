"use client"

import { useOrdenesConsumos } from "@/modules/logistica/consumo/hooks/use-ordenes-consumos";
import OrdenConsumoTable from "@/modules/logistica/consumo/components/main/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutGrid, Table2 } from "lucide-react";
import OrdenConsumoCard from "@/modules/logistica/consumo/components/main/card";

const OrdenConsumoPage = () => {
    const { ordenesConsumos } = useOrdenesConsumos()

    function getEstadoColor(estado: string): string {
        const colors: Record<string, string> = {
            GENERADA: 'bg-blue-100 text-blue-800 border-blue-200',
            IMPRESA: 'bg-purple-100 text-purple-800 border-purple-200',
            PENDIENTE_CAPTURA: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            COMPLETADA: 'bg-green-100 text-green-800 border-green-200',
            CANCELADA: 'bg-red-100 text-red-800 border-red-200',
        };
        return colors[estado] || 'bg-gray-100 text-gray-800 border-gray-200';
    }

    const formatFolio = (num: number): string => {
        return String(num).padStart(6, "0");
    };

    return (
        <div className="container mx-auto py-8 px-6">
            <div className="w-full space-y-4">
                <Tabs defaultValue="table" className="flex justify-end">
                    <TabsList className="inline-flex rounded-lg border p-1">
                        <TabsTrigger value="table" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all">
                            <Table2 className="w-4 h-4" />
                            Tabla
                        </TabsTrigger>
                        <TabsTrigger value="card" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all">
                            <LayoutGrid className="w-4 h-4" />
                            Tarjetas
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="table">
                        <OrdenConsumoTable
                            getEstadoColor={getEstadoColor}
                            formatFolio={formatFolio}
                            data={ordenesConsumos}
                        />
                    </TabsContent>
                    <TabsContent value="card">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {ordenesConsumos.map((orden) => (
                                <OrdenConsumoCard
                                    getEstadoColor={getEstadoColor}
                                    formatFolio={formatFolio}
                                    key={orden.id}
                                    data={orden}
                                />
                            ))}
                        </div>

                        {ordenesConsumos.length === 0 && (
                            <div className="col-span-full py-12 text-center text-sm text-gray-500">
                                No hay órdenes de consumo para mostrar
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default OrdenConsumoPage