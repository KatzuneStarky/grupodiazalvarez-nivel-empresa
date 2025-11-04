"use client"

import { ArchivosVencimiento } from "@/modules/logistica/bdd/equipos/types/archivos-vencimiento"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Certificado } from "@/modules/logistica/bdd/equipos/types/certificados"
import { Archivo } from "@/modules/logistica/bdd/equipos/types/archivos"
import { Equipo } from "@/modules/logistica/bdd/equipos/types/equipos"
import { formatFileSize } from "@/constants/file-icons"
import { Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface DialogProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    file: Archivo | Certificado | ArchivosVencimiento
    equipo: Equipo | null
}

const IframeDocumentDialog = ({
    open,
    setOpen,
    file,
    equipo
}: DialogProps) => {
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0">
                <DialogHeader className="px-6 pt-6 pb-4 border-b">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <DialogTitle className="text-xl font-semibold mb-2 text-balance">{file.nombre}</DialogTitle>
                            <div className="flex items-center gap-3 flex-wrap">
                                <Badge variant="outline" className="text-xs">
                                    .{file.extension.toUpperCase()}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{formatFileSize(file.peso)}</span>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">{equipo?.numEconomico}</span>
                            </div>
                        </div>
                    </div>
                </DialogHeader>
                <div className="flex-1 overflow-hidden bg-muted/30">
                    {file.ruta ? (
                        <iframe
                            src={file.ruta!}
                            className="w-full h-full border-0"
                            title={`Preview of ${file.nombre}`}
                            sandbox="allow-same-origin allow-scripts"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center p-8">
                                <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                                <h3 className="text-lg font-semibold mb-2">Preview Not Available</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    This file type cannot be previewed in the browser.
                                </p>
                                <Button variant="outline" size="sm">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download to View
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default IframeDocumentDialog