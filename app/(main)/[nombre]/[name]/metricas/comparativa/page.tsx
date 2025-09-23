"use client"

import { useMetricasComparativaEstaciones } from "@/modules/logistica/reportes-viajes/hooks/use-metricas-comparativa-estaciones";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { obtenerSumaM3PorProductoYViaje } from "@/modules/logistica/reportes-viajes/actions/read";
import { ClienteViajes } from "@/modules/logistica/reportes-viajes/types/reporte-viajes";
import { getCurrentMonthCapitalized } from "@/functions/monts-functions";
import { ComboboxFiltro } from "@/components/custom/filter-combobox";
import { Card, CardContent } from "@/components/ui/card";
import SelectMes from "@/components/global/select-mes";
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox";
import { useYear } from "@/context/year-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import Icon from "@/components/global/icon"
import { getClientTextColor } from "@/modules/logistica/metricas/constants/client-text-color";
import GraficoProductos from "@/modules/logistica/metricas/components/grafico-productos";
import { getClientBorderColor } from "@/modules/logistica/metricas/constants/client-border-color";
import { colorMapping } from "@/modules/logistica/graficas/constants/colors";

const MetricasComparativaPage = () => {
    const [sumaM3PorProductoYViaje, setSumaM3PorProductoYViaje] = useState<ClienteViajes[]>([]);
    const [loading, setLoading] = useState(true);

    const capitalizedMonthName = getCurrentMonthCapitalized();
    const [mes, setMes] = useState<string>(capitalizedMonthName);
    const { selectedYear } = useYear();

    const {
        datosFiltrados,
        searchCliente,
        setSearchCliente,
        searchDescripcion,
        setSearchDescripcion,
        isCheckboxChecked,
        setIsCheckboxChecked,
        selectedDescripcion1,
        setSelectedDescripcion1,
        selectedDescripcion2,
        setSelectedDescripcion2,
        comparacionResultado,
        searchMunicipio,
        setSearchMunicipio
    } = useMetricasComparativaEstaciones
            ({ sumaM3PorProductoYViaje: sumaM3PorProductoYViaje, mes, selectedYear: selectedYear || 0 });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await obtenerSumaM3PorProductoYViaje(mes, searchMunicipio, selectedYear || 0);
                setSumaM3PorProductoYViaje(data);
            } catch (error) {
                console.error("Error obteniendo datos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [mes, selectedYear, searchMunicipio]);

    const descripcionesUnicas = datosFiltrados.flatMap(cliente =>
        cliente.DescripcionesDelViaje.map(d => ({
            value: d.Descripcion,
            label: d.Descripcion,
            cliente: cliente.Cliente,
        }))
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon iconName="emojione-monotone:balance-scale" className="h-12 w-12 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Comparativa de combustibles</h1>
                        <p className="text-muted-foreground">
                            Metricas de ventas de combustibles por estacion y cliente
                        </p>
                    </div>
                </div>
            </div>

            <Separator className="my-4" />

            <Card>
                <CardContent>
                    <div className="grid grid-cols-8 gap-4">
                        <Input
                            type="text"
                            placeholder="Buscar por ruta..."
                            value={searchDescripcion}
                            onChange={(e) => setSearchDescripcion(e.target.value)}
                            className="col-span-2"
                        />

                        <Input
                            type="text"
                            placeholder="Buscar por cliente..."
                            value={searchCliente}
                            onChange={(e) => setSearchCliente(e.target.value)}
                            className="col-span-2"
                        />

                        <Select
                            value={searchMunicipio}
                            onValueChange={(value) => setSearchMunicipio(value)}
                        >
                            <SelectTrigger className="col-span-2 w-full">
                                <SelectValue
                                    placeholder={searchMunicipio || "Selecciona un municipio"}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="LA PAZ">LA PAZ</SelectItem>
                                <SelectItem value="LOS CABOS">LOS CABOS</SelectItem>
                                <SelectItem value="COMONDÚ">COMONDÚ</SelectItem>
                                <SelectItem value="MULEGÉ">MULEGÉ</SelectItem>
                            </SelectContent>
                        </Select>

                        <SelectMes value={mes} onChange={setMes} className="w-full" />

                        <Button
                            onClick={() => {
                                setSearchMunicipio("")
                                setSearchCliente("")
                                setSearchDescripcion("")
                                setSelectedDescripcion1("")
                                setSelectedDescripcion2("")
                                setMes(capitalizedMonthName)
                            }}
                            variant={"destructive"}
                            className="w-full"
                            size={"lg"}
                        >
                            Limpiar filtros
                        </Button>
                    </div>

                    <div className="grid grid-cols-6 place-items-center gap-4 mt-4 max-w-2xl">
                        <ComboboxFiltro
                            options={descripcionesUnicas}
                            value={selectedDescripcion1}
                            onChange={setSelectedDescripcion1}
                            disabledOptions={selectedDescripcion2 ? [selectedDescripcion2] : []}
                        />

                        <ComboboxFiltro
                            options={descripcionesUnicas}
                            value={selectedDescripcion2}
                            onChange={setSelectedDescripcion2}
                            disabledOptions={selectedDescripcion1 ? [selectedDescripcion1] : []}
                        />

                        <div className="flex flex-row items-center space-x-3 rounded-md border px-4 py-2 col-span-2 w-full">
                            <Checkbox
                                checked={isCheckboxChecked}
                                onCheckedChange={(value) => setIsCheckboxChecked(value === true)}
                            />
                            <div className="leading-none flex flex-col items-start justify-center">
                                <span className="text-base">Filtrar combustible</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6 mt-6">
                {datosFiltrados.length === 0 ? (
                    <>
                        {/** <NoDataAnimation /> */}
                    </>
                ) : (
                    datosFiltrados.map((clienteViajes, clienteIndex) => (
                        <div key={`${clienteIndex}-${clienteViajes.Cliente}`}>
                            <h2 className={`mb-2 text-4xl font-extrabold ${getClientTextColor(clienteViajes.Cliente)}`}>
                                {clienteViajes.Cliente}
                            </h2>

                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 mt-[25px] pb-[25px] gap-4">
                                {clienteViajes.DescripcionesDelViaje.map((descripcion, descIndex) => {
                                    const seleccionada =
                                        descripcion.Descripcion === selectedDescripcion1 ||
                                        descripcion.Descripcion === selectedDescripcion2;

                                    return (
                                        <GraficoProductos
                                            key={`${descIndex}-${descripcion.Descripcion}-${clienteViajes.Cliente}`}
                                            productos={descripcion.Productos}
                                            titulo={`${descripcion.Descripcion} - ${clienteViajes.Cliente}`}
                                            descripcion={`Datos de suma M³ por producto para ${descripcion.Descripcion}`}
                                            colorCliente={getClientBorderColor(clienteViajes.Cliente)}
                                            seleccionada={seleccionada}
                                            colorMapping={colorMapping}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default MetricasComparativaPage