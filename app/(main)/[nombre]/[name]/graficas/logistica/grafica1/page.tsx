"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import DescripcionesCard from '@/modules/logistica/graficas/components/logistica/cards/destinos-card'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, Tooltip, XAxis, YAxis } from 'recharts'
import ProductosCard from '@/modules/logistica/graficas/components/logistica/cards/productos-card'
import ClientesCard from '@/modules/logistica/graficas/components/logistica/cards/cliente-card'
import { fetchReporteDataGrafica1 } from '@/modules/logistica/graficas/actions/grafica1/read'
import { Data2Item, ReporteData } from '@/modules/logistica/graficas/types/grafica1'
import { colorMapping } from '@/modules/logistica/graficas/constants/colors'
import { getCurrentMonthCapitalized } from '@/functions/monts-functions'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'
import { formatNumber } from '@/utils/format-number'
import React, { useEffect, useState } from 'react'
import { useYear } from '@/context/year-context'

const chartConfig = {
    totalM3: {
        label: "Total M3",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

const Graficas1Page = () => {
    const capitalizedMonthName = getCurrentMonthCapitalized()
    const currentYear = new Date().getFullYear()
    const { selectedYear } = useYear()

    const [mes, setMes] = useState<string>(capitalizedMonthName);
    const [reporteData, setReporteData] = useState<{
        data: ReporteData[];
        data1: Data2Item[];
        clientes: string[];
        productos: string[];
        descripciones: string[];
    }>({
        data: [],
        data1: [],
        clientes: [],
        productos: [],
        descripciones: [],
    });

    const [selectedClientes, setSelectedClientes] = useState<string[]>([]);
    const [selectedProductos, setSelectedProductos] = useState<string[]>([]);
    const [selectedDescripciones, setSelectedDescripciones] = useState<string[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const { response, response1 } = await fetchReporteDataGrafica1(
                    mes,
                    selectedClientes,
                    selectedProductos,
                    selectedDescripciones,
                    selectedYear,
                    capitalizedMonthName,
                    currentYear
                );

                const mappedData: ReporteData[] = response.m3PorDescripcionYProducto.map((item) => ({
                    descripcionDelViaje: item.descripcionDelViaje,
                    producto: item.producto,
                    totalM3: Number(item.totalM3),
                }));

                setReporteData((prevState) => ({
                    data: mappedData,
                    data1: response1.data,
                    clientes: Array.from(new Set([...prevState.clientes, ...response.clientesFiltrados])),
                    productos: Array.from(new Set([...prevState.productos, ...response.productosFiltrados])),
                    descripciones: Array.from(new Set([...prevState.descripciones, ...response.descripcionesFiltradas])),
                }));
            } catch (error) {
                console.error("Error fetching report data:", error);
            }
        }

        fetchData();
    }, [mes, selectedClientes, selectedProductos, selectedDescripciones, selectedYear]);

    const handleClienteChange = (clientes: string[]) => {
        setSelectedClientes((prevSelected) => {
            const newSelected = [...prevSelected];
            clientes.forEach((cliente) => {
                if (newSelected.includes(cliente)) {
                    newSelected.splice(newSelected.indexOf(cliente), 1);
                } else {
                    newSelected.push(cliente);
                }
            });
            return newSelected;
        });
    };

    const handleProductoChange = (producto: string) => {
        setSelectedProductos((prevSelected) =>
            prevSelected.includes(producto)
                ? prevSelected.filter((item) => item !== producto)
                : [...prevSelected, producto]
        );
    };

    const handleDescripcionChange = (descripcion: string) => {
        setSelectedDescripciones((prevSelected) =>
            prevSelected.includes(descripcion)
                ? prevSelected.filter((item) => item !== descripcion)
                : [...prevSelected, descripcion]
        );
    };

    const barCharData = reporteData.data.map((dt) => ({
        descripcionDelViaje: dt.descripcionDelViaje,
        totalM3: dt.totalM3,
        producto: dt.producto,
    }))

    const pieChartData = reporteData.data1.map((dt) => ({
        descripcionDelViaje: dt.DescripcionDelViaje,
        sumaM3: dt.sumaM3,
        producto: dt.Producto,
        fill: colorMapping[dt.Producto] || "#000",
    }));

    return (
        <div>
            <div className="m-3 grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-4 h-fit">
                <ClientesCard
                    mes={mes}
                    setMes={setMes}
                    clientes={reporteData.clientes}
                    selectedClientes={selectedClientes}
                    handleClienteChange={handleClienteChange}
                    capitalizedMonthName={capitalizedMonthName}
                />

                <ProductosCard
                    mes={mes}
                    setMes={setMes}
                    productos={reporteData.productos}
                    selectedProductos={selectedProductos}
                    handleProductosChange={handleProductoChange}
                    capitalizedMonthName={capitalizedMonthName}
                />

                <DescripcionesCard
                    mes={mes}
                    setMes={setMes}
                    descripciones={reporteData.descripciones}
                    selectedDescripciones={selectedDescripciones}
                    handleDescripcionesChange={handleDescripcionChange}
                    capitalizedMonthName={capitalizedMonthName}
                />
            </div>

            <div className="grid 2xl:grid-cols-3 gap-4">
                <Card className="2xl:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-4xl">Envios x Estacion</CardTitle>
                        <CardDescription className="text-xl">Datos de envíos por estación</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {barCharData.length > 0 ? (
                            <ChartContainer config={chartConfig}>
                                <BarChart width={600} height={300} data={barCharData}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="descripcionDelViaje"
                                        tickLine={true}
                                        tickMargin={10}
                                        axisLine={true}
                                        tickFormatter={(value) => value}
                                    />
                                    <YAxis />
                                    <Tooltip
                                        cursor={true}
                                        content={({ payload }) => {
                                            if (payload && payload.length) {
                                                const { descripcionDelViaje, totalM3, producto } = payload[0].payload;
                                                return (
                                                    <div 
                                                    style={{ padding: "10px" }}
                                                    className='bg-white text-black dark:bg-black dark:text-white text-sm'
                                                    >
                                                        <strong style={{ color: colorMapping[producto] || "#000" }}>Destino: {descripcionDelViaje}</strong><br />
                                                        <span style={{ color: colorMapping[producto] || "#000" }} className=''>
                                                            {producto}: {formatNumber(totalM3)} M³
                                                        </span><br />
                                                        <strong style={{ color: colorMapping[producto] || "#000" }}>Total M3: {formatNumber(totalM3)} M³</strong>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar dataKey="totalM3">
                                        {barCharData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={colorMapping[entry.producto] || "#000"} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        ) : (
                            <div className="flex items-center justify-center w-full">
                                {/** <Lottie animationData={ChartAnimation} loop autoplay className="w-1/2" /> */}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex-col items-center gap-2 text-sm w-full">
                        <div className="flex flex-wrap gap-2 font-medium leading-none w-full">
                            {reporteData.productos.map((c) => (
                                <div key={c} className="flex items-center mr-1">
                                    <div
                                        className="w-4 h-4 mr-1"
                                        style={{ backgroundColor: colorMapping[c] || "#000" }}
                                    />
                                    {c}
                                </div>
                            ))}
                        </div>
                        <div className="leading-none text-muted-foreground">
                            Mostrando los datos del mes {mes}
                        </div>
                    </CardFooter>
                </Card>

                <Card className="flex flex-col justify-between">
                    <CardHeader>
                        <CardTitle className="text-4xl">Envios x Cliente</CardTitle>
                        <CardDescription className="text-xl">Datos de envíos por cliente</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {pieChartData.length > 0 ? (
                            <ChartContainer config={chartConfig}>
                                <PieChart width={600} height={300}>
                                    <Tooltip
                                        content={({ payload }) => {
                                            if (payload && payload.length) {
                                                const { descripcionDelViaje, sumaM3, producto } = payload[0].payload;
                                                return (
                                                    <div style={{ padding: "10px", backgroundColor: "#000", color: "#FFF" }}>
                                                        <strong>{descripcionDelViaje}</strong><br />
                                                        <span style={{ color: colorMapping[producto] || "#000" }}>
                                                            {producto}: {formatNumber(sumaM3)} M3
                                                        </span><br />
                                                        <strong>Total M3: {formatNumber(sumaM3)}</strong>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Pie
                                        data={pieChartData}
                                        dataKey="sumaM3"
                                        label={({ payload, ...props }) => {
                                            return (
                                                <text
                                                    cx={props.cx}
                                                    cy={props.cy}
                                                    x={props.x}
                                                    y={props.y}
                                                    textAnchor={props.textAnchor}
                                                    dominantBaseline={props.dominantBaseline}
                                                    fill={payload.fill}
                                                    className="text-sm text-center"
                                                >
                                                    {formatNumber(payload.sumaM3)}
                                                </text>
                                            )
                                        }}
                                        nameKey="descripcionDelViaje"
                                    >
                                        {pieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                        ) : (
                            <div className="flex items-center justify-center w-full">
                                {/** <Lottie animationData={ChartAnimation} loop autoplay className="w-full" /> */}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex-col items-center gap-2 text-sm w-full">
                        <div className="flex flex-wrap gap-2 items-center 
                        justify-center font-medium leading-none w-full mb-4">
                            {reporteData.clientes.map((c, index) => (
                                <div key={c} className="flex items-center mr-1">
                                    <div
                                        className="w-4 h-4 mr-1"
                                        style={{ backgroundColor: colorMapping[index] || "#000" }}
                                    />
                                    {c}
                                </div>
                            ))}
                        </div>
                        <div className="leading-none text-muted-foreground">
                            Mostrando los datos del mes {mes}
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default Graficas1Page