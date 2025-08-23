"use client"

import { obtenerFletesPorMesDescripcionDelViajeYEquipo, obtenerFletesPorMesEquipoYDescripcionDelViaje } from "@/modules/logistica/graficas/actions/fletes/read";
import DescripcionesCard from "@/modules/logistica/graficas/components/logistica/cards/destinos-card";
import EquiposCard from "@/modules/logistica/graficas/components/logistica/cards/equipos-card";
import { Flete, FleteAgrupado } from "@/modules/logistica/graficas/types/fletes";
import { getCurrentMonthCapitalized } from "@/functions/monts-functions";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useYear } from "@/context/year-context";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, Cell, Tooltip, XAxis, YAxis } from "recharts";
import { formatNumber } from "@/utils/format-number";
import { fletesColors } from "@/modules/logistica/graficas/constants/colores-fletes";

const chartConfig = {
    sumaM3: {
        label: "Suma M3",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

const chartConfig2 = {
    sumaM3: {
        label: "Suma M3",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

const GraficaFletesPage = () => {
    const capitalizedMonthName = getCurrentMonthCapitalized();
    const currentYear = new Date().getFullYear();
    const { selectedYear } = useYear()

    const [mes, setMes] = useState<string>(capitalizedMonthName);
    const [dataFletes, setDataFletes] = useState<{
        fletes: Flete[]
        fletesAgrupados: FleteAgrupado[]
        equipos: string[]
        descripciones: string[]
    }>({
        fletes: [],
        fletesAgrupados: [],
        equipos: [],
        descripciones: []
    })
    const [selectedDescripciones, setSelectedDescripciones] = useState<string[]>([]);
    const [selectedEquipos, setSelectedEquipos] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {                
                const fletesData = await obtenerFletesPorMesDescripcionDelViajeYEquipo(
                    mes || capitalizedMonthName,
                    selectedDescripciones,
                    selectedEquipos,
                    selectedYear || currentYear
                )                

                const fletesAgrupadosData = await obtenerFletesPorMesEquipoYDescripcionDelViaje(
                    mes || capitalizedMonthName,
                    selectedDescripciones,
                    selectedEquipos,
                    selectedYear || currentYear
                );


                const { data, descripcionesFiltradas, equiposFiltrados } = fletesData
                const { data: fletesAData } = fletesAgrupadosData

                setDataFletes((prev) => ({
                    descripciones: Array.from(new Set([...prev.descripciones, ...descripcionesFiltradas])),
                    equipos: Array.from(new Set([...prev.equipos, ...equiposFiltrados])),
                    fletes: data,
                    fletesAgrupados: fletesAData
                }))
            } catch (error) {
                console.error("Error al obtener los fletes:", error);
            }
        };

        fetchData();
    }, [mes, selectedDescripciones, selectedEquipos, selectedYear]);

    const handleEquipoChange = (equipo: string) => {
        setSelectedEquipos((prevSelected) =>
            prevSelected.includes(equipo)
                ? prevSelected.filter((item) => item !== equipo)
                : [...prevSelected, equipo]
        );
    };

    const handleDescripcionChange = (descripcion: string) => {
        setSelectedDescripciones((prevSelected) =>
            prevSelected.includes(descripcion)
                ? prevSelected.filter((item) => item !== descripcion)
                : [...prevSelected, descripcion]
        );
    };

    const chartData = dataFletes.fletes.map((flete) => ({
        Equipo: flete.Equipo,
        TotalFlete: flete.TotalFlete,
        DescripcionDelViaje: flete.DescripcionDelViaje,
    }));

    const chartData2 = dataFletes.fletesAgrupados.map((flete) => ({
        DescripcionDelViaje: flete.DescripcionDelViaje,
        TotalFlete: flete.TotalFlete,
        Equipos: flete.Equipos,
    }));

    return (
        <div>
            <div className="m-3 grid lg:grid-cols-2 grid-cols-1 gap-4 h-fit">
                <EquiposCard
                    mes={mes}
                    setMes={setMes}
                    equipos={dataFletes.equipos}
                    selectedEquipos={selectedEquipos}
                    handleEquiposChange={handleEquipoChange}
                    capitalizedMonthName={capitalizedMonthName}
                    monthSelect
                />

                <DescripcionesCard
                    mes={mes}
                    setMes={setMes}
                    descripciones={dataFletes.descripciones}
                    selectedDescripciones={selectedDescripciones}
                    handleDescripcionesChange={handleDescripcionChange}
                    capitalizedMonthName={capitalizedMonthName}
                />
            </div>

            <div className='grid 2xl:grid-cols-2 gap-4 mb-8'>
                <Card>
                    <CardHeader>
                        <CardTitle>Fletes X Equipos</CardTitle>
                        <CardDescription>Datos de Fletes por Equipo</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {chartData.length > 0 ? (
                            <ChartContainer config={chartConfig}>
                                <BarChart width={600} height={300} data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="Equipo" />
                                    <YAxis />
                                    <Tooltip
                                        cursor={true}
                                        content={({ payload }) => {
                                            if (payload && payload.length) {
                                                const {
                                                    Equipo,
                                                    TotalFlete,
                                                    DescripcionDelViaje
                                                } = payload[0].payload;
                                                return (
                                                    <div className="p-4 bg-white border text-black">
                                                        <div className="flex">
                                                            <div>
                                                                <span className="font-extrabold uppercase">
                                                                    Equipo:{" "}
                                                                </span>
                                                                <span>
                                                                    {Equipo}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex mt-1">
                                                            <div>
                                                                <span className="font-extrabold uppercase">
                                                                    Total generado:{" "}
                                                                </span>
                                                                <span>
                                                                    ${formatNumber(Number(TotalFlete))}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar dataKey="TotalFlete">
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={fletesColors[index % fletesColors.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        ) : (
                            <div className="flex items-center justify-center w-full">
                                {/** <Lottie animationData={ChartAnimation} loop className="w-1/2" /> */}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Fletes X Estacion</CardTitle>
                        <CardDescription>Datos de Fletes por Descripcion del Viaje</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {chartData2.length > 0 ? (
                            <ChartContainer config={chartConfig2}>
                                <BarChart width={600} height={300} data={chartData2}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="DescripcionDelViaje" />
                                    <YAxis />
                                    <Tooltip
                                        cursor={true}
                                        content={({ payload }) => {
                                            if (payload && payload.length) {
                                                const {
                                                    Equipo,
                                                    TotalFlete,
                                                    DescripcionDelViaje
                                                } = payload[0].payload;
                                                const equiposString
                                                    = Array.isArray(Equipo)
                                                        ? Equipo.join(", ")
                                                        : Equipo;

                                                return (
                                                    <div className="p-4 bg-white border text-black">
                                                        <div className="flex">
                                                            <div>
                                                                <span className="font-extrabold uppercase">
                                                                    Destino:{" "}
                                                                </span>
                                                                <span>
                                                                    {DescripcionDelViaje}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex mt-1">
                                                            <div>
                                                                <span className="font-extrabold uppercase">
                                                                    Total generado:{" "}
                                                                </span>
                                                                <span>
                                                                    ${formatNumber(Number(TotalFlete))}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex mt-1">
                                                            <div>
                                                                <span className="font-extrabold uppercase">
                                                                    Equipos:{" "}
                                                                </span>
                                                                <span className="text-black">
                                                                    {equiposString}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar dataKey="TotalFlete">
                                        {chartData2.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={fletesColors[index % fletesColors.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        ) : (
                            <div className="flex items-center justify-center w-full">
                                {/** <Lottie animationData={ChartAnimation} loop className="w-1/2" /> */}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default GraficaFletesPage