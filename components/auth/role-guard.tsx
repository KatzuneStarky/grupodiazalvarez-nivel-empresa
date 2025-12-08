"use client"

import { useMenusByArea } from "@/modules/menus/hooks/use-menus-by-area"
import { usePathname, useRouter } from "next/navigation"
import { useEmpresa } from "@/context/empresa-context"
import { useEffect, useState, useMemo } from "react"
import { useArea } from "@/context/area-context"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { RolUsuario } from "@/enum/user-roles"
import { ShieldAlert } from "lucide-react"

interface RoleGuardProps {
    children: React.ReactNode
    permissions?: RolUsuario[]
    checkMenu?: boolean
}

export const RoleGuard = ({ children, permissions = [], checkMenu = true }: RoleGuardProps) => {
    const { rol: authRol, userBdd, isLoading: authLoading } = useAuth()
    const rol = userBdd?.rol;
    const { area, loading: areaLoading } = useArea()
    const { empresa } = useEmpresa()
    const { menus, loading: menusLoading } = useMenusByArea(area?.id)
    const pathname = usePathname()
    const router = useRouter()

    // Explicitly type the state to handle null (loading/unknown), true (allowed), or false (denied)
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

    const currentMenu = useMemo(() => {
        if (!menus || menus.length === 0 || !pathname) return null;

        const decodedPath = decodeURIComponent(pathname).toLowerCase();

        // Sort by path length desc to match most specific path first
        const sortedMenus = [...menus].sort((a, b) => b.path.length - a.path.length);

        return sortedMenus.find(menu => {
            const menuPath = menu.path.toLowerCase();
            return decodedPath === menuPath ||
                (decodedPath.startsWith(menuPath) && decodedPath[menuPath.length] === '/');
        });
    }, [menus, pathname]);

    useEffect(() => {
        // Wait for all necessary data to load
        if (authLoading || areaLoading || (checkMenu && menusLoading)) {
            return;
        }

        // 1. If explicit permissions are provided, check those first
        if (permissions.length > 0) {
            // Guard against null rol
            if (rol && permissions.includes(rol)) {
                setIsAuthorized(true);
                return;
            }
        }

        // 2. If checkMenu is enabled, check against menu configuration
        if (checkMenu) {
            if (currentMenu) {
                const allowedRoles = currentMenu.rolesAllowed || [];

                if (allowedRoles.length > 0) {
                    if (rol && allowedRoles.includes(rol)) {
                        setIsAuthorized(true);
                    } else if (rol === RolUsuario.Super_Admin) {
                        // Super Admin always has access
                        setIsAuthorized(true);
                    } else {
                        setIsAuthorized(false);
                    }
                } else {
                    // No specific roles defined for this menu item -> Allowed
                    setIsAuthorized(true);
                }
            } else {
                // Not a matched menu item path
                // If we also failed permissions check above (or had none), we decide default behavior here.
                // Assuming default allow for non-menu pages unless permissions prop was restricted.

                if (permissions.length === 0) {
                    setIsAuthorized(true);
                } else {
                    // Permissions were checked above and failed
                    setIsAuthorized(false)
                }
            }
        } else {
            // Not checking menu.
            if (permissions.length === 0) {
                setIsAuthorized(true);
            } else {
                // Permissions checked above failed
                setIsAuthorized(false);
            }
        }

    }, [
        rol,
        authLoading,
        areaLoading,
        menusLoading,
        permissions,
        checkMenu,
        currentMenu
    ])

    const handleGoBack = () => {
        router.back();
    }

    if (authLoading || areaLoading || (checkMenu && menusLoading) || isAuthorized === null) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-muted-foreground animate-pulse">Verificando permisos...</p>
            </div>
        );
    }

    if (!isAuthorized) {
        return (
            <div className="flex h-full min-h-[80vh] w-full flex-col items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
                <div className="w-full max-w-lg space-y-8 bg-card/50 backdrop-blur-sm p-8 rounded-xl border shadow-lg">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="rounded-full bg-destructive/10 p-4 ring-1 ring-destructive/20 shadow-xl">
                            <ShieldAlert className="h-12 w-12 text-destructive" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold tracking-tight">
                                Acceso Restringido
                            </h1>
                            <p className="text-muted-foreground text-sm px-4">
                                No tienes permisos para acceder a:
                                <br />
                                <span className="font-semibold text-foreground text-base mt-1 block">
                                    {currentMenu?.title ? currentMenu.title : "Esta sección"}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 p-4 rounded-lg border bg-background/50">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Usuario
                                </span>
                                <p className="font-medium truncate" title={userBdd?.email || ""}>
                                    {userBdd?.nombre || "Usuario"}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {userBdd?.email}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Tu Rol
                                </span>
                                <div className="flex items-center">
                                    <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-500/10 capitalize">
                                        {rol || "No definido"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {currentMenu?.rolesAllowed && currentMenu.rolesAllowed.length > 0 && (
                            <div className="pt-3 border-t space-y-2">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block">
                                    Roles Requeridos
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {currentMenu.rolesAllowed.map((r) => (
                                        <span key={r} className="inline-flex items-center rounded-md bg-destructive/10 text-destructive px-2 py-1 text-xs font-medium ring-1 ring-inset ring-destructive/20 capitalize">
                                            {r}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button
                            onClick={handleGoBack}
                            variant="outline"
                            className="flex-1"
                        >
                            Regresar
                        </Button>
                        <Button
                            onClick={() => router.push(`/${empresa?.nombre || ''}`)}
                            className="flex-1"
                        >
                            Ir al Inicio
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
