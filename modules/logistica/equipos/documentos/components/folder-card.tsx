"use client"

import { Clock, FileCheck, Files, FileWarning, Link2Icon } from "lucide-react"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { convertFileSize } from "@/functions/convert-file-size"
import { useFolderCard } from "../hooks/use-folder-card"
import { useDirectLink } from "@/hooks/use-direct-link"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Folder } from "../types/folder"
import { es } from "date-fns/locale"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"

const FolderCard = ({ folder }: { folder: Folder }) => {
    const { directLink } = useDirectLink(`/equipos/${folder.equipoId}`)

    const {
        archivosVencimientoPesoTotal,
        isModifiedWithin7Days,
        certificadosPesoTotal,
        archivosPesoTotal,
        totalArchivos,
        lastModified,
        totalSize,
    } = useFolderCard({ folder: folder })

    return (
        <Card className="p-3 space-y-1 relative overflow-hidden">
            {isModifiedWithin7Days && (
                <Badge className="absolute top-2 right-2 bg-blue-500">
                    <Clock className="w-3 h-3 mr-1" />
                    Reciente
                </Badge>
            )}

            <div className={cn("space-y-2", isModifiedWithin7Days && "mt-4")}>
                <div className='flex items-center justify-between w-full'>
                    <h3 className="text-2xl font-bold">{folder.name}</h3>
                    <Link href={directLink}>
                        <Link2Icon size={20} className='hover:text-blue-500 transition-all' />
                    </Link>
                </div>
                <p className="text-sm text-muted-foreground">
                    Archivos totales: {totalArchivos} · {convertFileSize(totalSize, 2)}
                </p>
            </div>
            <Separator />
            <div className="grid gap-2">
                <div className="flex items-center p-2 bg-blue-50 dark:bg-gray-900 rounded-lg">
                    <Files className="w-5 h-5 text-blue-500 mr-3" />
                    <div>
                        <p className="font-medium">Archivos</p>
                        <p className="text-sm text-muted-foreground">
                            {folder.archivos.length} archivos · {convertFileSize(archivosPesoTotal, 2)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center p-2 bg-green-50 dark:bg-gray-900 rounded-lg">
                    <FileWarning className="w-5 h-5 text-green-500 mr-3" />
                    <div>
                        <p className="font-medium">
                            Archivos con vencimiento
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {folder.archivosVencimiento.length} archivos · {convertFileSize(archivosVencimientoPesoTotal, 2)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center p-2 bg-red-50 dark:bg-gray-900 rounded-lg">
                    <FileCheck className="w-5 h-5 text-red-500 mr-3" />
                    <div>
                        <p className="font-medium">Certificado</p>
                        <p className="text-sm text-muted-foreground">
                            {folder.certificado.length} archivo · {convertFileSize(certificadosPesoTotal, 2)}
                        </p>
                    </div>
                </div>
            </div>
            <Separator />
            <div className="space-y-1 text-sm capitalize">
                <p>Modificado el: {format(lastModified, "PPP", { locale: es })}</p>
                <p>Creado el: {format(parseFirebaseDate(folder.createdAt), 'PPP', { locale: es })}</p>
            </div>
        </Card>
    )
}

export default FolderCard