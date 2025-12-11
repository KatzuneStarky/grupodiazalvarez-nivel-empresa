"use client"

import { useAuth } from "@/context/auth-context"
import { useEmpresa } from "@/context/empresa-context"
import { RolUsuario } from "@/enum/user-roles"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2, ShieldX, UserX, Building2, Clock } from "lucide-react"
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

    // Auto-redirect when company is assigned
    useEffect(() => {
        const handleAutoRedirect = async () => {
            if (userBdd?.empresaId && !empresaLoading && (!empresa || empresa.id !== userBdd.empresaId)) {
                try {
                    // Fetch the assigned company to get its slug
                    const { doc, getDoc } = await import("firebase/firestore")
                    const { db } = await import("@/firebase/client")

                    const companyDoc = await getDoc(doc(db, "empresas", userBdd.empresaId))
                    if (companyDoc.exists()) {
                        const companyData = companyDoc.data()
                        if (companyData.nombre) {
                            router.push(`/${companyData.nombre}`)
                        }
                    }
                } catch (error) {
                    console.error("Error auto-redirecting to assigned company:", error)
                }
            }
        }

        handleAutoRedirect()
    }, [userBdd?.empresaId, empresa, empresaLoading, router])

    // Timer logic for waiting screen
    const [elapsedTime, setElapsedTime] = useState(0)

    useEffect(() => {
        const startTime = Date.now()
        const interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000)
            setElapsedTime(elapsed)
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const remainingSeconds = seconds % 60
        return {
            hours: hours.toString().padStart(2, "0"),
            minutes: minutes.toString().padStart(2, "0"),
            seconds: remainingSeconds.toString().padStart(2, "0"),
        }
    }
    const { hours, minutes, seconds } = formatTime(elapsedTime)

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

    // Sin empresa asignada (Waiting Screen)
    if (accessStatus === 'no_empresa') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
                <div className="w-full max-w-lg bg-card rounded-xl border shadow-sm">
                    <div className="p-6 text-center space-y-4">
                        <div className="mx-auto w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                            <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                Esperando asignación
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Tu cuenta ha sido creada exitosamente, pero aún no tienes una empresa asignada.
                                <br />
                                Por favor espera a que un administrador te asigne.
                            </p>
                        </div>
                    </div>

                    <div className="px-6 py-4 space-y-6">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tiempo en espera</span>
                            </div>
                            <div className="font-mono text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-wider">
                                {hours}:{minutes}:{seconds}
                            </div>
                            <div className="flex justify-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                <span>Horas</span>
                                <span>Minutos</span>
                                <span>Segundos</span>
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
                                Si crees que esto es un error, contacta a tu supervisor o administrador.
                            </p>

                            <Button variant="outline" className="w-full" onClick={() => router.push("/")}>
                                Regresar al inicio
                            </Button>
                        </div>
                    </div>
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
