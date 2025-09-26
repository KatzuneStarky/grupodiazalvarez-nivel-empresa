"use client"

import { Clock, Files, HardDrive, Star, Trash2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Icon from "@/components/global/icon"
import { cn } from "@/lib/utils"

interface FileSidebarProps {
    activeFilter: string
    onFilterChange: (filter: string) => void
}

const sidebarItems = [
    {
        id: "all",
        label: "Todos los archivos",
        icon: Files,
        count: null,
    },
    {
        id: "recent",
        label: "Reciente",
        icon: Clock,
        count: null,
    },
    {
        id: "starred",
        label: "Favoritos",
        icon: Star,
        count: null,
    },
    {
        id: "shared",
        label: "Compartido conmigo",
        icon: Users,
        count: null,
    },
    {
        id: "trash",
        label: "Papelera",
        icon: Trash2,
        count: null,
    },
]

const storageInfo = {
    used: 15.2,
    total: 100,
    unit: "GB",
}

const DocumentosUsuarioSidebar = ({ activeFilter, onFilterChange }: FileSidebarProps) => {
    const storagePercentage = (storageInfo.used / storageInfo.total) * 100

    return (
        <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
            <div className="p-4 border-b border-sidebar-border">
                <h2 className="flex gap-2 items-center text-lg font-semibold text-sidebar-foreground">
                    <Icon iconName="mdi:folder-file-outline" />
                    Mis documentos
                </h2>
            </div>

            <div className="flex-1 p-4">
                <nav className="space-y-1">
                    {sidebarItems.map((item) => {
                        const IconComponent = item.icon
                        const isActive = activeFilter === item.id

                        return (
                            <Button
                                key={item.id}
                                variant={isActive ? "default" : "ghost"}
                                className={cn(
                                    "w-full justify-start gap-3 h-10 px-3",
                                    isActive
                                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                )}
                                onClick={() => onFilterChange(item.id)}
                            >
                                <IconComponent className="h-4 w-4" />
                                <span className="flex-1 text-left">{item.label}</span>
                                {item.count && (
                                    <span className="text-xs bg-sidebar-accent text-sidebar-accent-foreground px-2 py-1 rounded-full">
                                        {item.count}
                                    </span>
                                )}
                            </Button>
                        )
                    })}
                </nav>
            </div>

            <div className="p-4 border-t border-sidebar-border">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-sidebar-foreground">
                        <HardDrive className="h-4 w-4" />
                        <span>Almacenamiento</span>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-sidebar-foreground">
                            <span>
                                {storageInfo.used} {storageInfo.unit} usado
                            </span>
                            <span>
                                {storageInfo.total} {storageInfo.unit}
                            </span>
                        </div>

                        <div className="w-full bg-sidebar-accent rounded-full h-2">
                            <div
                                className="bg-sidebar-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${storagePercentage}%` }}
                            />
                        </div>

                        <p className="text-xs text-sidebar-foreground/70">
                            {(storageInfo.total - storageInfo.used).toFixed(1)} {storageInfo.unit} disponible
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DocumentosUsuarioSidebar