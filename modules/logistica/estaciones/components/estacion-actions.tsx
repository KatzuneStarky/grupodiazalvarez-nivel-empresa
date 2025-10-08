"use client"

import DeleteEstacionDialog from "./delete-estacion-dialog"
import { Edit, Eye, MoreHorizontal } from "lucide-react"
import { EstacionServicio } from "../types/estacion"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const EstacionActions = ({
    directLink,
    estacionId,
    selectedStation,
    setSelectedStation
}: {
    directLink: string,
    estacionId: string,
    selectedStation: EstacionServicio | null,
    setSelectedStation: React.Dispatch<React.SetStateAction<EstacionServicio | null>>
}) => {
    const router = useRouter()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} size={"icon"}>
                    <MoreHorizontal />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="flex items-center justify-center"
                    onClick={() => setSelectedStation(selectedStation)}
                >
                    <Eye className="h-4 w-4" />
                    Ver
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => router.push(`${directLink}/editar?estacionId=${estacionId}`)}
                    className="flex items-center justify-center"
                >
                    <Edit className="h-4 w-4" />
                    Editar
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <DeleteEstacionDialog estacionId={estacionId} className="w-full" title="Eliminar" />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default EstacionActions