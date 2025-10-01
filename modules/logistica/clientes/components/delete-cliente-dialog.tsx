"use client"

import { DeleteCliente } from "../actions/write"
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

const DeleteClientDialog = ({ clientId }: { clientId: string }) => {
    const [isSubmiting, setIsSubmiting] = useState<boolean>(false)
    const router = useRouter()

    const deleteClient = async () => {
        try {
            setIsSubmiting(true)

            toast.promise(DeleteCliente(clientId), {
                loading: "Eliminando cliente...",
                success: (result) => {
                    if (result.success) {
                        return result.message;
                    } else {
                        throw new Error(result.message);
                    }
                },
                error: (error) => {
                    return error.message || "Error al eliminar el cliente.";
                },
            })
        } catch (error) {
            console.log(error);
            toast.error("Error al eliminar el cliente", {
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
            <AlertDialogTrigger asChild>
                <Button
                    size="sm"
                    className="flex-1 text-xs h-8 bg-red-700 hover:bg-red-800"
                >
                    <Trash className="h-3 w-3 mr-1" />
                    Eliminar
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Esta completamente seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta accion eliminara completamente este cliente y sus contactos.
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
                        onClick={deleteClient}
                        disabled={isSubmiting}
                    >
                        Continuar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteClientDialog