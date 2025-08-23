"use client"

import { obtenerReporte1, obtenerReporte2, obtenerReporte3 } from "@/modules/logistica/graficas/actions/grafica3/read"
import DescripcionesCard from "@/modules/logistica/graficas/components/logistica/cards/destinos-card"
import MunicipiosCard from "@/modules/logistica/graficas/components/logistica/cards/municipios-card"
import ProductosCard from "@/modules/logistica/graficas/components/logistica/cards/productos-card"
import ClientesCard from "@/modules/logistica/graficas/components/logistica/cards/cliente-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Data, Data3, Data4 } from "@/modules/logistica/graficas/types/grafica3"
import { getCurrentMonthCapitalized } from "@/functions/monts-functions"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { useYear } from "@/context/year-context"
import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Cell, Legend, Tooltip, XAxis, YAxis } from "recharts"
import { colorMapping } from "@/modules/logistica/graficas/constants/colors"

const chartConfig = {
        sumaM3: {
            label: "Suma M3",
            color: "hsl(var(--chart-1))",
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

const Grafica3Page = () => {
    const capitalizedMonthName = getCurrentMonthCapitalized()
    const currentYear = new Date().getFullYear()
    const { selectedYear } = useYear()

    const [mes, setMes] = useState<string>(capitalizedMonthName);
    const [grafica3Data, setGrafica3Data] = useState<{
        data1: Data[]
        data2: Data3[]
        data3: Data4[]
        clientes: string[]
        productos: string[]
        descripcion: string[]
        municipios: string[]
    }>({
        data1: [],
        data2: [],
        data3: [],
        clientes: [],
        productos: [],
        descripcion: [],
        municipios: []
    })

    const [selectedDescripciones, setSelectedDescripciones] = useState<string[]>([]);
    const [selectedMunicipios, setSelectedMunicipios] = useState<string[]>([]);
    const [selectedProductos, setSelectedProductos] = useState<string[]>([]);
    const [selectedClientes, setSelectedClientes] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [responseReporte1, responseReporte2, responseReporte3] = await Promise.all([
                    obtenerReporte1(
                        mes || capitalizedMonthName,
                        selectedProductos,
                        selectedClientes,
                        selectedDescripciones,
                        selectedMunicipios,
                        selectedYear || currentYear
                    ),
                    obtenerReporte2(
                        mes || capitalizedMonthName,
                        selectedProductos,
                        selectedClientes,
                        selectedDescripciones,
                        selectedMunicipios,
                        selectedYear || currentYear
                    ),
                    obtenerReporte3(
                        mes || capitalizedMonthName,
                        selectedProductos,
                        selectedClientes,
                        selectedDescripciones,
                        selectedMunicipios,
                        selectedYear || currentYear
                    ),
                ]);

                const { resultado, clientesFiltrados, descripcionesFiltradas, municipiosFiltrados, productosFiltrados } = responseReporte1

                setGrafica3Data((prev) => ({
                    data1: resultado,
                    data2: responseReporte2,
                    data3: responseReporte3,
                    clientes: Array.from(new Set([...prev.clientes, ...clientesFiltrados])),
                    descripcion: Array.from(new Set([...prev.descripcion, ...descripcionesFiltradas])),
                    municipios: Array.from(new Set([...prev.municipios, ...municipiosFiltrados])),
                    productos: Array.from(new Set([...prev.productos, ...productosFiltrados])),
                }))
            } catch (error) {
                console.error('Error al obtener datos:', error);
            }
        };

        fetchData();
    }, [selectedClientes, selectedProductos, selectedDescripciones, selectedMunicipios, mes, selectedYear]);

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
        setSelectedProductos(prevSelected => {
            if (prevSelected.includes(producto)) {
                return prevSelected.filter(item => item !== producto);
            } else {
                return [...prevSelected, producto];
            }
        });
    };

    const handleDescripcionChange = (descripcion: string) => {
        setSelectedDescripciones(prevSelected => {
            if (prevSelected.includes(descripcion)) {
                return prevSelected.filter(item => item !== descripcion);
            } else {
                return [...prevSelected, descripcion];
            }
        });
    };

    const handleMunicipioChange = (municipio: string) => {
        setSelectedMunicipios(prevSelected => {
            if (prevSelected.includes(municipio)) {
                return prevSelected.filter(item => item !== municipio);
            } else {
                return [...prevSelected, municipio];
            }
        });
    };

    const chartData = grafica3Data.data1.map((dt) => ({
        Producto: dt.Producto,
        sumaM3: dt.sumaM3,
        Cliente: dt.Cliente,
        DescripcionDelViaje: dt.DescripcionDelViaje,
        Municipio: dt.Municipio,
    }));

    const chartData2 = grafica3Data.data2.map((dt) => ({
        Producto: dt.Producto,
        FALTANTESYOSOBRANTESA20: dt.FALTANTESYOSOBRANTESA20,
        FALTANTESYOSOBRANTESALNATURAL: dt.FALTANTESYOSOBRANTESALNATURAL,
        conteoViajes: dt.conteoViajes,
        Cliente: dt.Cliente,
        DescripcionDelViaje: dt.DescripcionDelViaje,
        Municipio: dt.Municipio,
        sumaM3: dt.sumaM3,
    }));

    const chartData3 = grafica3Data.data3.map((dt) => ({
        Cliente: dt.Cliente,
        Equipo: dt.Equipo,
        DescripcionDelViaje: dt.DescripcionDelViaje,
        Municipio: dt.Municipio,
        Producto: dt.Producto,
        FALTANTESYOSOBRANTESA20: dt.FALTANTESYOSOBRANTESA20,
    }));

    const getProductColor = (productName: string) => {
        return colorMapping[productName] || '#000000';
    };

    return (
        <div>
            <div className="m-3 grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-4 gap-4 h-fit">
                <ClientesCard
                    mes={mes}
                    setMes={setMes}
                    clientes={grafica3Data.clientes}
                    selectedClientes={selectedClientes}
                    handleClienteChange={handleClienteChange}
                    capitalizedMonthName={capitalizedMonthName}
                />
                <ProductosCard
                    mes={mes}
                    setMes={setMes}
                    productos={grafica3Data.productos}
                    selectedProductos={selectedProductos}
                    handleProductosChange={handleProductoChange}
                    capitalizedMonthName={capitalizedMonthName}
                />
                <DescripcionesCard
                    mes={mes}
                    setMes={setMes}
                    descripciones={grafica3Data.descripcion}
                    selectedDescripciones={selectedDescripciones}
                    handleDescripcionesChange={handleDescripcionChange}
                    capitalizedMonthName={capitalizedMonthName}
                />
                <MunicipiosCard
                    mes={mes}
                    setMes={setMes}
                    municipios={grafica3Data.municipios}
                    selectedMunicipios={selectedMunicipios}
                    handleMunicipiosChange={handleMunicipioChange}
                    capitalizedMonthName={capitalizedMonthName}
                />
            </div>

            <div className='flex flex-col gap-4 w-full'>
                <div className='grid 2xl:grid-cols-2 gap-4'>
                    <Card>
                        <CardHeader>
                            <CardTitle>M3 X Estaciones</CardTitle>
                            <CardDescription>Datos de M3 por Producto</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig}>
                                <BarChart width={600} height={300} data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="Producto" />
                                    <YAxis />
                                    <Tooltip
                                        cursor={true}
                                        content={({ payload }) => {
                                            if (payload && payload.length) {
                                                const {
                                                    Producto,
                                                    sumaM3,
                                                    Cliente,
                                                    DescripcionDelViaje,
                                                    Municipio
                                                } = payload[0].payload;
                                                return (
                                                    <div className="p-4 bg-white border">
                                                        <div className='flex'>
                                                            <div
                                                                className="w-4 h-4 mr-1"
                                                                style={{ background: colorMapping[Producto] || "#000" }}
                                                            />
                                                            <div style={{ color: colorMapping[Producto] || "#000" }}>
                                                                <span className="font-extrabold uppercase">
                                                                    Destino:{" "}
                                                                </span>
                                                                <span>
                                                                    {DescripcionDelViaje} M³
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex mt-1">
                                                            <div
                                                                className="w-4 h-4 mr-1"
                                                                style={{ background: colorMapping[Producto] || "#000" }}
                                                            />
                                                            <div style={{ color: colorMapping[Producto] || "#000" }}>
                                                                <span className="font-extrabold uppercase">
                                                                    Producto:{" "}
                                                                </span>
                                                                <span>
                                                                    {Producto}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className='flex mt-1'>
                                                            <div
                                                                className="w-4 h-4 mr-1"
                                                                style={{ background: colorMapping[Producto] || "#000" }}
                                                            />
                                                            <div style={{ color: colorMapping[Producto] || "#000" }}>
                                                                <span className="font-extrabold uppercase">
                                                                    Total M³:{" "}
                                                                </span>
                                                                <span>
                                                                    {sumaM3} M³
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className='flex mt-1'>
                                                            <div
                                                                className="w-4 h-4 mr-1"
                                                                style={{ background: colorMapping[Producto] || "#000" }}
                                                            />
                                                            <div style={{ color: colorMapping[Producto] || "#000" }}>
                                                                <span className="font-extrabold uppercase">
                                                                    Cliente:{" "}
                                                                </span>
                                                                <span>
                                                                    {Cliente}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className='flex mt-1'>
                                                            <div
                                                                className="w-4 h-4 mr-1"
                                                                style={{ background: colorMapping[Producto] || "#000" }}
                                                            />
                                                            <div style={{ color: colorMapping[Producto] || "#000" }}>
                                                                <span className="font-extrabold uppercase">
                                                                    Municipio:{" "}
                                                                </span>
                                                                <span>
                                                                    {Municipio}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Legend />
                                    <Bar dataKey="sumaM3">
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={getProductColor(entry.Producto)} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Entregas x Estacion</CardTitle>
                            <CardDescription>Datos de entregas por Producto</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig2}>
                                <BarChart width={600} height={300} data={chartData2}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="Producto" />
                                    <YAxis />
                                    <Tooltip
                                        cursor={true}
                                        content={({ payload }) => {
                                            if (payload && payload.length) {
                                                const {
                                                    Producto,
                                                    sumaM3,
                                                    Cliente,
                                                    DescripcionDelViaje,
                                                    Municipio,
                                                    FALTANTESYOSOBRANTESA20,
                                                    FALTANTESYOSOBRANTESALNATURAL,
                                                    conteoViajes
                                                } = payload[0].payload;
                                                return (
                                                    <div className="p-4 bg-white border">
                                                        <div className='flex'>
                                                            <div
                                                                className="w-4 h-4 mr-1"
                                                                style={{ background: colorMapping[Producto] || "#000" }}
                                                            />
                                                            <div style={{ color: colorMapping[Producto] || "#000" }}>
                                                                <span className="font-extrabold uppercase">
                                                                    Destino:{" "}
                                                                </span>
                                                                <span>
                                                                    {DescripcionDelViaje} M³
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex mt-1">
                                                            <div
                                                                className="w-4 h-4 mr-1"
                                                                style={{ background: colorMapping[Producto] || "#000" }}
                                                            />
                                                            <div style={{ color: colorMapping[Producto] || "#000" }}>
                                                                <span className="font-extrabold uppercase">
                                                                    Producto:{" "}
                                                                </span>
                                                                <span>
                                                                    {Producto}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className='flex mt-1'>
                                                            <div
                                                                className="w-4 h-4 mr-1"
                                                                style={{ background: colorMapping[Producto] || "#000" }}
                                                            />
                                                            <div style={{ color: colorMapping[Producto] || "#000" }}>
                                                                <span className="font-extrabold uppercase">
                                                                    Total M³:{" "}
                                                                </span>
                                                                <span>
                                                                    {sumaM3} M³
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className='flex mt-1'>
                                                            <div
                                                                className="w-4 h-4 mr-1"
                                                                style={{ background: colorMapping[Producto] || "#000" }}
                                                            />
                                                            <div style={{ color: colorMapping[Producto] || "#000" }}>
                                                                <span className="font-extrabold uppercase">
                                                                    Cliente:{" "}
                                                                </span>
                                                                <span>
                                                                    {Cliente}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className='flex mt-1'>
                                                            <div
                                                                className="w-4 h-4 mr-1"
                                                                style={{ background: colorMapping[Producto] || "#000" }}
                                                            />
                                                            <div style={{ color: colorMapping[Producto] || "#000" }}>
                                                                <span className="font-extrabold uppercase">
                                                                    Municipio:{" "}
                                                                </span>
                                                                <span>
                                                                    {Municipio}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className='flex gap-4'>
                                                            <div className='flex mt-1'>
                                                                <div
                                                                    className="w-4 h-4 mr-1"
                                                                    style={{ background: colorMapping[Producto] || "#000" }}
                                                                />
                                                                <div style={{ color: colorMapping[Producto] || "#000" }}>
                                                                    <p>
                                                                        <span className="font-extrabold">
                                                                            <span>
                                                                                {FALTANTESYOSOBRANTESA20 < 0 && "Faltante: "}
                                                                                {FALTANTESYOSOBRANTESA20 > 0 && "Sobrante: "}
                                                                                {FALTANTESYOSOBRANTESA20 === 0 && "20°: "}
                                                                            </span>
                                                                        </span>
                                                                        {FALTANTESYOSOBRANTESA20.toFixed(3)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <span> --- </span>
                                                            <div className='flex mt-1'>
                                                                <div
                                                                    className="w-4 h-4 mr-1"
                                                                    style={{ background: colorMapping[Producto] || "#000" }}
                                                                />
                                                                <div style={{ color: colorMapping[Producto] || "#000" }}>
                                                                    <p>
                                                                        <span className="font-extrabold">
                                                                            <span>
                                                                                {FALTANTESYOSOBRANTESALNATURAL < 0 && "Faltante: "}
                                                                                {FALTANTESYOSOBRANTESALNATURAL > 0 && "Sobrante: "}
                                                                                {FALTANTESYOSOBRANTESALNATURAL === 0 && "Natural: "}
                                                                            </span>
                                                                        </span>
                                                                        {FALTANTESYOSOBRANTESALNATURAL.toFixed(3)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className='flex mt-1'>
                                                            <div
                                                                className="w-4 h-4 mr-1"
                                                                style={{ background: colorMapping[Producto] || "#000" }}
                                                            />
                                                            <div style={{ color: colorMapping[Producto] || "#000" }}>
                                                                <span className="font-extrabold uppercase">
                                                                    Viajes:{" "}
                                                                </span>
                                                                <span>
                                                                    {conteoViajes}
                                                                </span>
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
                                    <Bar dataKey="FALTANTESYOSOBRANTESALNATURAL" fill="oklch(68.5% 0.169 237.323)" radius={4} />
                                    <Bar dataKey="conteoViajes" fill="oklch(69.6% 0.17 162.48)" radius={4} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Faltantes x Estacion x Viaje</CardTitle>
                        <CardDescription>Datos de faltantes por Producto</CardDescription>
                    </CardHeader>
                    <CardContent>
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
                                                Producto,
                                                Cliente,
                                                DescripcionDelViaje,
                                                Municipio,
                                                FALTANTESYOSOBRANTESA20,
                                                Equipo
                                            } = payload[0].payload;
                                            return (
                                                <div className="p-4 bg-white border">
                                                    <div className='flex'>
                                                        <div
                                                            className="w-4 h-4 mr-1"
                                                            style={{ background: colorMapping[Producto] || "#000" }}
                                                        />
                                                        <div style={{ color: colorMapping[Producto] || "#000" }}>
                                                            <span className="font-extrabold uppercase">
                                                                Destino:{" "}
                                                            </span>
                                                            <span>
                                                                {DescripcionDelViaje} M³
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex mt-1">
                                                        <div
                                                            className="w-4 h-4 mr-1"
                                                            style={{ background: colorMapping[Producto] || "#000" }}
                                                        />
                                                        <div style={{ color: colorMapping[Producto] || "#000" }}>
                                                            <span className="font-extrabold uppercase">
                                                                Producto:{" "}
                                                            </span>
                                                            <span>
                                                                {Producto}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className='flex mt-1'>
                                                        <div
                                                            className="w-4 h-4 mr-1"
                                                            style={{ background: colorMapping[Producto] || "#000" }}
                                                        />
                                                        <div style={{ color: colorMapping[Producto] || "#000" }}>
                                                            <span className="font-extrabold uppercase">
                                                                Cliente:{" "}
                                                            </span>
                                                            <span>
                                                                {Cliente}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className='flex mt-1'>
                                                        <div
                                                            className="w-4 h-4 mr-1"
                                                            style={{ background: colorMapping[Producto] || "#000" }}
                                                        />
                                                        <div style={{ color: colorMapping[Producto] || "#000" }}>
                                                            <span className="font-extrabold uppercase">
                                                                Municipio:{" "}
                                                            </span>
                                                            <span>
                                                                {Municipio}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex mt-1">
                                                        <div
                                                            className="w-4 h-4 mr-1"
                                                            style={{ background: colorMapping[Producto] || "#000" }}
                                                        />
                                                        <div style={{ color: colorMapping[Producto] || "#000" }}>
                                                            <span className="font-extrabold uppercase">
                                                                Equipo:{" "}
                                                            </span>
                                                            <span>
                                                                {Equipo}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className='flex mt-1'>
                                                        <div
                                                            className="w-4 h-4 mr-1"
                                                            style={{ background: colorMapping[Producto] || "#000" }}
                                                        />
                                                        <div style={{ color: colorMapping[Producto] || "#000" }}>
                                                            <p>
                                                                <span className="font-extrabold">
                                                                    <span>
                                                                        {FALTANTESYOSOBRANTESA20 < 0 && "Faltante: "}
                                                                        {FALTANTESYOSOBRANTESA20 > 0 && "Sobrante: "}
                                                                        {FALTANTESYOSOBRANTESA20 === 0 && "20°: "}
                                                                    </span>
                                                                </span>
                                                                {Number(FALTANTESYOSOBRANTESA20).toFixed(3)}
                                                            </p>
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
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Grafica3Page