"use client"

import DashboardCharts from "@/modules/logistica/estaciones/components/dashboard-charts"
import DashboardStats from "@/modules/logistica/estaciones/components/dashboard-stats"
import { useEstaciones } from "@/modules/logistica/estaciones/hooks/use-estaciones"
import { useDirectLink } from "@/hooks/use-direct-link"
import { Separator } from "@/components/ui/separator"
import { IconGasStation } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"

const EstacionesPage = () => {
    const { directLink } = useDirectLink("/estaciones/nuevo")
    const { estaciones } = useEstaciones()
    const router = useRouter()

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <IconGasStation className="h-12 w-12 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard de Estaciones de Servicio</h1>
                        <p className="text-muted-foreground">
                            Gestión y monitoreo de estaciones de combustible en tiempo real
                        </p>
                    </div>
                </div>

                <Button
                    className="sm:w-auto"
                    onClick={() => router.push(directLink)}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva estacion
                </Button>
            </div>
            <Separator />
            <DashboardStats estaciones={estaciones} />
            <DashboardCharts estaciones={estaciones} />
        </div>
    )
}

export default EstacionesPage