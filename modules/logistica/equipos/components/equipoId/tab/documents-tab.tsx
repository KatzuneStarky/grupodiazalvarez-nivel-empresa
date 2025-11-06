"use client"

import { ArchivosVencimiento } from "@/modules/logistica/bdd/equipos/types/archivos-vencimiento"
import { Certificado } from "@/modules/logistica/bdd/equipos/types/certificados"
import { Archivo } from "@/modules/logistica/bdd/equipos/types/archivos"
import { AlertCircle, FileText, Search, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import DocumentCardV2 from "../../../documentos/components/document-card/document-card-v2"
import { Separator } from "@/components/ui/separator"
import { FileCardSkeleton } from "../../../skeleton/document-card-skeleton"

interface DocumentsTabProps {
    archivosVencimiento: ArchivosVencimiento[] | null
    certificado: Certificado[] | null
    archivos: Archivo[] | null
    searchTerm: string
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>
}

const DocumentsTab = ({
    searchTerm,
    setSearchTerm,
    archivos,
    archivosVencimiento,
    certificado
}: DocumentsTabProps) => {
    return (
        <TabsContent value="documents" className="space-y-4 mt-6">
            <div className="space-y-6">
                <div className="mb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar documentos por nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            Certificados
                        </h3>
                        <Separator className="mb-4" />
                        {certificado && certificado.length === 0 ? (
                            <div>
                                <FileCardSkeleton />
                            </div>
                        ) : (
                            <>
                                {certificado?.map((c) => <DocumentCardV2 key={c.id} file={c} />)}
                            </>
                        )}
                    </div>

                    <div className="col-span-3">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            Archivos con Vencimiento
                        </h3>
                        <Separator className="mb-4" />
                        {archivosVencimiento && archivosVencimiento.length === 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                                <FileCardSkeleton />
                                <FileCardSkeleton />
                                <FileCardSkeleton />
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {archivosVencimiento?.map((a) => <DocumentCardV2 key={a.id} file={a} />)}
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Archivos Generales
                    </h3>
                    <Separator className="mb-4" />
                    {archivos && archivos.length === 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                            <FileCardSkeleton />
                            <FileCardSkeleton />
                            <FileCardSkeleton />
                            <FileCardSkeleton />
                            <FileCardSkeleton />
                            <FileCardSkeleton />
                            <FileCardSkeleton />
                            <FileCardSkeleton />
                            <FileCardSkeleton />
                            <FileCardSkeleton />
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                            {archivos?.map((a) => <DocumentCardV2 key={a.id} file={a} />)}
                        </div>
                    )}
                </div>
            </div>
        </TabsContent>
    )
}

export default DocumentsTab