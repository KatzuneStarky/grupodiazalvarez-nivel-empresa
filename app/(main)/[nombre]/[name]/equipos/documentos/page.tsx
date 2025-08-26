"use client"

import { useDocumentsDashboard } from "@/modules/logistica/equipos/documentos/hooks/use-documents-dashboard"
import DocumentsChart from "@/modules/logistica/equipos/documentos/components/charts/documents-charts"
import ArchivosChart from "@/modules/logistica/equipos/documentos/components/charts/archivos-chart"
import MoreEquiposCard from "@/modules/logistica/equipos/documentos/components/more-equipos-card"
import DocumentCard from "@/modules/logistica/equipos/documentos/components/document-card"
import FolderCard from "@/modules/logistica/equipos/documentos/components/folder-card"
import { useEquipos } from "@/modules/logistica/bdd/equipos/hooks/use-equipos"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Search } from "lucide-react"

const DocumentosEquiposPage = () => {
    const { 
        equipos,
        isLoading: isLoadingEquipos,
        error: errorEquipos
    } = useEquipos()
    const {
        errorEquiposFolder,
        first18Archivos,
        errorArchivos,
        first6Folders,
        isLoadingData,
        recentFolders,
        sortedFolders,
        allArchivos,
        folders
    } = useDocumentsDashboard()

    return (
        <div className="container mx-auto space-y-4 my-6">
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-2/3 space-y-6">
                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold mb-4">Carpetas recientes</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4">
                            {first6Folders.map((folder, index) => (
                                <FolderCard key={`${folder.id} - ${index}`} folder={folder} />
                            ))}

                            <MoreEquiposCard equipos={equipos} />
                        </div>
                    </section>

                    <Separator />

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Archivos recientes</h2>
                        <div className="space-y-2 p-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {first18Archivos.map((a, index) => (
                                    <DocumentCard file={a} key={`${a.id} - ${index}`} />
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                <div className="lg:w-1/3 space-y-6">
                    <Card className="p-4">
                        <div className="flex items-center justify-end w-full">
                            {/** <CreateNewFile /> */}
                        </div>
                        <div className="relative mt-4">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search files..." className="pl-8" />
                        </div>
                    </Card>

                    <DocumentsChart />
                    <ArchivosChart />
                </div>
            </div>
        </div>
    )
}

export default DocumentosEquiposPage