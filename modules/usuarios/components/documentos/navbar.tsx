"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, ChevronRight, Cog, File, Home, LogOut, UserCircle } from "lucide-react"
import { AnimatedToggleMode } from "@/components/global/animated-toggle-mode"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { truncateText } from "@/utils/truncate-text"

interface BreadcrumbNavigationProps {
    currentPath: string[]
    onNavigate: (pathIndex: number) => void
    onNavigateHome: () => void
}

const DocumentosUsuarioNavbar = ({ currentPath, onNavigate, onNavigateHome }: BreadcrumbNavigationProps) => {
    const { userBdd, logout } = useAuth()
    const router = useRouter()

    return (
        <div className="flex items-center justify-between border-b bg-card overflow-x-auto">
            <div className="flex items-center gap-1 p-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onNavigateHome}
                    className="gap-2 flex-shrink-0 text-muted-foreground hover:text-foreground"
                >
                    <Home className="h-4 w-4" />
                    <span className="hidden sm:inline">Home</span>
                </Button>

                {currentPath.map((segment, index) => (
                    <div key={index} className="flex items-center gap-1 flex-shrink-0">
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onNavigate(index)}
                            className={cn(
                                "text-muted-foreground hover:text-foreground",
                                index === currentPath.length - 1 && "text-foreground font-medium",
                            )}
                        >
                            {segment}
                        </Button>
                    </div>
                ))}
            </div>

            <div className="flex items-center mx-4 gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            size="default"
                            variant={"ghost"}
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={userBdd?.avatarUrl} alt="User" />
                                <AvatarFallback className="rounded-lg">{userBdd?.nombre?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <ChevronDown className="ml-auto size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side="bottom"
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={userBdd?.avatarUrl} alt="User" />
                                    <AvatarFallback className="rounded-lg">{userBdd?.nombre?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{userBdd?.nombre}</span>
                                    <span className="truncate text-xs">{userBdd?.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push(`/usuario/${userBdd?.nombre}`)}>
                            <UserCircle className="mr-2 h-4 w-4" />
                            Perfil
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/usuario/${userBdd?.nombre}/documentos`)}>
                            <File className="mr-2 h-4 w-4" />
                            Mis documentos
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Cog className="mr-2 h-4 w-4" />
                            Configuracion
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => logout()}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Salir
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <AnimatedToggleMode />
            </div>
        </div>
    )
}

export default DocumentosUsuarioNavbar