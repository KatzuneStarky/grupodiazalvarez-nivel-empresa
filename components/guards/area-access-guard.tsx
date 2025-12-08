"use client"

import { useAuth } from "@/context/auth-context"
import { useArea } from "@/context/area-context"
import { RolUsuario } from "@/enum/user-roles"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2, ShieldX } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AreaAccessGuardProps {
    children: React.ReactNode
    empresaName: string
}

// Roles que tienen acceso a todas las áreas sin restricción
const ROLES_SIN_RESTRICCION = [
    RolUsuario.Super_Admin,
    RolUsuario.Admin,
]

export const AreaAccessGuard = ({ children, empresaName }: AreaAccessGuardProps) => {
    const { userBdd, isLoading: authLoading } = useAuth()
    const { area, loading: areaLoading } = useArea()
    const router = useRouter()

    const [hasAccess, setHasAccess] = useState<boolean | null>(null)
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        const checkAccess = () => {
            // Esperar a que carguen los datos
            if (authLoading || areaLoading) {
                return
            }

            // Si no hay usuario autenticado, redirigir a login
            if (!userBdd) {
                router.push("/entrar")
                return
            }

            // Si no hay área cargada, esperar
            if (!area) {
                setChecking(false)
                setHasAccess(false)
                return
            }

            // Roles sin restricción tienen acceso a todas las áreas
            if (ROLES_SIN_RESTRICCION.includes(userBdd.rol)) {
                setHasAccess(true)
                setChecking(false)
                return
            }

            // Verificar si el usuario está en el array de usuarios del área
            // usuarios es un array de strings (UIDs)
            const usuariosDelArea = area.usuarios || []
            const usuarioEnArea = usuariosDelArea.includes(userBdd.uid)

            setHasAccess(usuarioEnArea)
            setChecking(false)
        }

        checkAccess()
    }, [userBdd, area, authLoading, areaLoading, router])

    // Mostrar loading mientras se verifican los permisos
    if (checking || authLoading || areaLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-muted-foreground">Verificando permisos de acceso...</p>
            </div>
        )
    }

    // Si no tiene acceso, mostrar mensaje de acceso denegado
    if (!hasAccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                <div className="flex flex-col items-center gap-4">
                    <div className="rounded-full bg-destructive/10 p-4">
                        <ShieldX className="h-12 w-12 text-destructive" />
                    </div>
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-semibold">Acceso Restringido</h2>
                        <p className="text-muted-foreground max-w-md">
                            No tienes permisos para acceder a esta área.
                            Contacta con tu administrador si crees que deberías tener acceso.
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Volver
                    </Button>
                    <Button
                        onClick={() => router.push(`/${empresaName}`)}
                    >
                        Ir al inicio
                    </Button>
                </div>
            </div>
        )
    }

    // Si tiene acceso, renderizar el contenido
    return <>{children}</>
}
