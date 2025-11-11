"use client"

import { calcularEstadoVencimiento, esArchivoVencimiento, esCertificado } from "@/functions/tipo-archivo-equipo"
import { convertirFecha } from "@/functions/document-date"
import { Calendar, Clock, IdCard } from "lucide-react"
import { CardContent } from "@/components/ui/card"
import { FileVariant } from "./document-card-v2"

const DocumentCardContent = ({
    file
}: {
    file: FileVariant
}) => {
    return (
        <CardContent className="grid grid-cols-2 gap-4 p-4">
            <div className="space-y-2">
                <div className="flex items-center space-x-2 w-full">
                    <IdCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm truncate">ID: {file.id}</span>
                </div>
                <div className="flex items-center space-x-2">
                    {esCertificado(file) || esArchivoVencimiento(file)
                        ? <Calendar className="h-4 w-4 text-muted-foreground" /> : ""}
                    <span className="text-sm">
                        {esCertificado(file) && calcularEstadoVencimiento(file)}
                        {esArchivoVencimiento(file) && calcularEstadoVencimiento(file)}
                    </span>
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                        Subido el: {convertirFecha(file.createdAt).toLocaleDateString()}
                    </span>
                </div>
                {'updateAt' in file && (
                    <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                            Ultima actualizacion: {convertirFecha(file.updatedAt).toLocaleDateString()}
                        </span>
                    </div>
                )}
            </div>
        </CardContent>
    )
}

export default DocumentCardContent