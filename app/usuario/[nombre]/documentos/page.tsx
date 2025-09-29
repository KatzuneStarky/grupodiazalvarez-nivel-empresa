"use client"

import { useFileExplorer } from "@/modules/usuarios/hooks/use-file-explorer"
import FileCard from "@/modules/usuarios/components/documentos/file-card"
import { cn } from "@/lib/utils"

const DocumentosUsuarioPage = () => {
    const {
        currentFiles,
        searchQuery,
        activeFilter,
        viewMode,
        selectedItems,
        handleFileClick,
        handleFileAction,
        selectFile
    } = useFileExplorer()

    return (
        <div className="flex-1">
            {currentFiles.length === 0 ? (
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
            ) : (
                <div
                    className={cn(
                        "gap-6 p-4",
                        viewMode === "grid"
                            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7"
                            : "space-y-3",
                    )}
                >
                    {currentFiles.map((file) => (
                        <FileCard
                            key={file.id}
                            file={file}
                            isSelected={selectedItems.includes(file.id)}
                            viewMode={viewMode}
                            onSelect={selectFile}
                            onClick={handleFileClick}
                            onAction={handleFileAction}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default DocumentosUsuarioPage