"use client"

import { usePathname } from "next/navigation"
import { Suspense, useState } from "react"
import { cn } from "@/lib/utils"
import { Bell, Code, MenuIcon, Search, Settings, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { navigation } from "@/modules/administracion/constants/menu-data"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AnimatedToggleMode } from "@/components/global/animated-toggle-mode"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)
    const [darkMode, setDarkMode] = useState<boolean>(false)
    const pathname = usePathname()

    return (
        <Suspense>
            <div className="min-h-screen bg-background">
                <aside
                    className={cn(
                        "fixed left-0 top-0 z-40 h-screen border-r border-border bg-card transition-all duration-300",
                        sidebarOpen ? "w-64" : "w-20",
                    )}
                >
                    <div className="flex h-16 items-center justify-between border-b border-border px-4">
                        {sidebarOpen && (
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                    <Code className="h-5 w-5 text-primary-foreground" />
                                </div>
                                <span className="font-semibold text-foreground">ADMINISTRACION</span>
                            </div>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="h-8 w-8">
                            <MenuIcon className="h-4 w-4" />
                        </Button>
                    </div>

                    <nav className="space-y-1 p-3">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link key={item.name} href={item.href}>
                                    <Button
                                        variant={isActive ? "secondary" : "ghost"}
                                        className={cn("w-full justify-start", !sidebarOpen && "justify-center px-2")}
                                    >
                                        <item.icon className={cn("h-5 w-5", sidebarOpen && "mr-3")} />
                                        {sidebarOpen && <span>{item.name}</span>}
                                    </Button>
                                </Link>
                            )
                        })}
                    </nav>

                    {sidebarOpen && (
                        <div className="absolute bottom-4 left-0 right-0 px-3">
                            <div className="rounded-lg border border-border bg-muted p-3">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                        <Shield className="h-4 w-4" />
                                        Modo Administrador
                                    </Badge>
                                </div>
                                <p className="mt-2 text-xs text-muted-foreground">Acceso a todas las funcionalidades</p>
                            </div>
                        </div>
                    )}
                </aside>

                <div className={cn("transition-all duration-300", sidebarOpen ? "ml-64" : "ml-20")}>
                    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <div className="flex h-16 items-center gap-4 px-6">
                            <div className="flex flex-1 items-center gap-4">
                                <div className="relative w-96">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input placeholder="Search tenants, users, modules..." className="pl-10" />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <AnimatedToggleMode />

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="relative">
                                            <Bell className="h-5 w-5" />
                                            <span className="absolute right-1 top-1 flex h-2 w-2">
                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
                                                <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-80">
                                        <div className="p-2">
                                            <p className="font-semibold">Notifications</p>
                                            <p className="text-sm text-muted-foreground">3 unread notifications</p>
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <Button variant="ghost" size="icon">
                                    <Settings className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </header>

                    <main className="p-6">{children}</main>
                </div>
            </div>
        </Suspense>
    )
}

export default AdminLayout