"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { esArchivoVencimiento, esCertificado } from "@/functions/tipo-archivo-equipo"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Download, Edit, Eye, MoreVertical, Trash2 } from "lucide-react"
import { convertFileSize } from "@/functions/convert-file-size"
import { CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileVariant } from "../document-card"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const DocumentCardFooter = ({
    file
}: {
    file: FileVariant
}) => {
    const router = useRouter()

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
        <CardFooter className="flex items-center justify-between p-2 border-t">
            <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground ml-2">
                    {convertFileSize(file.peso, 2)} • {file.extension.toUpperCase()}
                </span>
            </div>
            <div className="flex items-center justify-center space-x-2">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="default"
                            size="sm"
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='h-full max-w-5xl'>
                        <iframe
                            src={file.ruta}
                            style={{ width: "100%", height: "100%", border: "none" }}
                            className="w-full h-full py-4"
                            title={file.nombre}
                        />
                    </DialogContent>
                </Dialog>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => router.push(file.ruta)}
                >
                    <Download className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className='focus:bg-red-800 bg-red-700 cursor-pointer'
                            asChild
                        >
                            <AlertDialog>
                                <AlertDialogTrigger
                                    className='relative flex select-none items-center gap-2 
                                    rounded-sm px-2 py-1.5 text-sm outline-none transition-colors 
                                    data-[disabled]:pointer-events-none data-[disabled]:opacity-50 
                                    [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-red-800 bg-red-700 cursor-pointer'
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Eliminar archivo
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
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </CardFooter>
    )
}

export default DocumentCardFooter