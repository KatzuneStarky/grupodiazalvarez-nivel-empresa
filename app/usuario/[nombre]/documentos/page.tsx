"use client"

import FileToolbar from "@/modules/usuarios/components/documentos/file-toolbar"
import { useFileExplorer } from "@/modules/usuarios/hooks/use-file-explorer"
import { useAuth } from "@/context/auth-context"
import { cn } from "@/lib/utils"

const DocumentosUsuarioPage = () => {
    const { currentUser } = useAuth()
    const {
        currentFiles,
        searchQuery,
        activeFilter,
        viewMode
    } = useFileExplorer({ userId: currentUser?.uid || "" })

    return (
        <div className="flex-1 overflow-auto">
            <FileToolbar
                onDelete={() => { }}
                onDownload={() => { }}
                onSearchChange={() => { }}
                onShare={() => { }}
                onSortChange={() => { }}
                onUpload={() => { }}
                onViewModeChange={() => { }}
                searchQuery=""
                selectedCount={0}
                sortBy="name"
                sortOrder="asc"
                viewMode="grid"
            />

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
                        "gap-6",
                        viewMode === "grid"
                            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7"
                            : "space-y-3",
                    )}
                >
                    {currentFiles.map((file) => (
                        <div key={file.id}>
                            
                            {/**
                            <FileCard
                            key={file.id}
                            file={file}
                            isSelected={selectedItems.includes(file.id)}
                            viewMode={viewMode}
                            onSelect={selectFile}
                            onClick={handleFileClick}
                            onAction={handleFileAction}
                        /> */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default DocumentosUsuarioPage