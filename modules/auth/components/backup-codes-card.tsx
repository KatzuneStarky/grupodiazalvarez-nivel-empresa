"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Key, RefreshCw, Shield } from "lucide-react"
import { useState, useEffect } from "react"
import { useBackupCodes } from "../hooks/use-backup-codes"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
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

export const BackupCodesCard = () => {
    const [remainingCodes, setRemainingCodes] = useState(0)
    const [showCodesDialog, setShowCodesDialog] = useState(false)
    const [showRegenerateDialog, setShowRegenerateDialog] = useState(false)

    const {
        isGenerating,
        backupCodes,
        generateBackupCodes,
        getRemainingCodesCount,
        downloadBackupCodes
    } = useBackupCodes()

    useEffect(() => {
        loadRemainingCodes()
    }, [])

    const loadRemainingCodes = async () => {
        const count = await getRemainingCodesCount()
        setRemainingCodes(count)
    }

    const handleGenerateCodes = async () => {
        const result = await generateBackupCodes()
        if (result.success) {
            setShowCodesDialog(true)
            setShowRegenerateDialog(false)
            await loadRemainingCodes()
        }
    }

    const handleDownload = () => {
        if (backupCodes.length > 0) {
            downloadBackupCodes(backupCodes)
        }
    }

    const hasBackupCodes = remainingCodes > 0

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Key className="h-5 w-5 text-amber-600" />
                            <CardTitle>Códigos de Respaldo</CardTitle>
                        </div>
                        <Badge variant={hasBackupCodes ? "default" : "secondary"}>
                            {remainingCodes} disponibles
                        </Badge>
                    </div>
                    <CardDescription>
                        Códigos de un solo uso para acceder si pierdes tu teléfono
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {hasBackupCodes ? (
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                    Códigos de respaldo activos
                                </p>
                            </div>
                            <p className="text-sm text-green-700 dark:text-green-300">
                                Tienes {remainingCodes} código{remainingCodes !== 1 ? 's' : ''} de respaldo disponible{remainingCodes !== 1 ? 's' : ''}.
                            </p>
                        </div>
                    ) : (
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                            <p className="text-sm text-amber-800 dark:text-amber-200">
                                No tienes códigos de respaldo. Genera algunos para poder acceder a tu cuenta si pierdes tu teléfono.
                            </p>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Button
                            onClick={() => hasBackupCodes ? setShowRegenerateDialog(true) : handleGenerateCodes()}
                            disabled={isGenerating}
                            className="flex-1"
                            variant={hasBackupCodes ? "outline" : "default"}
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                            {hasBackupCodes ? "Regenerar Códigos" : "Generar Códigos"}
                        </Button>
                    </div>

                    {hasBackupCodes && (
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                            💡 Regenerar códigos invalidará todos los códigos anteriores
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Codes Display Dialog */}
            <Dialog open={showCodesDialog} onOpenChange={setShowCodesDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Key className="h-5 w-5 text-amber-600" />
                            Tus Códigos de Respaldo
                        </DialogTitle>
                        <DialogDescription>
                            Guarda estos códigos en un lugar seguro. Cada uno solo puede usarse una vez.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            {backupCodes.map((code, index) => (
                                <div
                                    key={index}
                                    className="font-mono text-sm p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-center"
                                >
                                    {code}
                                </div>
                            ))}
                        </div>

                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                            <p className="text-xs text-amber-800 dark:text-amber-200">
                                ⚠️ <strong>Importante:</strong> Estos códigos no se mostrarán nuevamente. Descárgalos o guárdalos ahora.
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={handleDownload}
                                variant="outline"
                                className="flex-1"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Descargar
                            </Button>
                            <Button
                                onClick={() => setShowCodesDialog(false)}
                                className="flex-1"
                            >
                                Entendido
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Regenerate Confirmation Dialog */}
            <AlertDialog open={showRegenerateDialog} onOpenChange={setShowRegenerateDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Regenerar códigos de respaldo?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción generará nuevos códigos y <strong>todos los códigos anteriores dejarán de funcionar</strong>.
                            Asegúrate de guardar los nuevos códigos en un lugar seguro.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleGenerateCodes}>
                            Regenerar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
