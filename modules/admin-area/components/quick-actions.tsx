"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { exportArea } from "@/functions/excel-export/area/export/export-area"
import EditAreaModal from "@/modules/areas/components/edit-area-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Menu } from "@/modules/menus/types/menu-sistema"
import { Cog, Download, Plus, UserPlus } from "lucide-react"
import InviteUserDialog from "./invite-user-dialog"
import { Button } from "@/components/ui/button"
import CreateAreaMenuForm from "./menu-form"
import { useArea } from "@/context/area-context"
import { SystemUser } from "@/types/usuario"
import { AreaInput } from "@/types/area"
import { toast } from "sonner"

interface QuickActionsProps {
    areaId: string
    empresaName: string
    empresaId: string
    users: SystemUser[]
    menus: Menu[]
}

const QuickActions = ({ areaId, empresaName, empresaId, users, menus }: QuickActionsProps) => {
    const { area } = useArea()

    const handleExport = () => {
        if (!area) {
            toast.error("Datos del área no disponibles")
            return
        }
        try {
            toast.promise(exportArea(area, menus, users), {
                loading: "Exportando datos...",
                success: "Datos exportados correctamente",
                error: "Error al exportar datos"
            })
        } catch (error) {
            console.error(error)
            toast.error("Error inesperado al exportar")
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant={"default"} className="h-auto p-4 flex flex-col items-start space-y-2">
                                <Plus className="h-5 w-5" />
                                <div className="text-left">
                                    <div className="font-medium text-sm">Agregar menu</div>
                                    <div className="text-xs text-muted-foreground">
                                        Agregar un nuevo menu a la lista
                                    </div>
                                </div>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>
                                    Crea un nuevo menu
                                </DialogTitle>
                                <DialogDescription>
                                    Agrega un nuevo link a tu área,
                                    ten en cuenta que se debe contactar
                                    al administrador para tener en cuenta los cambios.
                                </DialogDescription>
                            </DialogHeader>
                            <CreateAreaMenuForm
                                areaId={areaId}
                                empresaName={empresaName}
                            />
                        </DialogContent>
                    </Dialog>

                    <InviteUserDialog empresaId={empresaId} areaId={areaId}>
                        <Button variant={"outline"} className="h-auto p-4 flex flex-col items-start space-y-2 w-full">
                            <UserPlus className="h-5 w-5" />
                            <div className="text-left">
                                <div className="font-medium text-sm">Invitar usuario</div>
                                <div className="text-xs text-muted-foreground">
                                    Invita un nuevo usuario a tu área
                                </div>
                            </div>
                        </Button>
                    </InviteUserDialog>

                    <Button
                        variant={"outline"}
                        className="h-auto p-4 flex flex-col items-start space-y-2"
                        onClick={handleExport}
                        disabled={!area}
                    >
                        <Download className="h-5 w-5" />
                        <div className="text-left">
                            <div className="font-medium text-sm">Exportar datos</div>
                            <div className="text-xs text-muted-foreground">
                                Exportar todos los datos del area
                            </div>
                        </div>
                    </Button>

                    {area ? (
                        <EditAreaModal empresaId={empresaId} area={area as unknown as AreaInput}>
                            <Button variant={"outline"} className="h-auto p-4 flex flex-col items-start space-y-2 w-full">
                                <Cog className="h-5 w-5" />
                                <div className="text-left">
                                    <div className="font-medium text-sm">Configurar area</div>
                                    <div className="text-xs text-muted-foreground text-wrap">
                                        Configuracion del area actual
                                    </div>
                                </div>
                            </Button>
                        </EditAreaModal>
                    ) : (
                        <Button variant={"outline"} disabled className="h-auto p-4 flex flex-col items-start space-y-2">
                            <Cog className="h-5 w-5" />
                            <div className="text-left">
                                <div className="font-medium text-sm">Configurar area</div>
                                <div className="text-xs text-muted-foreground">
                                    Cargando datos...
                                </div>
                            </div>
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default QuickActions