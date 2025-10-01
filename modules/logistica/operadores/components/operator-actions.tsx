"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Operador } from "../../bdd/operadores/types/operadores"
import { Edit, MoreHorizontal, Trash2 } from "lucide-react"
import OperadorDetails from "./operador-details"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const OperatorActions = ({ operador, className, directLink }: { operador: Operador, className: string, directLink: string }) => {
    const router = useRouter()

    return (
        <div className={className}>
            <OperadorDetails operador={operador} />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => router.push(`${directLink}/editar?operadorId=${operador.id}`)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default OperatorActions