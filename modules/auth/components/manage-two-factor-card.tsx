"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Smartphone, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { auth } from "@/firebase/client"
import { multiFactor } from "firebase/auth"
import { TwoFactorEnrollmentDialog } from "./two-factor-enrollment-dialog"
import { useTwoFactor } from "../hooks/use-two-factor"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export const ManageTwoFactorCard = () => {
    const [enrolledFactors, setEnrolledFactors] = useState<any[]>([])
    const [showEnrollDialog, setShowEnrollDialog] = useState(false)
    const [factorToRemove, setFactorToRemove] = useState<string | null>(null)
    const { unenrollFactor } = useTwoFactor()

    const loadEnrolledFactors = () => {
        const user = auth.currentUser
        if (user) {
            const factors = multiFactor(user).enrolledFactors
            setEnrolledFactors(factors)
        }
    }

    useEffect(() => {
        loadEnrolledFactors()
    }, [])

    const handleUnenroll = async () => {
        if (factorToRemove) {
            const result = await unenrollFactor(factorToRemove)
            if (result.success) {
                loadEnrolledFactors()
                setFactorToRemove(null)
            }
        }
    }

    const is2FAEnabled = enrolledFactors.length > 0

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-purple-600" />
                            <CardTitle>Autenticación de Dos Factores</CardTitle>
                        </div>
                        <Badge variant={is2FAEnabled ? "default" : "secondary"}>
                            {is2FAEnabled ? "Habilitado" : "Deshabilitado"}
                        </Badge>
                    </div>
                    <CardDescription>
                        Agrega una capa adicional de seguridad a tu cuenta
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {is2FAEnabled ? (
                        <div className="space-y-3">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Números de teléfono registrados:
                            </p>
                            {enrolledFactors.map((factor) => (
                                <div
                                    key={factor.uid}
                                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                                            <Smartphone className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">
                                                {factor.displayName || "Teléfono principal"}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {factor.phoneNumber || "Número oculto"}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setFactorToRemove(factor.uid)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                            <p className="text-sm text-amber-800 dark:text-amber-200">
                                La autenticación de dos factores no está habilitada. Habilítala para proteger mejor tu cuenta.
                            </p>
                        </div>
                    )}

                    <Button
                        onClick={() => setShowEnrollDialog(true)}
                        className="w-full"
                        variant={is2FAEnabled ? "outline" : "default"}
                    >
                        <Shield className="h-4 w-4 mr-2" />
                        {is2FAEnabled ? "Agregar Otro Número" : "Habilitar 2FA"}
                    </Button>
                </CardContent>
            </Card>

            <TwoFactorEnrollmentDialog
                open={showEnrollDialog}
                onOpenChange={setShowEnrollDialog}
                onSuccess={loadEnrolledFactors}
            />

            <AlertDialog open={!!factorToRemove} onOpenChange={(open) => !open && setFactorToRemove(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Deshabilitar 2FA?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará este número de teléfono de tu autenticación de dos factores.
                            Tu cuenta será menos segura.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleUnenroll} className="bg-red-600 hover:bg-red-700">
                            Deshabilitar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
