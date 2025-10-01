"use client"

import { useFileExplorer } from "@/modules/usuarios/hooks/use-file-explorer"
import FileCard from "@/modules/usuarios/components/documentos/file-card"
import { Calendar, FileText, FolderOpen, Hash } from "lucide-react"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { Separator } from "@/components/ui/separator"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { use, useEffect, useState } from "react"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

const DocumentPage = ({ params }: { params: Promise<{ documentId: string }> }) => {
    const { documentId } = use(params)

    const [rootFolderId, setRootFolderId] = useState<string | null>(null);

    const {
        files,
        searchQuery,
        activeFilter,
        viewMode = "grid",
        selectedItems,
        selectFile,
        handleFileAction,
        handleFileClick
    } = useFileExplorer()

    const rootId = rootFolderId ? rootFolderId: documentId
    const currentFolder = files.find(f => f.type === "folder" && f.id === rootId);
    const isRootFolder = currentFolder?.parentId == null;

    useEffect(() => {
        if (isRootFolder && currentFolder?.id) {
            localStorage.setItem("rootFolderId", currentFolder.id);
            setRootFolderId(currentFolder.id);
        }
    }, [currentFolder, isRootFolder]);

    useEffect(() => {
        const storedRoot = localStorage.getItem("rootFolderId");
        if (storedRoot) setRootFolderId(storedRoot);
    }, []);

    const childrenCount = currentFolder?.children?.length;

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex flex-col">
                <span>{isRootFolder ? "si" : "no"}</span>
                <span>{rootFolderId}</span>
                <span>{documentId}</span>
            </div>
            <div className="mb-6 p-6 rounded-2xl glass-effect border border-white/20 shadow-lg">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                            <FolderOpen className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold text-foreground mb-2 text-balance">{currentFolder?.name}</h2>
                        {currentFolder?.description && (
                            <p className="text-sm text-muted-foreground mb-4 leading-relaxed text-pretty">{currentFolder.description}</p>
                        )}

                        {currentFolder?.tags && currentFolder.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {currentFolder.tags.map((tag, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="rounded-lg px-3 py-1 text-xs font-medium bg-white/10 hover:bg-white/20 border border-white/20"
                                    >
                                        <Hash className="w-3 h-3 mr-1" />
                                        {tag.text}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>Modificado {formatDistanceToNow(parseFirebaseDate(currentFolder?.lastModified), { addSuffix: true, locale: es })}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                <span>
                                    {childrenCount} {childrenCount === 1 ? "archivo" : "archivos"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Separator className="my-4" />
            {currentFolder?.children && currentFolder.children.length > 0 ? (
                <div className={cn(
                    "gap-6 p-4",
                    viewMode === "grid"
                        ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7"
                        : "space-y-3",
                )}>
                    {currentFolder.children.map((child) => (
                        <FileCard
                            key={child.id}
                            file={child}
                            isSelected={selectedItems.includes(child.id)}
                            viewMode={viewMode}
                            onSelect={selectFile}
                            onClick={handleFileClick}
                            onAction={handleFileAction}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
                    <div className="text-8xl mb-6 opacity-50">📁</div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">No se encontraron archivos</h3>
                    <p className="text-sm text-center max-w-md leading-relaxed">
                        {searchQuery
                            ? `Ningun archivo coincide con la busqueda "${searchQuery}"`
                            : activeFilter === "all"
                                ? "Este folder esta vacio. Sube archivos o crea una carpeta para empezar"
                                : `No hay archivos en ${activeFilter}.`}
                    </p>
                </div>
            )}
        </div>
    )
}

export default DocumentPage