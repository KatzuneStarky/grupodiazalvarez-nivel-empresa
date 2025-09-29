"use client"

import DocumentosUsuarioSidebar from "@/modules/usuarios/components/documentos/sidebar"
import DocumentosUsuarioNavbar from "@/modules/usuarios/components/documentos/navbar"
import NewFolderForm from "@/modules/usuarios/components/documentos/new-folder-form"
import { useFileExplorer } from "@/modules/usuarios/hooks/use-file-explorer"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import Icon from "@/components/global/icon"
import { useParams, useRouter } from "next/navigation"
import { Menu } from "lucide-react"
import { useState } from "react"

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import FileToolbar from "@/modules/usuarios/components/documentos/file-toolbar"

const DocumentosLayout = ({ children }: { children: React.ReactNode }) => {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
    const { userBdd } = useAuth()
    const router = useRouter()
    const params = useParams()

    const folderId: string | null = typeof params?.documentId === "string"
        ? params.documentId
        : null;

    const {
        currentPath,
        navigateToPath,
        activeFilter,
        setActiveFilter,
        searchQuery,
        selectedItems,
        setSearchQuery,
        handleToolbarAction,
        setSorting,
        setViewMode,
    } = useFileExplorer()

    const handleNavigateHome = () => {
        router.replace(`/usuario/${userBdd?.nombre}/documentos`)
    }

    return (
        <div className="flex h-screen bg-background">
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                    <div className="fixed left-0 top-0 h-full">
                        <DocumentosUsuarioNavbar
                            currentPath={currentPath}
                            onNavigate={navigateToPath}
                            onNavigateHome={handleNavigateHome}
                        />
                    </div>
                </div>
            )}

            <div className="hidden lg:block">
                <DocumentosUsuarioSidebar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
            </div>
            <div className="flex-1 flex flex-col min-w-0">
                <div className="lg:hidden flex items-center justify-between p-4 border-b bg-card">
                    <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
                        <Menu className="h-5 w-5" />
                    </Button>
                    <h1 className="text-lg font-semibold">File Explorer</h1>
                    <div className="w-10" />
                </div>

                <DocumentosUsuarioNavbar
                    currentPath={currentPath}
                    onNavigate={navigateToPath}
                    onNavigateHome={handleNavigateHome}
                />

                <FileToolbar
                    onUpload={() => handleToolbarAction("upload")}
                    onDownload={() => handleToolbarAction("download")}
                    onShare={() => handleToolbarAction("share")}
                    onDelete={() => handleToolbarAction("delete")}
                    onSortChange={setSorting}
                    onViewModeChange={setViewMode}
                    onSearchChange={setSearchQuery}
                    searchQuery={searchQuery}
                    selectedCount={selectedItems.length}
                    sortBy="name"
                    sortOrder="asc"
                    viewMode="grid"
                />

                <ContextMenu>
                    <ContextMenuTrigger className=" h-full">
                        {children}
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                        <ContextMenuItem asChild>
                            <NewFolderForm
                                className="focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                                button={false}
                                parentId={folderId ?? undefined}
                            />
                        </ContextMenuItem>
                        <ContextMenuItem>
                            <Icon iconName="mingcute:file-new-fill" />
                            Subir archivo
                        </ContextMenuItem>
                        <ContextMenuItem>
                            <Icon iconName="fluent-mdl2:analytics-report" />
                            Analiticas
                        </ContextMenuItem>
                    </ContextMenuContent>
                </ContextMenu>
            </div>
        </div>
    )
}

export default DocumentosLayout