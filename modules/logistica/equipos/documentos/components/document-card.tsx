"use client"

import { calcularEstadoVencimiento, esArchivoVencimiento, esCertificado } from "@/functions/tipo-archivo-equipo"
import { ArchivosVencimiento } from "@/modules/logistica/bdd/equipos/types/archivos-vencimiento"
import { Certificado } from "@/modules/logistica/bdd/equipos/types/certificados"
import { Archivo } from "@/modules/logistica/bdd/equipos/types/archivos"
import DocumentCardContent from "./document-card/document-card-content"
import DocumentCardFooter from "./document-card/document-card-footer"
import { VencimientoEstado } from "../enum/estado-documento"
import DocumentCardHeader from "./document-card/header"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type FileVariant = Archivo | Certificado | ArchivosVencimiento

const estadoColorMap: Record<VencimientoEstado, string> = {
    [VencimientoEstado.VENCIDO]: "border-2 border-red-500",
    [VencimientoEstado.POR_VENCER]: "border-2 border-yellow-500",
    [VencimientoEstado.EN_TIEMPO]: "border-2 border-green-500",
};

const DocumentCard = ({
    file
}: {
    file: FileVariant
}) => {
    let borderClass = "border-2 border-gray-300";

    if (esCertificado(file) || esArchivoVencimiento(file)) {
        const estado = calcularEstadoVencimiento(file);
        borderClass = estadoColorMap[estado];
    }

    return (
        <Card
            className={cn( "flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl", borderClass )}>
            <DocumentCardHeader file={file} />
            <DocumentCardContent file={file} />
            <DocumentCardFooter file={file} />
        </Card>
    )
}

export default DocumentCard