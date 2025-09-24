"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useEquipos } from "@/modules/logistica/bdd/equipos/hooks/use-equipos"
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
    const { currentUser } = useAuth()
    const { equipos } = useEquipos()

    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [otpSent, setOtpSent] = useState<boolean>(false)
    const [locked, setLocked] = useState<boolean>(true)
    const [phone, setPhone] = useState<string>('')
    const [otp, setOtp] = useState<string>("")

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

    if (!currentUser) {
        return <div>Not logged in</div>
    }

    const currentEquipo = equipos.find((equipo) => equipo.id === equipoId)

    return (
        <>
            <div className="container mx-auto py-8 px-4">
                {JSON.stringify(currentEquipo)}
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