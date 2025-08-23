"use client"

import { obtenerRepeticionesEquipos, obtenerRepeticionesEquiposGrafica2, obtenerRepeticionesEquiposGrafica3 } from "@/modules/logistica/graficas/actions/grafica2/read"
import { RepeticionesEquipo, RepeticionesEquipoGrafica2, RepeticionesEquipoGrafica3, ResultadoConDatos } from "@/modules/logistica/graficas/types/grafica2"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ProductosCard from "@/modules/logistica/graficas/components/logistica/cards/productos-card"
import EquiposCard from "@/modules/logistica/graficas/components/logistica/cards/equipos-card"
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts"
import { colorMapping } from "@/modules/logistica/graficas/constants/colors"
import { getCurrentMonthCapitalized } from "@/functions/monts-functions"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { useYear } from "@/context/year-context"
import { useEffect, useState } from "react"

const chartConfig = {
    sumaM3: {
        label: "Suma M3",
        color: "hsl(var(--chart-1))",
    },
    conteoViajes: {
        label: "Total Viajes",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

const chartConfig2 = {
    FALTANTESYOSOBRANTESA20: {
        label: "FALTANTESYOSOBRANTESA20",
        color: "hsl(var(--chart-1))",
    },
    FALTANTESYOSOBRANTESALNATURAL: {
        label: "FALTANTESYOSOBRANTESALNATURAL",
        color: "hsl(var(--chart-2))",
    },
    conteoViajes: {
        label: "Total Viajes",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig;

const chartConfig3 = {
    FALTANTESYOSOBRANTESA20: {
        label: "FALTANTESYOSOBRANTESA20",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

const Grafica2Page = () => {
    const capitalizedMonthName = getCurrentMonthCapitalized()
    const currentYear = new Date().getFullYear()
    const { selectedYear } = useYear()

    const [mes, setMes] = useState<string>(capitalizedMonthName);
    const [reporteData, setReporteData] = useState<{
        data: RepeticionesEquipo[];
        data2: RepeticionesEquipoGrafica2[];
        data3: RepeticionesEquipoGrafica3[];
        productos: string[];
        equipos: string[];
    }>({
        data: [],
        data2: [],
        data3: [],
        productos: [],
        equipos: [],
    });

    const [selectedProductos, setSelectedProductos] = useState<string[]>([]);
    const [selectedEquipos, setSelectedEquipos] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [response, responseData, grafica3] = await Promise.all([
                    obtenerRepeticionesEquipos(
                        mes || capitalizedMonthName,
                        selectedEquipos,
                        selectedProductos,
                        selectedYear || currentYear
                    ),
                    obtenerRepeticionesEquiposGrafica2(
                        mes || capitalizedMonthName,
                        selectedEquipos,
                        selectedProductos,
                        selectedYear || currentYear
                    ),
                    obtenerRepeticionesEquiposGrafica3(
                        mes || capitalizedMonthName,
                        selectedEquipos,
                        selectedProductos,
                        selectedYear || currentYear
                    ),
                ]);

                const { datos, productosFiltrados, equiposFiltrados } = response;

                setReporteData((prev) => ({
                    data: datos,
                    data2: responseData,
                    data3: grafica3,
                    productos: Array.from(new Set([...prev.productos, ...productosFiltrados])),
                    equipos: Array.from(new Set([...prev.equipos, ...equiposFiltrados])),
                }));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [selectedEquipos, selectedProductos, mes, selectedYear, capitalizedMonthName, currentYear]);

    const handleProductoChange = (producto: string) => {
        setSelectedProductos((prevSelected) =>
            prevSelected.includes(producto)
                ? prevSelected.filter((item) => item !== producto)
                : [...prevSelected, producto]
        );
    };

    const handleEquipoChange = (equipo: string) => {
        setSelectedEquipos((prevSelected) =>
            prevSelected.includes(equipo)
                ? prevSelected.filter((item) => item !== equipo)
                : [...prevSelected, equipo]
        );
    };

    const chartData = reporteData.data.map((dt) => ({
        Viajes: dt.Viajes,
        sumaM3: dt.sumaM3,
        conteoViajes: dt.conteoViajes,
    }));

    const chartData2 = reporteData.data2.map((dt) => ({
        Viajes: dt.Viajes,
        DescripcionDelViaje: dt.DescripcionDelViaje,
        FALTANTESYOSOBRANTESA20: dt.FALTANTESYOSOBRANTESA20,
        FALTANTESYOSOBRANTESALNATURAL: dt.FALTANTESYOSOBRANTESALNATURAL,
        conteoViajes: dt.conteoViajes,
        Productos: dt.Productos,
    }));

    const chartData3 = reporteData.data3.map((dt) => ({
        name: dt.DescripcionDelViaje,
        FALTANTESYOSOBRANTESA20: dt.FALTANTESYOSOBRANTESA20
            ? parseFloat(dt.FALTANTESYOSOBRANTESA20)
            : 0,
        Producto: dt.Producto,
    }));

    return (
        <div>
            <div className="m-3 grid lg:grid-cols-2 grid-cols-1 gap-4 h-fit">
                <EquiposCard
                    mes={mes}
                    setMes={setMes}
                    equipos={reporteData.equipos}
                    selectedEquipos={selectedEquipos}
                    handleEquiposChange={handleEquipoChange}
                    capitalizedMonthName={capitalizedMonthName}
                    monthSelect
                />

                <ProductosCard
                    mes={mes}
                    setMes={setMes}
                    productos={reporteData.productos}
                    selectedProductos={selectedProductos}
                    handleProductosChange={handleProductoChange}
                    capitalizedMonthName={capitalizedMonthName}
                />
            </div>

            <div className="m-3 flex flex-col gap-4">
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-4xl">Viajes x Equipo</CardTitle>
                            <CardDescription className="text-xl">
                                Viajes totales y suma de M³
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {chartData.length > 0 ? (
                                <ChartContainer config={chartConfig}>
                                    <BarChart width={600} height={300} data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="Viajes" />
                                        <YAxis />
                                        <Tooltip
                                            cursor={true}
                                            content={({ payload }) => {
                                                if (payload && payload.length) {
                                                    const { sumaM3, conteoViajes, Viajes } = payload[0].payload;
                                                    return (
                                                        <div className="p-4 bg-white border text-black">
                                                            <div className="flex">
                                                                <div className="w-4 h-4 bg-blue-500 mr-1" />
                                                                <p>
                                                                    <span className="font-extrabold">Equipo: </span>
                                                                    {Viajes}
                                                                </p>
                                                            </div>

                                                            <div className="flex mt-1">
                                                                <div className="w-4 h-4 bg-orange-500 mr-1" />
                                                                <p>
                                                                    <span className="font-extrabold">Total M³: </span>
                                                                    {conteoViajes} M³
                                                                </p>
                                                            </div>

                                                            <div className="flex mt-1">
                                                                <div className="w-4 h-4 bg-emerald-500 
                                                            mr-1" />
                                                                <p>
                                                                    <span className="font-extrabold">Viajes totales: </span>
                                                                    {conteoViajes} Viajes
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Legend />
                                        <Bar dataKey="sumaM3" fill={"oklch(70.5% 0.213 47.604)"} radius={4} />
                                        <Bar dataKey="conteoViajes" fill="oklch(69.6% 0.17 162.48)" radius={4} />
                                    </BarChart>
                                </ChartContainer>
                            ) : (
                                <div className="flex items-center justify-center w-full">
                                    {/** <Lottie animationData={ChartAnimation} loop autoplay className="w-1/2" /> */}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex-col items-center gap-4 text-sm w-full">
                            <div className="flex flex-wrap gap-2 font-medium leading-none w-full">
                                {selectedProductos.map((c) => (
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
                                Mostrando datos del mes de {mes}
                            </div>
                        </CardFooter>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-4xl">Faltantes x Estacion</CardTitle>
                            <CardDescription className="text-xl">
                                Faltantes y sobrantes a 20° y al natural
                            </CardDescription>
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
                                                        Productos,
                                                        conteoViajes,
                                                        Viajes,
                                                        DescripcionDelViaje,
                                                        FALTANTESYOSOBRANTESA20,
                                                        FALTANTESYOSOBRANTESALNATURAL
                                                    } = payload[0].payload;
                                                    return (
                                                        <div className="p-4 bg-white border text-black">
                                                            <div className="flex">
                                                                <div className="w-4 h-4 bg-blue-500 mr-1" />
                                                                <p>
                                                                    <span className="font-extrabold">Equipo: </span>
                                                                    {Viajes}
                                                                </p>
                                                            </div>

                                                            <div className="flex mt-1">
                                                                <div className="w-4 h-4 bg-orange-500 
                                                                mr-1" />
                                                                <div>
                                                                    <span className="font-extrabold">Productos: </span>
                                                                    <div className='flex flex-col items-center'>
                                                                        {Productos.map((p: string, index: number) => (
                                                                            <span key={index}>{p}</span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex mt-1">
                                                                <div className="w-4 h-4 bg-emerald-500 mr-1" />
                                                                <p>
                                                                    <span className="font-extrabold">Viajes: </span>
                                                                    {conteoViajes}
                                                                    <span>
                                                                        {conteoViajes > 1 ? ' Viajes' : ' Viaje'}
                                                                    </span>
                                                                </p>
                                                            </div>

                                                            <div className="flex mt-1">
                                                                <div className="w-4 h-4 bg-yellow-500 mr-1" />
                                                                <p>
                                                                    <span className="font-extrabold">Destino: </span>
                                                                    {DescripcionDelViaje}
                                                                </p>
                                                            </div>
                                                            <div className="flex mt-1">
                                                                <div className="w-4 h-4 bg-lime-500 mr-1" />
                                                                <p>
                                                                    <span className="font-extrabold">
                                                                        <span>
                                                                            {FALTANTESYOSOBRANTESA20 < 0 && "Faltante a 20°: "}
                                                                            {FALTANTESYOSOBRANTESA20 > 0 && "Sobrante a 20°: "}
                                                                            {FALTANTESYOSOBRANTESA20 === 0 && "20°: "}
                                                                        </span>
                                                                    </span>
                                                                    {FALTANTESYOSOBRANTESA20.toFixed(3)}
                                                                </p>
                                                            </div>
                                                            <div className="flex mt-1">
                                                                <div className="w-4 h-4 bg-sky-500 mr-1" />
                                                                <p>
                                                                    <span className="font-extrabold">
                                                                        <span>
                                                                            {FALTANTESYOSOBRANTESALNATURAL < 0 && "Faltante al Natural: "}
                                                                            {FALTANTESYOSOBRANTESALNATURAL > 0 && "Sobrante al Natural: "}
                                                                            {FALTANTESYOSOBRANTESALNATURAL === 0 && "Natural: "}
                                                                        </span>
                                                                    </span>
                                                                    {FALTANTESYOSOBRANTESALNATURAL.toFixed(3)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Legend />
                                        <Bar dataKey="FALTANTESYOSOBRANTESA20" fill="oklch(76.8% 0.233 130.85)" radius={4} />
                                        <Bar dataKey="FALTANTESYOSOBRANTESALNATURAL" fill="oklch(68.5% 0.169 237.323)" radius={4} />
                                        <Bar dataKey="conteoViajes" fill="oklch(69.6% 0.17 162.48)" radius={4} />
                                    </BarChart>
                                </ChartContainer>
                            ) : (
                                <div className="flex items-center justify-center w-full">
                                    {/** <Lottie animationData={ChartAnimation} loop autoplay className="w-1/2" /> */}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-4xl">Faltantes x Viaje</CardTitle>
                            <CardDescription className="text-xl">
                                Faltantes y sobrantes a 20° y al natural por viaje
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {chartData3.length > 0 ? (
                                <ChartContainer config={chartConfig3}>
                                    <BarChart width={600} height={300} data={chartData3}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="DescripcionDelViaje" />
                                        <YAxis />
                                        <Tooltip
                                            cursor={true}
                                            content={({ payload }) => {
                                                if (payload && payload.length) {
                                                    const {
                                                        DescripcionDelViaje,
                                                        FALTANTESYOSOBRANTESA20,
                                                        Producto
                                                    } = payload[0].payload;
                                                    return (
                                                        <div className="p-4 bg-white border text-black">
                                                            <div className="flex">
                                                                <div className="w-4 h-4 bg-blue-500 mr-1" />
                                                                <p>
                                                                    <span className="font-extrabold">Destino: </span>
                                                                    {DescripcionDelViaje}
                                                                </p>
                                                            </div>

                                                            <div className="flex mt-1">
                                                                <div className="w-4 h-4 bg-lime-500 mr-1" />
                                                                <p>
                                                                    <span className="font-extrabold">
                                                                        <span>
                                                                            {FALTANTESYOSOBRANTESA20 < 0 && "Faltante a 20°: "}
                                                                            {FALTANTESYOSOBRANTESA20 > 0 && "Sobrante a 20°: "}
                                                                            {FALTANTESYOSOBRANTESA20 === 0 && "20°: "}
                                                                        </span>
                                                                    </span>
                                                                    {Number(FALTANTESYOSOBRANTESA20).toFixed(3)}
                                                                </p>
                                                            </div>

                                                            <div className="flex mt-1">
                                                                <div className="w-4 h-4 bg-orange-500 
                                                                mr-1" />
                                                                <div>
                                                                    <span className="font-extrabold">Productos: </span>
                                                                    {Producto}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Legend />
                                        <Bar dataKey="FALTANTESYOSOBRANTESA20" fill="oklch(76.8% 0.233 130.85)" radius={4} />
                                    </BarChart>
                                </ChartContainer>
                            ) : (
                                <div className="flex items-center justify-center w-full">
                                    {/** <Lottie animationData={ChartAnimation} loop autoplay className="w-1/2" /> */}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Grafica2Page