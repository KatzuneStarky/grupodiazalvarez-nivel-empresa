"use client"

import DescripcionesCard from '@/modules/logistica/graficas/components/logistica/cards/destinos-card'
import ProductosCard from '@/modules/logistica/graficas/components/logistica/cards/productos-card'
import ClientesCard from '@/modules/logistica/graficas/components/logistica/cards/cliente-card'
import { fetchReporteDataGrafica1 } from '@/modules/logistica/graficas/actions/grafica1/read'
import { Data2Item, ReporteData } from '@/modules/logistica/graficas/types/grafica1'
import { getCurrentMonthCapitalized } from '@/functions/monts-functions'
import { ChartConfig } from '@/components/ui/chart'
import { useYear } from '@/context/year-context'
import React, { useEffect, useState } from 'react'

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
        </div>
    )
}

export default Graficas1Page