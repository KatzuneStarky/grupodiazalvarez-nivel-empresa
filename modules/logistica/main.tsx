"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EquipmentUtilizationTable } from "./components/tables/equipos-mas-utilizados-table"
import { Banknote, Fuel, HandCoins, MapPinHouse, Route, Truck, Users } from "lucide-react"
import { getEquipmentUtilization } from "@/functions/get-equipment-utilization"
import { TopClientsTable } from "./components/tables/mejores-clientes-table"
import { useDashboardDataLogistica } from "./hooks/use-dashboard-logistica"
import { RecentTripsTable } from "./components/tables/reporte-viajes-table"
import MainChartPerformance from "./components/main-chat-performance"
import { EquipmentTable } from "./components/tables/equipos-tablet"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { MainActions } from "./components/main-actions"
import PageTitle from "@/components/custom/page-title"
import { Separator } from "@/components/ui/separator"
import MetricCard from "./components/metric-card"
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
        totalViajes,
        mesActual,
        totalM3Week,
        totalFleteSemana,
        rutasCount,
        primerDiaSemana,
        ultimoDiaSemana,
        reporteViajes,
    } = useDashboardDataLogistica()
    
    const sortedViajes = reporteViajes.sort((a, b) => {
        const dateA = parseFirebaseDate(a.Fecha);
        const dateB = parseFirebaseDate(b.Fecha);
        return dateB.getTime() - dateA.getTime();
    });
    
    const sortedDataByMonth 
    = sortedViajes.filter((viaje) => viaje.Mes === "Octubre" && viaje.Year === selectedYear)    
    const equipmentUtilization = getEquipmentUtilization(sortedDataByMonth)
    
    return (
        <div className="flex-1 space-y-6 p-6">
            <PageTitle
                title="Dashboard logistica"
                description="Resumen de la información del area de logistica"
                icon={
                    <Truck className="h-12 w-12 text-primary" />
                }
                hasActions={true}
                actions={
                    <MainActions />
                }
            />
            <Separator className="my-4" />

            <div className="container mx-auto px-4 py-6" >
                <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    <MetricCard
                        title="Total M³ transportado"
                        value={totalM3}
                        icon={Fuel}
                        colorVariant="amber"
                        textValue="M³"
                    />
                    <MetricCard
                        title={`Viajes Este Mes (${mesActual})`}
                        value={totalViajes}
                        icon={MapPinHouse}
                        colorVariant="cyan"
                        textValue="Viajes"
                    />
                    <MetricCard
                        title={`Flete total (${mesActual})`}
                        value={totalFlete}
                        icon={HandCoins}
                        colorVariant="lime"
                        initialTextVaule="$"
                    />
                    <MetricCard
                        title={`Total M³ transportado semana actual (${primerDiaSemana} - ${ultimoDiaSemana})`}
                        value={totalM3Week}
                        icon={Fuel}
                        colorVariant="emerald"
                        textValue="M³"
                    />
                    <MetricCard
                        title={`Flete total senaba actual (${primerDiaSemana} - ${ultimoDiaSemana})`}
                        value={totalFleteSemana}
                        icon={Banknote}
                        colorVariant="orange"
                        initialTextVaule="$"
                    />

                    <MetricCard
                        title="Operadores"
                        value={operadoresCount}
                        icon={Users}
                        colorVariant="teal"
                    />
                    <MetricCard
                        title="Equipos"
                        value={equiposCount}
                        icon={Truck}
                        colorVariant="rose"
                    />
                    <MetricCard
                        title="Estaciones"
                        value={estacionesCount}
                        icon={Fuel}
                        colorVariant="purple"
                    />
                    <MetricCard
                        title="Clientes"
                        value={clientesCount || 0}
                        icon={Users}
                        colorVariant="pink"
                    />
                    <MetricCard
                        title="Rutas"
                        value={rutasCount || 0}
                        icon={Route}
                        colorVariant="blue"
                    />
                </div>

                <div className="mb-6 grid gap-6 lg:grid-cols-2">
                    <MainCharts year={selectedYear || new Date().getFullYear()} />
                    <MainChartPerformance />
                </div>

                <Card className="mb-6">
                    <CardContent>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                Mapa de cobertura
                            </CardTitle>
                            <CardDescription>
                                Mapa de cobertura de las estaciones de servicio
                            </CardDescription>
                        </CardHeader>
                        <Map />
                    </CardContent>
                </Card>

                <div className="mb-6">
                    <RecentTripsTable trips={sortedViajes} />
                </div>

                <div className="mb-6 grid gap-6 lg:grid-cols-2">
                    <TopClientsTable trips={sortedDataByMonth} />
                    <EquipmentUtilizationTable data={equipmentUtilization} />
                </div>

                <div className="mb-6">
                    <EquipmentTable
                        trips={reporteViajes}
                        year={selectedYear || new Date().getFullYear()}
                        mes={mesActual}
                    />
                </div>
            </div>
        </div>
    )
}

export default MainDashboardLogistica