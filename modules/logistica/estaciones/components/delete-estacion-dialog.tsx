"use client"

import { deleteEstacion } from "../actions/write"
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

const DeleteEstacionDialog = ({ estacionId, title, className }: { estacionId: string, title?: string, className: string }) => {
    const [isSubmiting, setIsSubmiting] = useState<boolean>(false)
    const router = useRouter()

    const handleDeleteEstacion = async () => {
        try {
            setIsSubmiting(true)

            toast.promise(deleteEstacion(estacionId), {
                loading: "Eliminando estacion...",
                success: (result) => {
                    if (result.success) {
                        return result.message;
                    } else {
                        throw new Error(result.message);
                    }
                },
                error: (error) => {
                    return error.message || "Error al eliminar la estacion.";
                },
            })
        } catch (error) {
            console.log(error);
            toast.error("Error al eliminar la estacion", {
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
                    variant="ghost"
                    size="sm"
                    className={className}
                >
                    <Trash className="h-4 w-4" />
                    {title}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Esta completamente seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta accion no se puede deshacer. Esta seguro que desea eliminar esta estacion?.
                        Al presionar <span className="font-extrabold">Continuar</span> se eliminara el registro de la estacion
                        y sus contactos
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isSubmiting}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isSubmiting}
                        onClick={handleDeleteEstacion}
                    >
                        Continuar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteEstacionDialog