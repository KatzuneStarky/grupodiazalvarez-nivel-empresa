"use client"

import { Bar, BarChart, CartesianGrid, Cell, LabelList, Tooltip, TooltipProps, XAxis, YAxis } from "recharts";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFiltrosFaltantes } from "@/modules/logistica/reportes-viajes/hooks/use-filtros-faltantes";
import { useFiltrarFaltantes } from "@/modules/logistica/reportes-viajes/hooks/use-filtrar-faltantes";
import { getClientBorderColor } from "@/modules/logistica/metricas/constants/client-border-color";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getClientTextColor } from "@/modules/logistica/metricas/constants/client-text-color";
import { groupByClienteDescripcion } from "@/modules/logistica/reportes-viajes/actions/read";
import { useFaltantesViajes } from "@/modules/logistica/reportes-viajes/hooks/use-faltantes";
import { getColorClass } from "@/modules/logistica/metricas/constants/tooltip-color";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getCurrentMonthCapitalized } from "@/functions/monts-functions";
import SelectMes from "@/components/global/select-mes";
import { Separator } from "@/components/ui/separator";
import { formatNumber } from "@/utils/format-number";
import { Check, ChevronsUpDown } from "lucide-react";
import { useYear } from "@/context/year-context";
import { Button } from "@/components/ui/button";
import Icon from "@/components/global/icon";
import { useMemo, useState } from "react"
import { cn } from "@/lib/utils";

const CustomTooltip = ({ active, payload }: TooltipProps<any, any>) => {
    if (active && payload && payload.length) {
        const { Producto, sumaM3 } = payload[0].payload;

        const isPositive = sumaM3 > 0;
        const tipo = isPositive ? "Sobrante" : "Faltante";
        const formattedSumaM3 = formatNumber(Math.abs(sumaM3));

        return (
            <div className="p-4 bg-white dark:bg-black border">
                <div className="flex flex-col gap-1">
                    <div className="flex">
                        <div style={{ color: getColorClass(Producto) }}>
                            <span className="font-extrabold uppercase">
                                {Producto ? Producto === "TotalA20" ? "Total a 20°" : "Total al Natural" : "Producto"}
                            </span>
                        </div>
                    </div>

                    <div style={{ color: getColorClass(Producto) }}>
                        <span className="font-extrabold uppercase">{tipo}</span>
                    </div>

                    <div style={{ color: getColorClass(Producto) }}>
                        <span className="font-extrabold uppercase">Total M³: </span>
                        <span
                            className={`font-extrabold ${isPositive ? "text-green-500" : "text-red-500"}`}
                        >
                            {formattedSumaM3} M³
                        </span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

const MetricasGeneralPage = () => {
    const capitalizedMonth = getCurrentMonthCapitalized();
    const { selectedYear } = useYear();
    const [mes, setMes] = useState<string>(capitalizedMonth);

    const {
        clienteSeleccionado,
        descripcionSeleccionada,
        filterMaxMin,
        openCliente,
        openDescripcion,
        searchCliente,
        searchDescripcion,
        searchMunicipio,
        setClienteSeleccionado,
        setDescripcionSeleccionada,
        setOpenCliente,
        setOpenDescripcion,
        setSearchCliente,
        setSearchDescripcion,
        setSearchMunicipio,
        setFilterMaxMin
    } = useFiltrosFaltantes()

    const { viajes, isLoading } = useFaltantesViajes(
        mes,
        selectedYear || 0,
        clienteSeleccionado,
        descripcionSeleccionada,
        searchMunicipio
    );

    const datosAgrupados = groupByClienteDescripcion(viajes);

    const { clientes, descripciones, datosFiltrados } = useFiltrarFaltantes(
        datosAgrupados,
        clienteSeleccionado,
        descripcionSeleccionada,
        searchCliente,
        searchDescripcion,
        filterMaxMin
    );

    const clientesMemo = useMemo(() => datosFiltrados, [datosFiltrados]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon iconName="clarity:bar-chart-solid" className="h-12 w-12 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Metricas generales</h1>
                        <p className="text-muted-foreground">
                            Metricas graficadas con la suma de M³ totalizadas al Natural y a 20°
                        </p>
                    </div>
                </div>
            </div>

            <Separator className="my-4" />

            <Card>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-11 gap-4">
                        <Popover open={openCliente} onOpenChange={setOpenCliente}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openCliente}
                                    className="justify-between col-span-3"
                                >
                                    {clienteSeleccionado || "Selecciona un cliente..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Buscar cliente..."
                                        value={searchCliente}
                                        onValueChange={setSearchCliente}
                                    />
                                    <CommandList>
                                        <CommandEmpty>No se encontró cliente.</CommandEmpty>
                                        {clientes.map((cliente) => (
                                            <CommandItem
                                                key={cliente}
                                                onSelect={() => {
                                                    setClienteSeleccionado(clienteSeleccionado === cliente ? "" : cliente);
                                                    setOpenCliente(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        clienteSeleccionado === cliente ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {cliente}
                                            </CommandItem>
                                        ))}
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>

                        <Popover open={openDescripcion} onOpenChange={setOpenDescripcion}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openDescripcion}
                                    className="justify-between col-span-3"
                                >
                                    {descripcionSeleccionada || "Selecciona una ruta..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Buscar ruta..."
                                        value={searchDescripcion}
                                        onValueChange={setSearchDescripcion}
                                    />
                                    <CommandList>
                                        <CommandEmpty>No se encontró la ruta.</CommandEmpty>
                                        {descripciones.map((descripcion) => (
                                            <CommandItem
                                                key={descripcion}
                                                onSelect={(selectedDescripcion) => {
                                                    setDescripcionSeleccionada(descripcionSeleccionada === descripcion ? "" : descripcion);
                                                    setOpenDescripcion(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        descripcionSeleccionada === descripcion ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {descripcion}
                                            </CommandItem>
                                        ))}
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>

                        <Select
                            value={searchMunicipio}
                            onValueChange={(value) => setSearchMunicipio(value)}
                        >
                            <SelectTrigger className="col-span-3 w-full">
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

                        <SelectMes value={mes} onChange={(e: string) => setMes(e)} className="w-full" />

                        <Button
                            onClick={() => {
                                setSearchMunicipio("")
                                setSearchCliente("")
                                setSearchDescripcion("")
                                setClienteSeleccionado("")
                                setDescripcionSeleccionada("")
                                setMes(capitalizedMonth)
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
                {clientesMemo.map((cliente) => {
                    const clienteColor = getClientTextColor(cliente.Cliente);
                    const clienteBorder = getClientBorderColor(cliente.Cliente);

                    return (
                        <div key={cliente.Cliente}>
                            <h2 className={`mb-2 text-4xl font-extrabold ${clienteColor}`}>
                                {cliente.Cliente}
                            </h2>

                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 mt-[25px] pb-[25px] gap-4">
                                {cliente.Descripciones.map((descripcion) => {
                                    const chartData = [
                                        { Producto: "TotalA20", sumaM3: descripcion.TotalA20 },
                                        { Producto: "TotalNatural", sumaM3: descripcion.TotalNatural },
                                    ];

                                    return (
                                        <Card
                                            key={descripcion.DescripcionDelViaje}
                                            className={`mb-4 border-4 ${clienteBorder}`}
                                        >
                                            <CardHeader>
                                                <CardTitle>{descripcion.DescripcionDelViaje} - {cliente.Cliente}</CardTitle>
                                                <CardDescription>
                                                    Datos de suma M3 por producto para{" "}
                                                    {descripcion.DescripcionDelViaje}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <BarChart data={chartData} margin={{ top: 20 }} width={400} height={300}>
                                                    <XAxis dataKey="Producto" tickLine tickMargin={10} axisLine />
                                                    <YAxis tickFormatter={(value: any) => `${value} M³`} />
                                                    <Tooltip content={<CustomTooltip />} />
                                                    <CartesianGrid />
                                                    <Bar dataKey="sumaM3" radius={8}>
                                                        {chartData.map((entry, index) => (
                                                            <Cell
                                                                key={index}
                                                                fill={entry.sumaM3 >= 0 ? "#35A408" : "#FF0000"}
                                                            />
                                                        ))}
                                                        <LabelList
                                                            position="centerTop"
                                                            offset={12}
                                                            className="fill-foreground font-extrabold"
                                                            fontSize={12}
                                                            formatter={(value: number) => `${value.toFixed(2)} m³`}
                                                        />
                                                    </Bar>
                                                </BarChart>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default MetricasGeneralPage