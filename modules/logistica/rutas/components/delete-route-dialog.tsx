"use client"

import { Button } from "@/components/ui/button"
import { deleteRoute } from "../actions/write"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
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

const DeleteRouteDialog = ({ routeId, variant }: { routeId: string, variant: "outline" | "ghost" }) => {
    const [isSubmiting, setIsSubmiting] = useState<boolean>(false)
    const router = useRouter()

    const handleDeleteRoute = async () => {
        try {
            setIsSubmiting(true)

            toast.promise(deleteRoute(routeId), {
                loading: "Eliminando ruta...",
                success: (result) => {
                    if (result.success) {
                        return result.message;
                    } else {
                        throw new Error(result.message);
                    }
                },
                error: (error) => {
                    return error.message || "Error al eliminar la ruta.";
                },
            })
        } catch (error) {
            console.log(error);
            toast.error("Error al eliminar la ruta", {
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
                <Button variant={variant} size="sm">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Esta completamente seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta accion eliminara completamente esta ruta.
                        Si acepta borrar este registro seleccione <b className="font-extrabold">continuar</b>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isSubmiting}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteRoute}
                        disabled={isSubmiting}
                    >
                        Continuar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteRouteDialog