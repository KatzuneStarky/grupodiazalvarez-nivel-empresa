"use client"

import DocumentosUsuarioSidebar from "@/modules/usuarios/components/documentos/sidebar"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"
import DocumentosUsuarioNavbar from "@/modules/usuarios/components/documentos/navbar"

const DocumentosLayout = ({ children }: { children: React.ReactNode }) => {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)

    return (
        <div className="flex h-screen bg-background">
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                    <div className="fixed left-0 top-0 h-full">
                        {/** <DocumentosUsuarioSidebar activeFilter={activeFilter} onFilterChange={setActiveFilter} /> */}
                    </div>
                </div>
            )}

            <div className="hidden lg:block">
                <DocumentosUsuarioSidebar activeFilter={""} onFilterChange={() => { }} />
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
                    currentPath={[""]}
                    onNavigate={() =>{}}
                    onNavigateHome={() =>{}}
                />

                {children}
            </div>
        </div>
    )
}

export default DocumentosLayout