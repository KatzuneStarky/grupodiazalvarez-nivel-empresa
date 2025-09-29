"use client"

import { ChevronDown, Download, FolderPlus, Grid3X3, List, Search, Share, SortAsc, SortDesc, Trash2, Upload } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileExplorerState } from "../../types/file-explorer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { cn } from "@/lib/utils"
import NewFolderForm from "./new-folder-form"

interface FileToolbarProps {
    selectedCount: number
    searchQuery: string
    onSearchChange: (query: string) => void
    viewMode: FileExplorerState["viewMode"]
    onViewModeChange: (mode: FileExplorerState["viewMode"]) => void
    sortBy: FileExplorerState["sortBy"]
    sortOrder: FileExplorerState["sortOrder"]
    onSortChange: (sortBy: FileExplorerState["sortBy"], sortOrder: FileExplorerState["sortOrder"]) => void
    onUpload: () => void
    onDownload: () => void
    onShare: () => void
    onDelete: () => void
}

const FileToolbar = ({
    selectedCount,
    searchQuery,
    onSearchChange,
    viewMode,
    onViewModeChange,
    sortBy,
    sortOrder,
    onSortChange,
    onUpload,
    onDownload,
    onShare,
    onDelete,
}: FileToolbarProps) => {
    const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false)

    const getSortLabel = () => {
        const labels = {
            name: "Name",
            size: "Size",
            lastModified: "Date Modified",
        }
        return labels[sortBy]
    }

    const handleSortChange = (newSortBy: FileExplorerState["sortBy"]) => {
        if (newSortBy === sortBy) {
            onSortChange(sortBy, sortOrder === "asc" ? "desc" : "asc")
        } else {
            onSortChange(newSortBy, "asc")
        }
    }

    return (
        <div className="flex items-center justify-between gap-4 p-4 border-b bg-card">
            <div className="flex items-center gap-2">
                <Button onClick={onUpload} size="sm" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Subir archivo
                </Button>

                <NewFolderForm button />

                {selectedCount > 0 && (
                    <>
                        <div className="h-4 w-px bg-border mx-2" />

                        <Button onClick={onDownload} variant="outline" size="sm" className="gap-2 bg-transparent">
                            <Download className="h-4 w-4" />
                            Download ({selectedCount})
                        </Button>

                        <Button onClick={onShare} variant="outline" size="sm" className="gap-2 bg-transparent">
                            <Share className="h-4 w-4" />
                            Share
                        </Button>

                        <Button
                            onClick={onDelete}
                            variant="outline"
                            size="sm"
                            className="gap-2 text-destructive hover:text-destructive bg-transparent"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </Button>
                    </>
                )}
            </div>

            <div className="flex items-center gap-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar archivos..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        className={cn("pl-10 w-64 transition-all duration-200", isSearchFocused && "w-80")}
                    />
                </div>

                <div className="h-4 w-px bg-border mx-2" />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                            {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                            {getSortLabel()}
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleSortChange("name")}>
                            <div className="flex items-center justify-between w-full">
                                <span>Name</span>
                                {sortBy === "name" && (
                                    <div className="flex items-center">
                                        {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                                    </div>
                                )}
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSortChange("size")}>
                            <div className="flex items-center justify-between w-full">
                                <span>Size</span>
                                {sortBy === "size" && (
                                    <div className="flex items-center">
                                        {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                                    </div>
                                )}
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSortChange("lastModified")}>
                            <div className="flex items-center justify-between w-full">
                                <span>Date Modified</span>
                                {sortBy === "lastModified" && (
                                    <div className="flex items-center">
                                        {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                                    </div>
                                )}
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex items-center border rounded-md">
                    <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => onViewModeChange("grid")}
                        className="rounded-r-none border-r"
                    >
                        <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => onViewModeChange("list")}
                        className="rounded-l-none"
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default FileToolbar