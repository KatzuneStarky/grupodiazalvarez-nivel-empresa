"use client"

import { Edit, MoreHorizontal } from "lucide-react"
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
import DeleteEstacionDialog from "./delete-estacion-dialog"

const EstacionActions = ({
    directLink,
    estacionId
}: {
    directLink: string,
    estacionId: string
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