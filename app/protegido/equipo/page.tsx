"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import MaintenanceTab from "@/modules/logistica/equipos/components/equipoId/tab/maintenance-tab"
import EquipoIdHeader from "@/modules/logistica/equipos/components/equipoId/equipo-id-header"
import DocumentsTab from "@/modules/logistica/equipos/components/equipoId/tab/documents-tab"
import GeneralTab from "@/modules/logistica/equipos/components/equipoId/tab/general-tab"
import useEquipoDataById from "@/modules/logistica/equipos/hooks/use-equipos-data-by-id"
import TanksTab from "@/modules/logistica/equipos/components/equipoId/tab/tanks-tab"
import { SocialLoginButtons } from "@/components/global/social-login-buttons"
import TabsIndex from "@/modules/logistica/equipos/components/equipoId/tab"
import { Card, CardContent } from "@/components/ui/card"
import { SocialProvider } from "@/types/social-provider"
import { Separator } from "@/components/ui/separator"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Icon from "@/components/global/icon"
import { useState } from "react"
import { toast } from "sonner"

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"

const EquipoProtegidoPage = () => {
    const searchParams = useSearchParams()
    const equipoId = searchParams.get("equipoId")
    const { currentUser, isLoading, loginWithGoogle } = useAuth()

    const {
        data
    } = useEquipoDataById(equipoId || "")

    const [searchTerm, setSearchTerm] = useState<string>("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [otpSent, setOtpSent] = useState<boolean>(false)
    const [locked, setLocked] = useState<boolean>(true)
    const [phone, setPhone] = useState<string>('')
    const [otp, setOtp] = useState<string>("")

    const numMantenimientos = data.equipo?.mantenimientos && data.equipo.mantenimientos.length || 0
    const numTanques = data.equipo?.tanques && data.equipo.tanques.length || 0
    const numArchivos = data.archivos && data.archivos.length || 0
    const numCertificados = data.certificados && data.certificados.length || 0
    const numArchivosVencimiento = data.archivosVencimiento && data.archivosVencimiento.length || 0
    const totalArchivos = numArchivos + numCertificados + numArchivosVencimiento
    const isPhoneValid = /^\+\d{10,15}$/.test(phone);

    const handleSendOTP = async () => {
        try {
            setLoading(true);

            const res = await fetch('/api/sms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to: phone, userId: currentUser?.uid })
            });

            const data = await res.json();
            if (res.ok) {
                setOtpSent(true);
                setError(null);
                setLoading(false)
            } else {
                setError(data.message || 'Error al enviar OTP');
                setLoading(false)
            }
        } catch (err) {
            setError('Error de red');
            setLoading(false)
        }
    };

    const handleVerifyOTP = async (value: string) => {
        try {
            setLoading(true);

            const res = await fetch('/api/verifyOTP', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to: phone, otp: value, userId: currentUser?.uid })
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("OTP Verificado")
                setLocked(false);
                setLoading(false)
            } else {
                setError(data.message || 'OTP inválido');
                setLoading(false)
            }
        } catch (err) {
            setError('Error de red');
            setLoading(false)
        }
    };

    const handleVerify = (value: string) => {
        if (value.length === 6) {
            handleVerifyOTP(value);
        }
    };

    const handleSocialLogin = (provider: SocialProvider) => {
        if (provider === "google") {
            loginWithGoogle()
        }
    }

    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-xl">
                    <CardContent>
                        <SocialLoginButtons
                            isLoading={isLoading || false}
                            onSocialLogin={handleSocialLogin}
                        />
                    </CardContent>
                </Card>
            </div>
        )
    }

    const isExpiringSoon = (date: Date) => {
        const daysUntilExpiry = Math.floor((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        return daysUntilExpiry <= 30 && daysUntilExpiry >= 0
    }

    const isExpired = (date: Date) => {
        return new Date(date) < new Date()
    }

    return (
        <>
            <div className="w-full container mx-auto p-4 space-y-6">
                <EquipoIdHeader
                    numMantenimientos={numMantenimientos}
                    totalArchivos={totalArchivos}
                    numTanques={numTanques}
                    equipo={data.equipo}
                />

                <TabsIndex>
                    <GeneralTab
                        isExpiringSoon={isExpiringSoon}
                        isExpired={isExpired}
                        equipo={data.equipo}
                    />
                    <TanksTab
                        isExpired={isExpired}
                        equipo={data.equipo}
                    />
                    <MaintenanceTab
                        numMantenimientos={numMantenimientos}
                        setSearchTerm={setSearchTerm}
                        searchTerm={searchTerm}
                        equipo={data.equipo}
                    />
                    <DocumentsTab
                        archivosVencimiento={data.archivosVencimiento}
                        certificado={data.certificados}
                        setSearchTerm={setSearchTerm}
                        archivos={data.archivos}
                        searchTerm={searchTerm}
                    />
                </TabsIndex>
            </div>

            <Dialog open={locked} onOpenChange={() => { }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            Contenido bloqueado
                        </DialogTitle>
                        <DialogDescription>
                            Ingrese su numero telefonico para obtener un codigo OTP y desbloquear los datos
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid w-full max-w-sm items-center gap-3">
                        <Label htmlFor="phoneNumber">Numero telefonico</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="tel"
                                id="phoneNumber"
                                placeholder="Ej. +521234567890"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                            <Button disabled={!isPhoneValid || loading} onClick={handleSendOTP}>
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <Icon iconName="eos-icons:loading" className="animate-spin transition-all" />
                                        Enviando...
                                    </div>
                                ) : (
                                    <>
                                        <Icon iconName="solar:key-bold" />
                                        Enviar OTP
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {otpSent && <p className="text-green-500 text-sm">OTP enviado correctamente</p>}

                    <Separator />

                    <span className="flex items-center gap-2 text-sm leading-none font-medium">
                        Codigo OTP
                    </span>
                    <div className="flex items-center justify-center w-full">
                        <InputOTP
                            maxLength={6}
                            value={otp}
                            onChange={(val: string) => {
                                setOtp(val);
                                handleVerify(val);
                            }}
                        >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default EquipoProtegidoPage