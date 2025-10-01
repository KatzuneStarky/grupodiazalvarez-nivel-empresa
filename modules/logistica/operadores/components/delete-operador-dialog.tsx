"use client"

import { deleteOperador } from "../actions/write"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Trash } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
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

const DeleteOperadorDialog = ({ operadorId }: { operadorId: string }) => {
    const [isSubmiting, setIsSubmiting] = useState<boolean>(false)
    const router = useRouter()

    const handleDeleteOperador = async () => {
        try {
            setIsSubmiting(true)

            toast.promise(deleteOperador(operadorId), {
                loading: "Eliminando al operador...",
                success: (result) => {
                    if (result.success) {
                        return result.message;
                    } else {
                        throw new Error(result.message);
                    }
                },
                error: (error) => {
                    return error.message || "Error al eliminar el operador.";
                },
            })
        } catch (error) {
            console.log(error);
            toast.error("Error al eliminar el operador", {
                description: `${error}`
            })
            setIsSubmiting(false)
        } finally {
            setIsSubmiting(false)
            router.refresh()
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger className="focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4" asChild>
                <Button
                    size="sm"
                    className="text-xs h-8 w-full flex-1 justify-start"
                    variant={"ghost"}
                >
                    <Trash className="h-4 w-4 mr-1" />
                    Eliminar
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Esta completamente seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta accion eliminara completamente este operador y sus contactos.
                        Si acepta borrar este registro seleccione <b className="font-extrabold">continuar</b>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        disabled={isSubmiting}
                    >
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-red-600"
                        onClick={handleDeleteOperador}
                        disabled={isSubmiting}
                    >
                        Continuar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteOperadorDialog