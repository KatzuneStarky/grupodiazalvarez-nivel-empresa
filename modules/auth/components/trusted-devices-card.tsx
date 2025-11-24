"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Monitor, Smartphone, Tablet, Trash2, CheckCircle2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useTrustedDevices } from "../hooks/use-trusted-devices"
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
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"

interface TrustedDevice {
    id: string
    name: string
    userAgent: string
    ip?: string
    lastUsed: Date
    createdAt: Date
}

export const TrustedDevicesCard = () => {
    const [devices, setDevices] = useState<TrustedDevice[]>([])
    const [deviceToRemove, setDeviceToRemove] = useState<string | null>(null)
    const [currentDeviceId, setCurrentDeviceId] = useState<string>("")
    const [isCurrentDeviceTrusted, setIsCurrentDeviceTrusted] = useState(false)

    const {
        isLoading,
        getDeviceFingerprint,
        isDeviceTrusted,
        trustCurrentDevice,
        removeTrustedDevice,
        getTrustedDevices
    } = useTrustedDevices()

    useEffect(() => {
        loadDevices()
        checkCurrentDevice()
    }, [])

    const loadDevices = async () => {
        const trustedDevices = await getTrustedDevices()
        setDevices(trustedDevices)
    }

    const checkCurrentDevice = async () => {
        const deviceId = getDeviceFingerprint()
        setCurrentDeviceId(deviceId)

        const isTrusted = await isDeviceTrusted()
        setIsCurrentDeviceTrusted(isTrusted)
    }

    const handleTrustDevice = async () => {
        const result = await trustCurrentDevice()
        if (result.success) {
            await loadDevices()
            await checkCurrentDevice()
        }
    }

    const handleRemoveDevice = async () => {
        if (deviceToRemove) {
            const result = await removeTrustedDevice(deviceToRemove)
            if (result.success) {
                await loadDevices()
                await checkCurrentDevice()
                setDeviceToRemove(null)
            }
        }
    }

    const getDeviceIcon = (deviceName: string) => {
        if (deviceName.includes('Phone')) return Smartphone
        if (deviceName.includes('Tablet') || deviceName.includes('iPad')) return Tablet
        return Monitor
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Monitor className="h-5 w-5 text-blue-600" />
                            <CardTitle>Dispositivos Confiables</CardTitle>
                        </div>
                        <Badge variant="secondary">
                            {devices.length} dispositivo{devices.length !== 1 ? 's' : ''}
                        </Badge>
                    </div>
                    <CardDescription>
                        No se te pedirá 2FA en dispositivos confiables
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!isCurrentDeviceTrusted && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                                        Dispositivo Actual
                                    </p>
                                    <p className="text-xs text-blue-700 dark:text-blue-300">
                                        Este dispositivo no está marcado como confiable. Márcalo para no tener que ingresar 2FA cada vez.
                                    </p>
                                </div>
                                <Button
                                    size="sm"
                                    onClick={handleTrustDevice}
                                    disabled={isLoading}
                                >
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Confiar
                                </Button>
                            </div>
                        </div>
                    )}

                    {devices.length > 0 ? (
                        <div className="space-y-3">
                            {devices.map((device) => {
                                const DeviceIcon = getDeviceIcon(device.name)
                                const isCurrentDevice = device.id === currentDeviceId

                                return (
                                    <div
                                        key={device.id}
                                        className={`flex items-center justify-between p-3 rounded-lg border ${isCurrentDevice
                                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                                            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className={`p-2 rounded-lg ${isCurrentDevice
                                                ? 'bg-blue-100 dark:bg-blue-900/50'
                                                : 'bg-slate-100 dark:bg-slate-800'
                                                }`}>
                                                <DeviceIcon className={`h-4 w-4 ${isCurrentDevice
                                                    ? 'text-blue-600 dark:text-blue-400'
                                                    : 'text-slate-600 dark:text-slate-400'
                                                    }`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium text-sm truncate">
                                                        {device.name}
                                                    </p>
                                                    {isCurrentDevice && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            Actual
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    Último uso: {formatDistanceToNow(parseFirebaseDate(device.lastUsed), {
                                                        addSuffix: true,
                                                        locale: es
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setDeviceToRemove(device.id)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-center">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                No tienes dispositivos confiables configurados
                            </p>
                        </div>
                    )}

                    <div className="text-xs text-slate-500 dark:text-slate-400">
                        💡 Los dispositivos confiables no requerirán 2FA durante 30 días
                    </div>
                </CardContent>
            </Card>

            {/* Remove Device Confirmation Dialog */}
            <AlertDialog open={!!deviceToRemove} onOpenChange={(open) => !open && setDeviceToRemove(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Remover dispositivo confiable?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Este dispositivo dejará de ser confiable y se te pedirá 2FA la próxima vez que inicies sesión desde él.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRemoveDevice} className="bg-red-600 hover:bg-red-700">
                            Remover
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
