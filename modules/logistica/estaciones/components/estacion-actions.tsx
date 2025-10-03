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
                <DropdownMenuItem onClick={() => router.push(`${directLink}/editar?estacionId=${estacionId}`)}>
                    <Edit />
                    Editar
                </DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default EstacionActions