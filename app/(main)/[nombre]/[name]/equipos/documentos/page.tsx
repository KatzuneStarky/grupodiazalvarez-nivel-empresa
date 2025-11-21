"use client"

import DocumentCardV2 from "@/modules/logistica/equipos/documentos/components/document-card/document-card-v2"
import { useDocumentsDashboard } from "@/modules/logistica/equipos/documentos/hooks/use-documents-dashboard"
import { NewDocumentDialog } from "@/modules/logistica/equipos/documentos/components/new-document-dialog"
import DocumentsChart from "@/modules/logistica/equipos/documentos/components/charts/documents-charts"
import ArchivosChart from "@/modules/logistica/equipos/documentos/components/charts/archivos-chart"
import MoreEquiposCard from "@/modules/logistica/equipos/documentos/components/more-equipos-card"
import FolderCard from "@/modules/logistica/equipos/documentos/components/folder-card"
import { useEquipos } from "@/modules/logistica/bdd/equipos/hooks/use-equipos"
import PageTitle from "@/components/custom/page-title"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Icon from "@/components/global/icon"
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
        <div className="space-y-4 sm:space-y-6 m-4 sm:m-6">
            <PageTitle
                title="Documentacion de equipos"
                description="Administre y maneje la documentacion del parque vehicular"
                icon={
                    <Icon iconName="streamline-ultimate:coding-apps-website-data-conversion-documents-1" className="h-12 w-12" />
                }
                hasActions={true}
                actions={
                    <>
                        <NewDocumentDialog>
                            <Button className="sm:w-auto">
                                <Icon iconName="famicons:documents" className="w-4 h-4 mr-2" />
                                Agregar documento
                            </Button>
                        </NewDocumentDialog>
                    </>
                }
            />

            <Separator className="my-4 sm:my-6" />

            <div className="flex flex-col gap-4 sm:gap-6">
                {/* Main Section */}
                <section className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
                        {/* Folders Grid - 3 columns on XL, full width on smaller screens */}
                        <div className="xl:col-span-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {first6Folders.map((folder, index) => (
                                    <FolderCard key={`${folder.id} - ${index}`} folder={folder} />
                                ))}

                                <MoreEquiposCard equipos={equipos} />
                            </div>
                        </div>

                        {/* Charts Column - 1 column on XL, full width on smaller screens */}
                        <div className="xl:col-span-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4 sm:gap-6">
                                <div className="space-y-4">
                                    <Card className="p-4">
                                        <div className="relative">
                                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="Buscar archivos" className="pl-8" />
                                        </div>
                                    </Card>

                                    <DocumentsChart />
                                </div>
                                <ArchivosChart />
                            </div>
                        </div>
                    </div>
                </section>

                <Separator />

                {/* Recent Files Section */}
                <section className="space-y-4 sm:space-y-6">
                    <PageTitle
                        title="Archivos recientes"
                        description="Listado de los archivos mas recientes subidos al sistema"
                        icon={
                            <Icon iconName="fontisto:file-1" className="h-12 w-12" />
                        }
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
                        {first18Archivos.map((a, index) => (
                            <DocumentCardV2 file={a} key={`${a.id} - ${index}`} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}

export default DocumentosEquiposPage