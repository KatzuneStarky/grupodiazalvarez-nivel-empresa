"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EquipmentUtilizationTable } from "./components/tables/equipos-mas-utilizados-table"
import { Banknote, Fuel, HandCoins, MapPinHouse, Route, Truck, Users } from "lucide-react"
import { getEquipmentUtilization } from "@/functions/get-equipment-utilization"
import { TopClientsTable } from "./components/tables/mejores-clientes-table"
import { useDashboardDataLogistica } from "./hooks/use-dashboard-logistica"
import { RecentTripsTable } from "./components/tables/reporte-viajes-table"
import { DashboardSkeleton } from "./components/dashboard-skeleton"
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
import { useMemo } from "react"

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
        loading
    } = useDashboardDataLogistica()

    const sortedViajes = useMemo(() => {
        return [...reporteViajes].sort((a, b) => {
            const dateA = parseFirebaseDate(a.Fecha);
            const dateB = parseFirebaseDate(b.Fecha);
            return dateB.getTime() - dateA.getTime();
        });
    }, [reporteViajes]);

    const sortedDataByMonth = useMemo(() => {
        if (!selectedYear || !mesActual) return [];
        return sortedViajes.filter(viaje => viaje.Mes === "Octubre" && viaje.Year === selectedYear);
    }, [sortedViajes, mesActual, selectedYear]);

    const equipmentUtilization = useMemo(() => {
        return getEquipmentUtilization(sortedDataByMonth);
    }, [sortedDataByMonth]);

    if (loading) {
        return <DashboardSkeleton />
    }

    return (
        <div className="flex-1 space-y-6 p-6">
            <PageTitle
                title="Dashboard Logística"
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

            <div className="space-y-6" >
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    <MetricCard
                        title="Total M³ transportado"
                        value={totalM3}
                        icon={Fuel}
                        colorVariant="amber"
                        textValue="M³"
                    />
                    <MetricCard
                        title={`Viajes Este Mes(${mesActual})`}
                        value={totalViajes}
                        icon={MapPinHouse}
                        colorVariant="cyan"
                        textValue="Viajes"
                    />
                    <MetricCard
                        title={`Flete total(${mesActual})`}
                        value={totalFlete}
                        icon={HandCoins}
                        colorVariant="lime"
                        initialTextVaule="$"
                    />
                    <MetricCard
                        title={`Total M³ sem.actual(${primerDiaSemana} - ${ultimoDiaSemana})`}
                        value={totalM3Week}
                        icon={Fuel}
                        colorVariant="emerald"
                        textValue="M³"
                    />
                    <MetricCard
                        title={`Flete total sem.actual(${primerDiaSemana} - ${ultimoDiaSemana})`}
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

                <div className="grid gap-6 lg:grid-cols-2">
                    <MainCharts year={selectedYear || new Date().getFullYear()} />
                    <MainChartPerformance />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Mapa de cobertura
                        </CardTitle>
                        <CardDescription>
                            Mapa de cobertura de las estaciones de servicio
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 sm:p-6">
                        <Map />
                    </CardContent>
                </Card>

                <div>
                    <RecentTripsTable trips={sortedViajes} />
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <TopClientsTable trips={sortedDataByMonth} />
                    <EquipmentUtilizationTable data={equipmentUtilization} />
                </div>

                <div>
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