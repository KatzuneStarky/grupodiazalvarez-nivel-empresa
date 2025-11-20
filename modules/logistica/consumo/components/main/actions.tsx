"use client"

import PlantillaOrdenConsumo from "../orden/plantilla-orden-consumo"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { OrdenDeConsumo } from "../../types/orden-de-consumo"
import { Edit, Eye, MoreVertical, Trash } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useDirectLink } from "@/hooks/use-direct-link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { deleteOrdenConsumo } from "../../actions/write"

interface OrdenesConsumoActionsProps {
    buttonVariant: "ghost" | "default"
    orden: OrdenDeConsumo
}

const OrdenesConsumoActions = ({
    buttonVariant,
    orden
}: OrdenesConsumoActionsProps) => {
    const { directLink } = useDirectLink(`consumo/orden?ordenId=${orden.id}`)
    const [openDialogDelete, setOpenDialogDelete] = useState<boolean>(false)
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const fechaString = parseFirebaseDate(orden.fecha)
    const router = useRouter()

    const handleDeleteOrden = async() => {
        try {
            toast.promise(deleteOrdenConsumo(orden.id), {
                loading: "Eliminando orden de consumo...",
                success: "Orden de consumo eliminada",
                error: "No se pudo eliminar la orden de consumo"
            })
        } catch (error) {
            console.log(error);
            toast.error("No se pudo eliminar la orden de consumo")
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size={"icon"} variant={buttonVariant}>
                        <MoreVertical />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setOpenDialog(!openDialog)}>
                        <Eye />
                        <span>Ver orden</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(directLink)}>
                        <Edit />
                        <span>Editar orden</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onClick={() => setOpenDialogDelete(!openDialogDelete)}>
                        <Trash />
                        <span>Eliminar orden</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>


            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Orde de consumo</DialogTitle>
                    </DialogHeader>

                    <ScrollArea className="w-full h-[700px] p-6">
                        <PlantillaOrdenConsumo
                            observaciones={orden?.observaciones || ""}
                            numEconomico={orden.numEconomico}
                            operadorNombre={orden.operador}
                            kilometraje={orden.kilometraje}
                            mediciones={orden.mediciones}
                            fechaString={fechaString}
                            lastFolio={orden.folio}
                            destino={orden.destino}
                            viewMode={true}
                        />
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            <AlertDialog open={openDialogDelete} onOpenChange={setOpenDialogDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Esta completamente seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta accion no se puede deshacer. 
                            Esta orden de consumo sera eliminada permanentemente de nuestra base de datos.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteOrden}>
                            Continuar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default OrdenesConsumoActions