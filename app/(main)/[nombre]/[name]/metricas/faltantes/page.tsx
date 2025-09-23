"use client"

import { CustomFaltantesTooltip } from "@/modules/logistica/metricas/components/custom-faltantes-tooltip";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFaltantesData } from "@/modules/logistica/reportes-viajes/hooks/use-faltantes-data";
import { useFaltantesViajes } from "@/modules/logistica/reportes-viajes/hooks/use-faltantes";
import FaltantesCard from "@/modules/logistica/metricas/components/faltantes-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentMonthCapitalized } from "@/functions/monts-functions";
import { ComboboxFiltro } from "@/components/custom/filter-combobox";
import SelectMes from "@/components/global/select-mes";
import { Separator } from "@/components/ui/separator";
import { useYear } from "@/context/year-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/components/global/icon";
import { useState } from "react";

const MetricasFaltantesPage = () => {
    const capitalizedMonthName = getCurrentMonthCapitalized();
    const [mes, setMes] = useState<string>(capitalizedMonthName);
    const currentYear = new Date().getFullYear();
    const { selectedYear } = useYear();

    const { viajes } = useFaltantesViajes(mes, selectedYear || 0);
    const {
        descripcionesUnicas,
        faltantes,
        filteredFaltantes,
        firstDescripcion,
        firstSelection,
        searchCliente,
        searchDescripcion,
        searchMunicipio,
        secondDescripcion,
        secondSelection,
        setFirstSelection,
        setSearchCliente,
        setSearchDescripcion,
        setSearchMunicipio,
        setSecondSelection
    } = useFaltantesData({
        currentYear: currentYear || 0,
        selectedYear: selectedYear || 0,
        reporteViajes: viajes
    })

    const isFilterActive = firstSelection !== "" || secondSelection !== "";

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon iconName="material-symbols:line-end" className="h-12 w-12 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Metricas de faltantes</h1>
                        <p className="text-muted-foreground">
                            Metricas representadas en un grafico de barras sobre los faltantes y/o sobrantes a 20° y al Natural
                        </p>
                    </div>
                </div>
            </div>

            <Separator className="my-4" />

            <Card>
                <CardContent>
                    <div className="grid grid-cols-12 gap-4">
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

                        <ComboboxFiltro
                            options={descripcionesUnicas}
                            value={firstSelection}
                            onChange={setFirstSelection}
                            disabledOptions={secondSelection ? [secondSelection] : []}
                        />

                        <ComboboxFiltro
                            options={descripcionesUnicas}
                            value={secondSelection}
                            onChange={setSecondSelection}
                            disabledOptions={firstSelection ? [firstSelection] : []}
                        />

                        <SelectMes value={mes} onChange={setMes} className="w-full" />

                        <Button
                            onClick={() => {
                                setSearchMunicipio("")
                                setSearchCliente("")
                                setSearchDescripcion("")
                                setFirstSelection("")
                                setSecondSelection("")
                                setMes(capitalizedMonthName)
                            }}
                            variant={"destructive"}
                            className="w-full"
                            size={"lg"}
                        >
                            Limpiar filtros
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6 mt-6">
                {!isFilterActive && faltantes.length > 0 ? (
                    <ul className="mt-8">
                        {filteredFaltantes.map((clienteViajes) => (
                            <FaltantesCard
                                key={clienteViajes.Cliente}
                                clienteViajes={clienteViajes}
                                searchDescripcion={searchDescripcion}
                            />
                        ))}
                    </ul>
                ) : (
                    <div className="grid grid-cols-2 gap-12 mt-4">
                        {firstDescripcion && (
                            <Card className="border-4 border-gray-300 transition-all duration-300 hover:scale-[103%] hover:shadow-lg">
                                <CardHeader>
                                    <CardTitle>{firstDescripcion.DescripcionDelViaje}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart
                                            layout="vertical"
                                            data={[
                                                { name: "A 20°", value: firstDescripcion.FALTANTESYOSOBRANTESA20 || 0 },
                                                { name: "Al Natural", value: firstDescripcion.FALTANTESYOSOBRANTESALNATURAL || 0 },
                                            ]}
                                            margin={{ top: 10, right: 20, bottom: 10, left: 20 }}
                                        >
                                            <CartesianGrid />
                                            <XAxis type="number" />
                                            <YAxis dataKey="name" type="category" width={80} />
                                            <Tooltip content={<CustomFaltantesTooltip />} />
                                            <Bar dataKey="value" radius={5}>
                                                <Cell fill={(firstDescripcion.FALTANTESYOSOBRANTESA20 || 0) >= 0 ? "#35A408" : "#FF0000"} />
                                                <Cell fill={(firstDescripcion.FALTANTESYOSOBRANTESALNATURAL || 0) >= 0 ? "#35A408" : "#FF0000"} />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        )}

                        {secondDescripcion && (
                            <Card className="border-4 border-gray-300 transition-all duration-300 hover:scale-[103%] hover:shadow-lg">
                                <CardHeader>
                                    <CardTitle>{secondDescripcion.DescripcionDelViaje}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart
                                            layout="vertical"
                                            data={[
                                                { name: "A 20°", value: secondDescripcion.FALTANTESYOSOBRANTESA20 || 0 },
                                                { name: "Al Natural", value: secondDescripcion.FALTANTESYOSOBRANTESALNATURAL || 0 },
                                            ]}
                                            margin={{ top: 10, right: 20, bottom: 10, left: 20 }}
                                        >
                                            <CartesianGrid />
                                            <XAxis type="number" />
                                            <YAxis dataKey="name" type="category" width={80} />
                                            <Tooltip content={<CustomFaltantesTooltip />} />
                                            <Bar dataKey="value" radius={5}>
                                                <Cell fill={(secondDescripcion.FALTANTESYOSOBRANTESA20 || 0) >= 0 ? "#35A408" : "#FF0000"} />
                                                <Cell fill={(secondDescripcion.FALTANTESYOSOBRANTESALNATURAL || 0) >= 0 ? "#35A408" : "#FF0000"} />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MetricasFaltantesPage