"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArchivosVencimiento } from "@/modules/logistica/bdd/equipos/types/archivos-vencimiento";
import { esArchivoVencimiento, esCertificado } from "@/functions/tipo-archivo-equipo";
import { Certificado } from "@/modules/logistica/bdd/equipos/types/certificados";
import { Archivo } from "@/modules/logistica/bdd/equipos/types/archivos";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export type FileVariant = Archivo | Certificado | ArchivosVencimiento

const DeleteDocumentButton = ({
    file
}: {
    file: FileVariant
}) => {
    const handleDeleteFile = async (
        eId: string,
        fId: string,
        name: string,
        type: "archivos" | "certificados" | "archivosVencimiento"
    ) => {
        try {
            //await deleteFileAndUpdateEquipo(eId, fId, name, type);
            toast.success("Se a eliminado el archivo exitosamente!!", {
                description: `El archivo ${name} se a eliminado 
                    correctamente de la base de datos`
            })
        } catch (error) {
            console.log(error);
            toast.error("Error al eliminar el archivo", {
                description: `Hubo un error al eliminar el archivo \n${error}`,
            })
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Esta seguro de realizar esta accion?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta accion eliminara el archivo <b>{file.nombre}</b> de manera permanente
                        y no podra ser revertido
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className='hover:bg-red-800 bg-red-700 text-white'
                        onClick={() => handleDeleteFile(
                            file.equipoId,
                            file.id,
                            file.nombre,
                            esCertificado(file)
                                ? "certificados"
                                : esArchivoVencimiento(file)
                                    ? "archivosVencimiento"
                                    : "archivos"
                        )}
                    >
                        Eliminar archivo
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteDocumentButton