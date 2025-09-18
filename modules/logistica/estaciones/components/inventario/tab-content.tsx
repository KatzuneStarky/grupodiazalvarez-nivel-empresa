"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InventarioEstaciones } from "../../types/inventarios"
import { formatNumber } from "@/utils/format-number"
import Icon from "@/components/global/icon"
import { Ref, useState } from "react"
import { cn } from "@/lib/utils"

interface TabContentProps {
    estacionesOrdenadas: InventarioEstaciones[],
    componentRef: Ref<HTMLDivElement>
}

const InventoryTabContent = ({
    estacionesOrdenadas,
    componentRef,
}: TabContentProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventarioEstaciones | null>(null);
    const [selectedDInventariado, setSelectedDInventariado] = useState<'inventarioMagna' | 'inventarioPremium' | 'inventarioDiesel'>('inventarioMagna');

    const openModal = (
        item: InventarioEstaciones,
        campo: 'inventarioMagna' | 'inventarioPremium' | 'inventarioDiesel'
    ) => {
        setSelectedItem(item);
        setSelectedDInventariado(campo);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <Tabs defaultValue="cuadricula" className="w-full">
                <TabsList>
                    <TabsTrigger value="cuadricula">
                        <Icon iconName='ph:squares-four-bold' className='mr-2' />
                        Cuadricula
                    </TabsTrigger>
                    <TabsTrigger value="tabla">
                        <Icon iconName='material-symbols:table' className='mr-2' />
                        Tabla
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="cuadricula">
                    {/** <Cuadricula estacionesOrdenadas={estacionesOrdenadas} componentRef={componentRef} /> */}
                </TabsContent>
                <TabsContent value="tabla">
                    <div className="container mx-auto px-4 py-8 overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                            <thead>
                                <tr className="bg-gray-800 text-white text-center">
                                    <th className="px-4 py-3 border-b text-sm font-semibold">Estación</th>
                                    <th className="px-4 py-3 border-b text-sm font-semibold" style={{ backgroundColor: "rgb(0,165,81)" }}>Inventario Magna</th>
                                    <th className="px-4 py-3 border-b text-sm font-semibold" style={{ backgroundColor: "rgb(0,165,81)" }}>Ventas Diarias Magna</th>
                                    <th className="px-4 py-3 border-b text-sm font-semibold" style={{ backgroundColor: "rgb(0,165,81)" }}>Dias Inventariados</th>
                                    <th className="px-4 py-3 border-b text-sm font-semibold" style={{ backgroundColor: "rgb(213,43,30)" }}>Inventario Premium</th>
                                    <th className="px-4 py-3 border-b text-sm font-semibold" style={{ backgroundColor: "rgb(213,43,30)" }}>Ventas Diarias Premium</th>
                                    <th className="px-4 py-3 border-b text-sm font-semibold" style={{ backgroundColor: "rgb(213,43,30)" }}>Dias Inventariados</th>
                                    <th className="px-4 py-3 border-b text-sm font-semibold" style={{ backgroundColor: "rgb(55,55,53)" }}>Inventario Diesel</th>
                                    <th className="px-4 py-3 border-b text-sm font-semibold" style={{ backgroundColor: "rgb(55,55,53)" }}>Ventas Diarias Diesel</th>
                                    <th className="px-4 py-3 border-b text-sm font-semibold" style={{ backgroundColor: "rgb(55,55,53)" }}>Dias Inventariados</th>
                                </tr>
                            </thead>
                            <tbody>
                                {estacionesOrdenadas.map((item, index) => (
                                    <tr
                                        key={index}
                                        className={cn(
                                            "text-center",
                                            index % 2 === 0 ? "bg-white" : "bg-gray-100"
                                        )}
                                    >
                                        <td className="px-4 py-3 border-b text-sm text-gray-700">
                                            {item.estacion}
                                        </td>
                                        <td
                                            className="px-4 py-3 border-b text-sm text-gray-700 cursor-pointer"
                                            style={{ backgroundColor: "rgba(0,165,81,0.1)" }}
                                            onDoubleClick={() => openModal(item, 'inventarioMagna')}
                                        >
                                            {formatNumber(item.inventarioMagna)}
                                        </td>
                                        <td
                                            className="px-4 py-3 border-b text-sm text-gray-700"
                                            style={{ backgroundColor: "rgba(0,165,81,0.1)" }}>
                                            {formatNumber(item.pVentasDiarias)}
                                        </td>
                                        <td
                                            className="px-4 py-3 border-b text-sm text-gray-700"
                                            style={{ backgroundColor: "rgba(0,165,81,0.1)" }}>
                                            {formatNumber(item.dInventariados1 || 0)}
                                        </td>
                                        <td
                                            className="px-4 py-3 border-b text-sm text-gray-700 cursor-pointer"
                                            style={{ backgroundColor: "rgba(213,43,30,0.1)" }}
                                            onDoubleClick={() => openModal(item, 'inventarioPremium')}
                                        >
                                            {formatNumber(item.inventarioPremium)}
                                        </td>
                                        <td
                                            className="px-4 py-3 border-b text-sm text-gray-700"
                                            style={{ backgroundColor: "rgba(213,43,30,0.1)" }}>
                                            {formatNumber(item.pVentasDiarias2)}
                                        </td>
                                        <td
                                            className="px-4 py-3 border-b text-sm text-gray-700"
                                            style={{ backgroundColor: "rgba(213,43,30,0.1)" }}>
                                            {formatNumber(item.dInventariados2 || 0)}
                                        </td>
                                        <td
                                            className="px-4 py-3 border-b text-sm text-gray-700 cursor-pointer"
                                            style={{ backgroundColor: "rgba(55,55,53,0.1)" }}
                                            onDoubleClick={() => openModal(item, 'inventarioDiesel')}
                                        >
                                            {formatNumber(item.inventarioDiesel)}
                                        </td>
                                        <td
                                            className="px-4 py-3 border-b text-sm text-gray-700"
                                            style={{ backgroundColor: "rgba(55,55,53,0.1)" }}>
                                            {formatNumber(item.pVentasDiarias3)}
                                        </td>
                                        <td className="px-4 py-3 border-b text-sm text-gray-700" style={{ backgroundColor: "rgba(55,55,53,0.1)" }}>
                                            {formatNumber(item.dInventariados3 || 0)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/**
                     * <TablaMagna data={estacionesOrdenadas} />
                    <TablaPremium data={estacionesOrdenadas} />
                    <TablaDiesel data={estacionesOrdenadas} />
                     */}
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default InventoryTabContent