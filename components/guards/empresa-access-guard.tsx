"use client"

import { useAuth } from "@/context/auth-context"
import { useEmpresa } from "@/context/empresa-context"
import { RolUsuario } from "@/enum/user-roles"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2, ShieldX, UserX, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmpresaAccessGuardProps {
    children: React.ReactNode
}

// Roles que tienen acceso a todas las empresas sin restricción
const ROLES_SIN_RESTRICCION = [
    RolUsuario.Super_Admin,
]

export const EmpresaAccessGuard = ({ children }: EmpresaAccessGuardProps) => {
    const { userBdd, isLoading: authLoading, currentUser } = useAuth()
    const { empresa, loading: empresaLoading } = useEmpresa()
    const router = useRouter()

    const [accessStatus, setAccessStatus] = useState<'loading' | 'granted' | 'no_auth' | 'no_empresa' | 'no_access'>('loading')

    useEffect(() => {
        const checkAccess = () => {
            // Esperar a que carguen los datos de autenticación
            if (authLoading) {
                return
            }

            // Si no hay usuario autenticado, denegar acceso
            if (!currentUser || !userBdd) {
                setAccessStatus('no_auth')
                return
            }

            // Super Admin tiene acceso a todo
            if (ROLES_SIN_RESTRICCION.includes(userBdd.rol)) {
                setAccessStatus('granted')
                return
            }

            // Si el usuario no tiene empresa asignada
            if (!userBdd.empresaId) {
                setAccessStatus('no_empresa')
                return
            }

            // Esperar a que cargue la empresa
            if (empresaLoading) {
                return
            }

            // Si no se encontró la empresa
            if (!empresa) {
                setAccessStatus('no_access')
                return
            }

            // Verificar que el usuario pertenece a esta empresa
            if (userBdd.empresaId !== empresa.id) {
                setAccessStatus('no_access')
                return
            }

            // Todo correcto, tiene acceso
            setAccessStatus('granted')
        }

        checkAccess()
    }, [userBdd, empresa, authLoading, empresaLoading, currentUser])

    // Loading
    if (accessStatus === 'loading' || authLoading || empresaLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-muted-foreground">Verificando acceso...</p>
            </div>
        )
    }

    // No autenticado
    if (accessStatus === 'no_auth') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-6">
                <div className="flex flex-col items-center gap-4">
                    <div className="rounded-full bg-destructive/10 p-4">
                        <UserX className="h-12 w-12 text-destructive" />
                    </div>
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-semibold">Sesión Requerida</h2>
                        <p className="text-muted-foreground max-w-md">
                            Debes iniciar sesión para acceder a esta sección.
                        </p>
                    </div>
                </div>
                <Button onClick={() => router.push("/entrar")}>
                    Iniciar Sesión
                </Button>
            </div>
        )
    }

    // Sin empresa asignada
    if (accessStatus === 'no_empresa') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-6">
                <div className="flex flex-col items-center gap-4">
                    <div className="rounded-full bg-amber-500/10 p-4">
                        <Building2 className="h-12 w-12 text-amber-500" />
                    </div>
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-semibold">Sin Empresa Asignada</h2>
                        <p className="text-muted-foreground max-w-md">
                            Tu cuenta no tiene una empresa asignada.
                            Contacta con tu administrador para que te asigne a una empresa.
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => router.push("/usuario")}>
                        Ir a mi perfil
                    </Button>
                </div>
            </div>
        )
    }

    // Sin acceso a esta empresa
    if (accessStatus === 'no_access') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-6">
                <div className="flex flex-col items-center gap-4">
                    <div className="rounded-full bg-destructive/10 p-4">
                        <ShieldX className="h-12 w-12 text-destructive" />
                    </div>
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-semibold">Acceso Restringido</h2>
                        <p className="text-muted-foreground max-w-md">
                            No tienes permisos para acceder a esta empresa.
                            Solo puedes acceder a la empresa a la que estás asignado.
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => router.back()}>
                        Volver
                    </Button>
                    <Button onClick={() => router.push("/usuario")}>
                        Ir a mi perfil
                    </Button>
                </div>
            </div>
        )
    }

    // Acceso concedido
    return <>{children}</>
}
