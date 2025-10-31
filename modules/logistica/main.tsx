"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, DollarSign, Fuel, Gauge, Truck, Users } from "lucide-react"
import { useDashboardDataLogistica } from "./hooks/use-dashboard-logistica"
import MainChartPerformance from "./components/main-chat-performance"
import MainActions from "./components/main-actions"
import MetricCard from "./components/metric-card"
import StatusCard from "./components/status-card"
import MainCharts from "./components/main-charts"
import { useYear } from "@/context/year-context"
import dynamic from "next/dynamic";

const Map = dynamic(() => import('../root/components/coverage/map'), { ssr: false });

const MainDashboardLogistica = () => {
    const { selectedYear } = useYear()
    const {
        operadoresCount,
        equiposCount,
        clientesCount,
        estacionesCount,
        totalFlete,
        totalM3,
        percentage,
        percentageChange,
        totalViajes,
        mesActual,
        totalM3Week,
        totalFleteSemana,
        rutasCount
    } = useDashboardDataLogistica()

    return (
        <div className="flex-1 space-y-6 p-6">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <MetricCard
                    title="Ganancia total flete"
                    value={`$${totalFlete}`}
                    change={`${percentage}%`}
                    changeType={percentage > 0 ? "positive" : "negative"}
                    icon={DollarSign}
                    progress={0}
                    target="0"
                    additional={[
                        { label: "Semanal", value: `$${totalFleteSemana}` },
                        { label: "Diario aproximado", value: "" },
                    ]}
                />

                <MetricCard
                    title="Combustible transportado"
                    value={`${totalM3.toFixed(2)} M³`}
                    change={`${percentageChange}%`}
                    changeType={percentageChange > 0 ? "positive" : "negative"}
                    icon={Fuel}
                    progress={0}
                    target="20000"
                    additional={[
                        { label: "Semanal", value: `${totalM3Week.toFixed(2)} M³` },
                        { label: "Diario aproximado", value: "0" },
                    ]}
                    className="xl:col-span-2"
                />
                <MetricCard
                    title="Eficiencia de flota"
                    value="0"
                    change="0"
                    changeType="positive"
                    icon={Gauge}
                    progress={0}
                    target="0"
                    additional={[
                        { label: "En tiempo", value: "0%" },
                        { label: "Eficiencia", value: "0%" },
                    ]}
                />

                <MetricCard
                    title="Operaciones activas"
                    value={`${totalViajes}`}
                    changeType="positive"
                    icon={Activity}
                    subtitle={`Total viajes ${mesActual}`}
                    additional={[
                        { label: "Completados", value: "0" },
                        { label: "En tránsito", value: "0" },
                    ]}
                />
            </div>

            <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
                <StatusCard
                    icon={Truck}
                    title="Equipos activos"
                    label=""
                    value={equiposCount}
                    color="green"
                />

                <StatusCard
                    icon={"healthicons:truck-driver"}
                    title="Operadores activos"
                    label=""
                    value={operadoresCount}
                    color="red"
                />

                <StatusCard
                    icon={Users}
                    title="Clientes"
                    label=""
                    value={clientesCount || 0}
                    color="orange"
                />

                <StatusCard
                    icon={"solar:gas-station-bold"}
                    title="Estaciones"
                    label=""
                    value={estacionesCount}
                    color="yellow"
                />

                <StatusCard
                    icon={"tdesign:map-connection-filled"}
                    title="Rutas"
                    label=""
                    value={rutasCount || 0}
                    color="blue"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 place-items-center mt-4 w-full">
                <div className="col-span-2 w-full">
                    <MainCharts year={selectedYear || 0} />
                </div>
                <MainActions />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 place-items-center mt-4 w-full">
                <div className="col-span-2 w-full">
                    <MainChartPerformance />
                </div>
                <Card className="w-full h-full">
                    <CardContent className="h-full w-full">
                        <CardHeader>                                
                            <CardTitle className="flex items-center justify-between">
                                Mapa de cobertura
                                </CardTitle>
                            <CardDescription>
                                Mapa de cobertura de las estaciones de servicio 
                            </CardDescription>                            
                        </CardHeader>
                        <div className="h-full w-full flex flex-col items-center justify-center">
                            <Map />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default MainDashboardLogistica