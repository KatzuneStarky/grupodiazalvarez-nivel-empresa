"use client"

import { useOperadores } from "@/modules/logistica/bdd/operadores/hooks/use-estaciones"
import { useEstaciones } from "@/modules/logistica/estaciones/hooks/use-estaciones"
import { useClientes } from "@/modules/logistica/bdd/clientes/hooks/use-clientes"
import { useEquipos } from "@/modules/logistica/bdd/equipos/hooks/use-equipos"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { useRutas } from "@/modules/logistica/rutas/hooks/use-rutas"
import BddCard from "@/modules/logistica/bdd/components/bdd-card"
import { ChartContainer } from "@/components/ui/chart"
import PageTitle from "@/components/custom/page-title"
import { Separator } from "@/components/ui/separator"
import { Database, DatabaseIcon, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useMemo, useState } from "react"

const CATEGORIES = ["All", "Logistica", "System Config", "Analytics Data"]
const CHART_COLORS = [
    "hsl(220, 90%, 60%)",
    "hsl(200, 85%, 55%)",
    "hsl(260, 70%, 50%)",
    "hsl(40, 90%, 55%)",
]

const BddPage = () => {
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [searchQuery, setSearchQuery] = useState("")

    const { estaciones } = useEstaciones()
    const { operadores } = useOperadores()
    const { clientes } = useClientes()
    const { equipos } = useEquipos()
    const { rutas } = useRutas()



    const allTanks = useMemo(() => {
        return equipos.flatMap((equipo) =>
            equipo.tanque.map((tanque) => ({
                ...tanque,
                vehicleInfo: {
                    numEconomico: equipo.numEconomico,
                    marca: equipo.marca,
                    modelo: equipo.modelo,
                    year: equipo.year,
                },
            })),
        )
    }, [equipos])

    const bddDataValues = [
        {
            title: "Estaciones",
            itemCount: estaciones.length
        },
        {
            title: "Operadores",
            itemCount: operadores.length
        },
        {
            title: "Clientes",
            itemCount: clientes?.length
        },
        {
            title: "Equipos",
            itemCount: equipos.length
        },
        {
            title: "Tanques",
            itemCount: allTanks.length
        },
        {
            title: "Rutas",
            itemCount: rutas?.length
        },
    ]

    const chartData = useMemo(() => {
        return bddDataValues.map((entity) => ({
            name: entity.title,
            value: entity.itemCount,
        }))
    }, [])

    return (
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <PageTitle
                title="Base de datos"
                description="Centro de graficas, explore las diferentes graficas presentadas en el sistema"
                icon={
                    <Database className="w-12 h-12 text-primary" />
                }
            />

            <Separator className="my-4" />

            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    placeholder="Buscar tablas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 py-6 text-base bg-card border-border/50 focus:border-primary/50"
                />
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 col-span-2">
                    <BddCard
                        id="1"
                        title="Operadores"
                        description="Tabla con los registros de los operadores"
                        category="Logistica"
                        icon="healthicons:truck-driver"
                        itemCount={operadores.length}
                    />

                    <BddCard
                        id="2"
                        title="Equipos"
                        description="Tabla con los registros del parque vehicular"
                        category="Parque vehicular"
                        icon="mdi:tanker-truck"
                        itemCount={equipos.length}
                    />

                    <BddCard
                        id="3"
                        title="Tanques"
                        description="Tabla con los registros de los tanques de cada equipo en el parque vehicular"
                        category="Parque vehicular"
                        icon="mdi:train-car-tank"
                        itemCount={allTanks.length}
                    />

                    <BddCard
                        id="4"
                        title="Clientes"
                        description="Tabla con los registros de los tanques de cada equipo en el parque vehicular"
                        category="Clientes"
                        icon="vaadin:users"
                        itemCount={clientes?.length || 0}
                    />

                    <BddCard
                        id="5"
                        title="Estaciones"
                        description="Tabla con los registros de los tanques de cada equipo en el parque vehicular"
                        category="Estaciones"
                        icon="ic:round-local-gas-station"
                        itemCount={estaciones.length}
                    />

                    <BddCard
                        id="6"
                        title="Rutas"
                        description="Tabla con los registros de los tanques de cada equipo en el parque vehicular"
                        category="Logistica"
                        icon="fa7-solid:route"
                        itemCount={rutas?.length || 0}
                    />
                </div>

                <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="mt-2">
                        <CardTitle className="flex items-center">
                            <DatabaseIcon className="h-4 w-4 mr-2" />
                            Registros de base de datos
                        </CardTitle>
                        <CardDescription>
                            Grafica de uso de la base de datos y sus registros por tabla
                        </CardDescription>
                    </CardHeader>
                    <ChartContainer
                        config={{
                            records: {
                                label: "Registros",
                            },
                        }}
                        className="w-full h-[400px]"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={120}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload
                                            return (
                                                <div className="bg-background border border-border rounded-lg p-2 shadow-lg">
                                                    <p className="text-sm font-medium text-foreground">{data.name}</p>
                                                    <p className="text-sm text-primary font-bold">{data.value.toLocaleString()} Registros</p>
                                                </div>
                                            )
                                        }
                                        return null
                                    }}
                                />
                                <Legend
                                    wrapperStyle={{ paddingTop: "20px" }}
                                    style={{
                                        color: "hsl(var(--foreground))",
                                        backgroundColor: "hsl(var(--background))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "8px",
                                        padding: "12px",
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                    <Separator className="w-[95%] mx-auto" />
                    <CardFooter className="-mt-2">
                        Todos los registros presentados son representados por sus respectivas tablas
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default BddPage