"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ArchivosVencimiento } from "@/modules/logistica/bdd/equipos/types/archivos-vencimiento"
import { Calendar, Clock, Download, Edit, Eye, FileText, Trash2, Truck } from "lucide-react"
import { esArchivoVencimiento, esCertificado } from "@/functions/tipo-archivo-equipo"
import { Certificado } from "@/modules/logistica/bdd/equipos/types/certificados"
import { useEquipos } from "@/modules/logistica/bdd/equipos/hooks/use-equipos"
import { Archivo } from "@/modules/logistica/bdd/equipos/types/archivos"
import { formatFileSize, getFileIcon } from "@/constants/file-icons"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import DeleteDocumentButton from "./delete-document-button"
import IframeDocumentDialog from "./iframe-document-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { AnimatePresence, motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { es } from "date-fns/locale"
import { format } from "date-fns"
import { useState } from "react"

export type FileVariant = Archivo | Certificado | ArchivosVencimiento

const DocumentCardV2 = ({
    file
}: {
    file: FileVariant
}) => {
    const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false)
    const [isHovered, setIsHovered] = useState<boolean>(false)
    const { equipos } = useEquipos()

    const hasExpiration = esCertificado(file) || esArchivoVencimiento(file)
    const isExpired = hasExpiration && parseFirebaseDate(file.fecha) && new Date(parseFirebaseDate(file.fecha)) < new Date()
    const Icon = getFileIcon(file.nombre, "file")

    const getEquipoDataById = (equipoId: string) => {
        const equipo = equipos.find((equipo) => equipo.id === equipoId)
        return equipo
    }
    const equipo = getEquipoDataById(file.equipoId)

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <Card
                className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 ${isExpired ? "border-destructive/50 hover:border-destructive" : "hover:border-primary/50"}`}
            >
                <div
                    className={`absolute top-0 left-0 right-0 h-1 ${isExpired
                        ? "bg-gradient-to-r from-destructive to-destructive/50"
                        : "bg-gradient-to-r from-primary to-primary/50"
                        } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
                <CardContent className="px-4">
                    <div className="flex items-start justify-between mb-4">
                        <div className="relative">
                            <motion.div
                                className={`p-4 rounded-xl ${isExpired ? "bg-destructive/10" : "bg-primary/10"
                                    } group-hover:bg-primary/20 transition-all duration-300 shadow-sm`}
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                <Icon className={`h-7 w-7 ${isExpired ? "text-destructive" : "text-primary"}`} />
                            </motion.div>
                            <div className="absolute -bottom-1 -right-1">
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 shadow-sm">
                                    {esCertificado(file) ? "CERTIFICADO" : esArchivoVencimiento(file) ? "VENCIMIENTO" : "ARCHIVO"}
                                </Badge>
                            </div>
                        </div>
                        <Badge variant="outline" className="text-xs font-semibold px-2.5 py-1 bg-background/50 backdrop-blur-sm">
                            .{file.extension.toUpperCase()}
                        </Badge>
                    </div>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <h3
                                    className="font-semibold text-base mb-3 group-hover:text-primary transition-colors truncate">
                                    {file.nombre}
                                </h3>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs">
                                <p>{file.nombre}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-muted/50 border border-border/50">
                        <Truck className="h-6 w-6 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{equipo?.numEconomico}</p>
                            <p className="text-[10px] text-muted-foreground">{equipo?.serie}</p>
                        </div>
                    </div>

                    <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-xs p-2 rounded-md bg-background/50 hover:bg-muted/30 transition-colors">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <FileText className="h-3 w-3" />
                                <span>Tamaño</span>
                            </div>
                            <span className="font-semibold">{formatFileSize(file.peso)}</span>
                        </div>

                        <div className="flex items-center justify-between text-xs p-2 rounded-md bg-background/50 hover:bg-muted/30 transition-colors">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>Actualizado el</span>
                            </div>
                            <span className="font-medium">{format(parseFirebaseDate(file.updatedAt), "PPP", { locale: es })}</span>
                        </div>
                    </div>

                    <AnimatePresence>
                        {hasExpiration && isHovered && file.fecha && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                                className={`absolute inset-0 backdrop-blur-md flex items-center justify-center p-6 ${isExpired ? "bg-destructive/95 border-2 border-destructive" : "bg-card/95 border-2 border-primary/50"
                                    }`}
                            >
                                <div className="text-center">
                                    <motion.div
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                                    >
                                        <Calendar
                                            className={`h-12 w-12 mx-auto mb-3 ${isExpired ? "text-destructive-foreground" : "text-primary"}`}
                                        />
                                    </motion.div>
                                    <p
                                        className={`text-xs font-medium mb-1 ${isExpired ? "text-destructive-foreground/80" : "text-muted-foreground"}`}
                                    >
                                        {isExpired ? "Expired On" : "Expires On"}
                                    </p>
                                    <p
                                        className={`text-lg font-bold mb-3 ${isExpired ? "text-destructive-foreground" : "text-foreground"}`}
                                    >
                                        {format(parseFirebaseDate(file.fecha), "PPP", { locale: es })}
                                    </p>
                                    <Badge variant={isExpired ? "destructive" : "default"} className="text-xs px-3 py-1 shadow-lg">
                                        {isExpired ? "⚠ Expirado" : "✓ En tiempo"}
                                    </Badge>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Separator className="my-4" />

                    <div className="flex items-center gap-1.5">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9 hover:bg-primary/10 hover:text-primary transition-all"
                            onClick={() => setIsPreviewOpen(true)}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        <IframeDocumentDialog
                            equipo={equipo || null}
                            setOpen={setIsPreviewOpen}
                            file={file}
                            open={isPreviewOpen}
                        />

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-9 w-9 hover:bg-primary/10 hover:text-primary transition-all"                                        
                                    >
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Download</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        {/**
                         * <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-9 w-9 hover:bg-primary/10 hover:text-primary transition-all"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit Details</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                         */}

                        <div className="flex-1" />
                        <DeleteDocumentButton file={file} />
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default DocumentCardV2