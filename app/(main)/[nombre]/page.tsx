"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedToggleMode } from '@/components/global/animated-toggle-mode';
import { ContactInfoInput } from '@/modules/empresas/types/contactos';
import { LoadingState } from '@/components/skeleton/loading-state';
import { Clock, Home, Mail, Phone, Shield } from 'lucide-react';
import { useEmpresa } from '@/context/empresa-context';
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { RolUsuario } from '@/enum/user-roles';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const MainPage = () => {
    const [contactoAdminstrador, setContactoAdministrador] = useState<ContactInfoInput | null>(null)
    const [isValidUser, setIsValidUser] = useState<boolean>(false)
    const [elapsedTime, setElapsedTime] = useState(0)

    const { empresa, loading } = useEmpresa()
    const { userBdd } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && userBdd && empresa) {
            const isSuperAdmin = userBdd.rol === RolUsuario.Super_Admin
            const isAdmin = userBdd.rol === RolUsuario.Admin

            if (isSuperAdmin || isAdmin) {
                setIsValidUser(true)
                if (empresa.areas && empresa.areas.length > 0) {
                    router.push(`/${empresa.nombre}/${empresa.areas[0].nombre}`)
                }
                return
            }

            // Verificar si el usuario pertenece a la empresa
            const userInCompany = empresa.usuarios?.some((u: any) =>
                (typeof u === 'string' ? u === userBdd.uid : u.uid === userBdd.uid)
            )

            if (userInCompany) {
                setIsValidUser(true)
                if (empresa.areas && empresa.areas.length > 0) {
                    router.push(`/${empresa.nombre}/${empresa.areas[0].nombre}`)
                }
            } else {
                setIsValidUser(false)
            }
        }
    }, [userBdd, loading, empresa, router])

    useEffect(() => {
        const contactos = empresa?.contactos

        if (contactos) {
            const admin = contactos.find((c) => c.cargo === "administrador")
            setContactoAdministrador(admin || null)
        }
    }, [empresa])

    useEffect(() => {
        const startTime = Date.now()

        const interval = setInterval(() => {
            const currentTime = Date.now()
            const elapsed = Math.floor((currentTime - startTime) / 1000)
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

    if (loading) return <LoadingState message='Verificando permisos' />

    return (
        <div>
            <div className='absolute top-2 right-2'>
                <AnimatedToggleMode />
            </div>
            {isValidUser === false && (
                <div className="min-h-screen flex items-center justify-center p-4">
                    <Card className="w-full max-w-lg">
                        <CardHeader className="text-center space-y-4">
                            <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-red-100 rounded-full flex items-center justify-center">
                                <Shield className="w-8 h-8 text-orange-600 dark:text-red-600" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-300">
                                    Acceso pendiente de revision
                                </CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-200 mt-2">
                                    Usted no esta autorizado en esta empresa <b>({empresa?.nombre})</b>.
                                    <br />
                                    Favor de esperar su acceso al sistema.
                                </CardDescription>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Clock className="w-4 h-4 text-gray-500 dark:text-gray-200" />
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-200">Tiempo en espera</span>
                                </div>
                                <div className="font-mono text-3xl font-bold text-gray-900 dark:text-gray-400 tracking-wider">
                                    {hours}:{minutes}:{seconds}
                                </div>
                                <div className="flex justify-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-200">
                                    <span>Horas</span>
                                    <span>Minutos</span>
                                    <span>Segundos</span>
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <p className="text-sm text-gray-600 dark:text-gray-200 text-center mb-4">
                                    <b>NOTA:</b> Si no recibe la autorización en un corto período de tiempo,
                                    por favor contacte al administrador de la empresa.
                                </p>

                                <div className="border-blue-200 bg-blue-100 dark:bg-red-100 dark:border-red-400 border-2 rounded-lg p-4 mb-4">
                                    <div className="space-y-2">
                                        <div>
                                            <p className="font-medium text-blue-800 dark:text-red-500 text-sm">{contactoAdminstrador?.nombre}</p>
                                            <p className="text-blue-600 dark:text-red-500 text-xs capitalize">{contactoAdminstrador?.cargo}</p>
                                        </div>
                                        <div className="space-y-1 flex items-center justify-between">
                                            <div className="flex items-center justify-start gap-2 text-sm text-blue-700 dark:text-red-500">
                                                <Mail className="w-3 h-3 dark:text-red-500" />
                                                <a href={`mailto:${contactoAdminstrador?.email}`} className="hover:underline">
                                                    {contactoAdminstrador?.email}
                                                </a>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-red-500">
                                                <Phone className="w-3 h-3 dark:text-red-500" />
                                                <a href={`tel:${contactoAdminstrador?.telefono}`} className="hover:underline">
                                                    {contactoAdminstrador?.telefono}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Link href="/" className="w-full">
                                    <Button variant="outline" className="w-full bg-transparent">
                                        <Home className="w-4 h-4 mr-2" />
                                        Regresar al inicio
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

export default MainPage