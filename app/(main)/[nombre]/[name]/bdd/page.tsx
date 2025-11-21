"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useOperadores } from "@/modules/logistica/bdd/operadores/hooks/use-estaciones"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { useEstaciones } from "@/modules/logistica/estaciones/hooks/use-estaciones"
import { useClientes } from "@/modules/logistica/bdd/clientes/hooks/use-clientes"
import { useEquipos } from "@/modules/logistica/bdd/equipos/hooks/use-equipos"
import { useRutas } from "@/modules/logistica/rutas/hooks/use-rutas"
import BddCard from "@/modules/logistica/bdd/components/bdd-card"
import { Database, DatabaseIcon, Search } from "lucide-react"
import { ChartContainer } from "@/components/ui/chart"
import PageTitle from "@/components/custom/page-title"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { useMemo, useState } from "react"

const CHART_COLORS = [
    "hsl(10, 90%, 60%)",
    "hsl(130, 80%, 50%)",
    "hsl(330, 85%, 60%)",
    "hsl(160, 85%, 45%)",
    "hsl(290, 75%, 55%)",
    "hsl(70, 90%, 45%)",
]

const BddPage = () => {
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

    const entities = useMemo(() => [
        {
            id: "1",
            title: "Operadores",
            description: "Tabla con los registros de los operadores",
            category: "Logistica",
            icon: "healthicons:truck-driver",
            itemCount: operadores?.length || 0
        },
        {
            id: "2",
            title: "Equipos",
            description: "Tabla con los registros del parque vehicular",
            category: "Parque vehicular",
            icon: "mdi:tanker-truck",
            itemCount: equipos?.length || 0
        },
        {
            id: "3",
            title: "Tanques",
            description: "Tabla con los registros de los tanques de cada equipo en el parque vehicular",
            category: "Parque vehicular",
            icon: "mdi:train-car-tank",
            itemCount: allTanks.length
        },
        {
            id: "4",
            title: "Clientes",
            description: "Tabla con el catálogo de clientes registrados",
            category: "Clientes",
            icon: "vaadin:users",
            itemCount: clientes?.length || 0
        },
        {
            id: "5",
            title: "Estaciones",
            description: "Tabla con el catálogo de estaciones de servicio",
            category: "Estaciones",
            icon: "ic:round-local-gas-station",
            itemCount: estaciones?.length || 0
        },
        {
            id: "6",
            title: "Rutas",
            description: "Tabla con las rutas logísticas definidas",
            category: "Logistica",
            icon: "fa7-solid:route",
            itemCount: rutas?.length || 0
        },
    ], [operadores, equipos, allTanks, clientes, estaciones, rutas])

    const filteredEntities = useMemo(() => {
        if (!searchQuery) return entities
        const lowerQuery = searchQuery.toLowerCase()
        return entities.filter((item) =>
            item.title.toLowerCase().includes(lowerQuery) ||
            item.description.toLowerCase().includes(lowerQuery) ||
            item.category.toLowerCase().includes(lowerQuery)
        )
    }, [entities, searchQuery])

    const chartData = useMemo(() => {
        return entities.map((entity) => ({
            name: entity.title,
            value: entity.itemCount,
        }))
    }, [entities])

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

            {/* Main Grid: 2/3 for cards, 1/3 for chart on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Entity Cards Grid - 2/3 width on desktop (8 columns) */}
                <div className="lg:col-span-8">
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
                        {filteredEntities.map((entity) => (
                            <BddCard
                                key={entity.id}
                                id={entity.id}
                                title={entity.title}
                                description={entity.description}
                                category={entity.category}
                                icon={entity.icon}
                                itemCount={entity.itemCount}
                            />
                        ))}
                    </div>
                </div>

                {/* Chart Card - 1/3 width on desktop (4 columns), full width on mobile */}
                <div className="lg:col-span-4">
                    <Card className="border-border/40 bg-card/50 backdrop-blur-sm w-full h-full">
                        <CardHeader className="mt-2">
                            <CardTitle className="flex items-center text-base sm:text-lg">
                                <DatabaseIcon className="h-4 w-4 mr-2" />
                                Registros de base de datos
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                                Grafica de uso de la base de datos y sus registros por tabla
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                            <ChartContainer
                                config={{
                                    records: {
                                        label: "Registros",
                                    },
                                }}
                                className="w-full h-[300px] sm:h-[400px]"
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
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
                                            wrapperStyle={{ paddingTop: "10px" }}
                                            iconSize={10}
                                            style={{
                                                fontSize: "12px",
                                                color: "hsl(var(--foreground))",
                                                backgroundColor: "hsl(var(--background))",
                                                border: "1px solid hsl(var(--border))",
                                                borderRadius: "8px",
                                                padding: "8px",
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                        <CardFooter className="text-xs sm:text-sm pt-2">
                            Todos los registros presentados son representados por sus respectivas tablas
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default BddPage