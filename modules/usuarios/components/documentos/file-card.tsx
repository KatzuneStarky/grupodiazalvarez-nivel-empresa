"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, Edit3, MoreHorizontal, Share, Trash2 } from "lucide-react"
import { getFileCardStyle } from "@/functions/get-file-card-style"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { formatFileSize } from "@/utils/format-file-size"
import { FileAction } from "../../types/file-actions"
import { Separator } from "@/components/ui/separator"
import { getFileIcon } from "@/constants/file-icons"
import { Checkbox } from "@/components/ui/checkbox"
import { FileItem } from "../../types/file-item"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { es } from "date-fns/locale"
import { format } from "date-fns"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface FileCardProps {
    file: FileItem
    isSelected?: boolean
    viewMode?: "grid" | "list"
    onSelect?: (fileId: string, selected: boolean) => void
    onClick?: (file: FileItem) => void
    onAction?: (action: FileAction, file: FileItem) => void
}

const FileCard = ({
    file,
    isSelected = false,
    viewMode = "grid",
    onSelect,
    onClick,
    onAction
}: FileCardProps) => {
    const [isHovered, setIsHovered] = useState<boolean>(false)
    const IconComponent = getFileIcon(file.name, file.type)
    const { cardClass, iconClass } = getFileCardStyle(file)

    const handleCardClick = (e: React.MouseEvent) => {
        if (e.target instanceof HTMLElement && e.target.closest("[data-action-menu]")) {
            return
        }
        onClick?.(file)
    }

    const handleCheckboxChange = (checked: boolean) => {
        onSelect?.(file.id, checked)
    }

    const handleAction = (action: FileAction) => {
        onAction?.(action, file)
    }

    if (viewMode === "list") {
        return (
            <div
                className={cn(
                    "group flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 cursor-pointer",
                    cardClass,
                    "border backdrop-blur-sm",
                    isSelected && "ring-2 ring-primary/50 shadow-lg shadow-primary/20",
                )}
                onClick={handleCardClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={handleCheckboxChange}
                        className={cn(
                            "transition-all duration-300 scale-110",
                            !isSelected && !isHovered && "opacity-0 group-hover:opacity-100 group-hover:scale-100",
                        )}
                    />

                    <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className={cn("p-3 rounded-xl transition-all duration-300 shadow-sm", cardClass)}>
                            <IconComponent className={cn("h-5 w-5", iconClass)} />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-foreground truncate">{file.name}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-16 text-center font-medium">{file.size ? formatFileSize(file.size) : "—"}</span>
                    <Separator orientation="vertical" />
                    <span className="w-54 text-center">
                        {format(parseFirebaseDate(file.lastModified), "PPP", { locale: es })}
                    </span>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    "h-9 w-9 p-0 transition-all duration-300 rounded-xl",
                                    "hover:bg-black/10 hover:backdrop-blur-sm hover:shadow-sm",
                                    !isHovered && "opacity-0 group-hover:opacity-100",
                                )}
                                data-action-menu
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 backdrop-blur-md bg-card/95 border-border/50">
                            <DropdownMenuItem onClick={() => handleAction("preview")}>
                                <Edit3 className="mr-2 h-4 w-4" />
                                {file.type === "folder" ? "Open" : "Preview"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction("rename")}>
                                <Edit3 className="mr-2 h-4 w-4" />
                                Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction("download")}>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction("share")}>
                                <Share className="mr-2 h-4 w-4" />
                                Share
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => handleAction("delete")}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        )
    }

    return (
        <Card
            className={cn(
                "group relative p-4 cursor-pointer transition-all duration-300",
                cardClass,
                isSelected && "ring-2 ring-primary/60 shadow-xl shadow-primary/25 scale-105",
            )}
            onClick={handleCardClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex flex-col">
                <div className="flex items-center justify-between w-full">
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={handleCheckboxChange}
                        className={cn(
                            "transition-all duration-300",
                            !isSelected && !isHovered && "opacity-0 group-hover:opacity-100",
                        )}
                    />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    "h-9 w-9 p-0 transition-all duration-300 rounded-xl",
                                    !isHovered && "opacity-0 group-hover:opacity-100",
                                )}
                                data-action-menu
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48 backdrop-blur-md bg-card/95 border-border/50">
                            <DropdownMenuItem onClick={() => handleAction("preview")}>
                                <Edit3 className="mr-2 h-4 w-4" />
                                {file.type === "folder" ? "Open" : "Preview"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction("rename")}>
                                <Edit3 className="mr-2 h-4 w-4" />
                                Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction("download")}>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction("share")}>
                                <Share className="mr-2 h-4 w-4" />
                                Share
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => handleAction("delete")}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex flex-col items-center">
                    <div
                        className={cn(
                            "rounded-2xl transition-all duration-300",
                            cardClass,
                        )}
                    >
                        <IconComponent className={cn("h-12 w-12", iconClass)} />
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-sm font-bold text-foreground truncate text-center leading-relaxed">{file.name}</p>

                    <div className={cn(
                        "flex items-center text-xs text-muted-foreground/80",
                        file.size ? "justify-between" : "justify-center"
                    )}>
                        {file.size && <span className="font-medium">{file.size ? formatFileSize(file.size) : ""}</span>}
                        <span>{format(parseFirebaseDate(file.lastModified), "PPP", { locale: es })}</span>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default FileCard