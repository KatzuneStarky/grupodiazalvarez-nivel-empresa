"use client"

import { exportCollectionToJson } from "@/functions/json-export/export-collection-to-json"
import { importJsonToCollection } from "@/functions/json-import/import-json-to-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import RoutesManager from "@/modules/logistica/rutas/components/routes-manager"
import { downloadJson } from "@/functions/json-export/download-json"
import { useRutas } from "@/modules/logistica/rutas/hooks/use-rutas"
import { Ruta } from "@/modules/logistica/equipos/types/rutas"
import ImportDialog from "@/components/global/import-dialog"
import { useDirectLink } from "@/hooks/use-direct-link"
import PageTitle from "@/components/custom/page-title"
import { Separator } from "@/components/ui/separator"
import { IconFileExport } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import Icon from "@/components/global/icon"
import { useRouter } from "next/navigation"
import { Plus, Route } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

const EquiposRutasPage = () => {
    const [selectedRoute, setSelectedRoute] = useState<Ruta | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [showForm, setShowForm] = useState(false)

    const { directLink } = useDirectLink("/equipos/rutas")
    const router = useRouter()
    const { rutas } = useRutas()

    const activeRoutes = rutas?.filter((route) => route.activa).length
    const totalDistance = rutas?.reduce((sum, route) => sum + route.trayecto.kilometros, 0)
    const billableRoutes = rutas?.filter((route) => route.viajeFacturable).length

    const importEquiposDataJson = async (data: Ruta[]) => {
        try {
            toast.promise(importJsonToCollection<Ruta>(data, "rutas", {
                convertDates: true,
                overwrite: true,
            }), {
                loading: "Importando datos...",
                success: "Datos importados con éxito",
                error: "Error al importar datos"
            })
        } catch (error) {

        }
    }

    const exportRutasDataJson = async () => {
        try {
            const rutas = await exportCollectionToJson<Ruta>("rutas");
            downloadJson(rutas, "Rutas");

            toast.success("Datos exportados con éxito")
        } catch (error) {
            console.log(error);
            toast.error("Error al exportar datos")
        }
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="space-y-6">
                <PageTitle
                    icon={<Route className="h-12 w-12 text-primary" />}
                    title="Rutas"
                    description="Administración y gestion de rutas"
                    hasActions={true}
                    actions={
                        <>
                            <ImportDialog<Ruta>
                                onImport={importEquiposDataJson}
                                title="Importar rutas"
                                triggerLabel="Importar Json"
                            />
                            <Button className="sm:w-auto">
                                <IconFileExport className="w-4 h-4 mr-2" />
                                Exportar Datos
                            </Button>
                            <Button className="sm:w-auto" onClick={() => exportRutasDataJson()}>
                                <Icon iconName="si:json-fill" className="w-4 h-4 mr-2" />
                                Exportar Json
                            </Button>
                            <Button
                                className="sm:w-auto"
                                onClick={() => router.push(`${directLink}/nuevo`)}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Nueva ruta
                            </Button>
                        </>
                    }
                />

                <Separator className="my-4" />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Rutas</CardTitle>
                            <Route className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{rutas?.length}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Rutas Activas</CardTitle>
                            <Route className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activeRoutes}</div>
                            <p className="text-xs text-muted-foreground">
                                {rutas && rutas?.length > 0 ? Math.round((activeRoutes || 0 / rutas?.length) * 100) : 0}% del total
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Distancia Total</CardTitle>
                            <Route className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalDistance?.toLocaleString()} km</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Rutas Facturables</CardTitle>
                            <Route className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{billableRoutes}</div>
                            <p className="text-xs text-muted-foreground">
                                {rutas && rutas?.length > 0 ? Math.round((billableRoutes || 0 / rutas?.length) * 100) : 0}% del total
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <RoutesManager routes={rutas || []} directLink={directLink} />
        </div>
    )
}

export default EquiposRutasPage