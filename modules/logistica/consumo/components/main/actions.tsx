"use client"

import PlantillaOrdenConsumo from "../orden/plantilla-orden-consumo"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { OrdenDeConsumo } from "../../types/orden-de-consumo"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Edit, Eye, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
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
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"


interface OrdenesConsumoActionsProps {
    buttonVariant: "ghost" | "default"
    orden: OrdenDeConsumo
}

const OrdenesConsumoActions = ({
    buttonVariant,
    orden
}: OrdenesConsumoActionsProps) => {
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const fechaString = parseFirebaseDate(orden.fecha)

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
                    <DropdownMenuItem>
                        <Edit />
                        <span>Editar orden</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuItem>Subscription</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>


            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="max-w-2xl overflow-y-scroll">
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
                        />
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default OrdenesConsumoActions