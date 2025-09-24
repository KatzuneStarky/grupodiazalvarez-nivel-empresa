"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import EquipoIdTanqueCard from "@/modules/logistica/equipos/components/equipoId/equipo-id-tanque-card"
import DocumentCard from "@/modules/logistica/equipos/documentos/components/document-card"
import EquipoIdCard from "@/modules/logistica/equipos/components/equipoId/equipo-id-card"
import useEquipoDataById from "@/modules/logistica/equipos/hooks/use-equipos-data-by-id"
import { esArchivoVencimiento, esCertificado } from "@/functions/tipo-archivo-equipo"
import { Separator } from "@/components/ui/separator"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Icon from "@/components/global/icon"
import { Card } from "@/components/ui/card"
import { File } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"

type FilterType = "all" | "archivos" | "certificados" | "archivosVencimiento";

const EquipoProtegidoPage = () => {
    const searchParams = useSearchParams()
    const equipoId = searchParams.get("equipoId")
    const { currentUser } = useAuth()

    const {
        archivosVencimiento,
        certificados,
        archivos,
        equipo,
    } = useEquipoDataById(equipoId || "")

    const [filter, setFilter] = useState<FilterType>("all")
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

    const combinedArray = [...archivos, ...certificados, ...archivosVencimiento];

    const filteredFiles = combinedArray.filter((file) => {
        if (filter === "all") return true;
        if (filter === "archivos") return "updateAt" in file;
        if (filter === "certificados") return esCertificado(file);
        if (filter === "archivosVencimiento") return esArchivoVencimiento(file);
        return false;
    });

    const getFilterButtonClass = (filterType: FilterType) => {
        const baseClasses = "px-4 py-2 rounded-md transition-colors duration-200";
        const activeClasses = "bg-emerald-500 text-white hover:bg-emerald-700";
        const inactiveClasses = "bg-black text-white hover:bg-emerald-700";

        return filter === filterType
            ? `${baseClasses} ${activeClasses}`
            : `${baseClasses} ${inactiveClasses}`;
    };

    return (
        <>
            <div className="container mx-auto py-8 px-4">
                <div className="grid grid-cols-2 gap-4 w-full">
                    <EquipoIdCard equipo={equipo} />
                    <div className="space-y-2">
                        {equipo?.tanques && equipo.tanques.map((t) => (
                            <EquipoIdTanqueCard tanque={t} key={t.id} />
                        ))}
                    </div>
                </div>

                <div className="py-12 space-y-6 w-full">
                    <div className="flex justify-between items-center w-full">
                        <div className="flex space-x-2">
                            <Button
                                onClick={() => setFilter("all")}
                                className={cn("flex items-center gap-2", getFilterButtonClass("all"))}
                                size={"lg"}
                            >
                                <Icon iconName="ph:files-bold" />
                                Todos ({combinedArray.length})
                            </Button>
                            <Button
                                onClick={() => setFilter("archivos")}
                                className={cn("flex items-center gap-2", getFilterButtonClass("archivos"))}
                                size={"lg"}
                            >
                                <File size={20} />
                                Archivos ({archivos.length})
                            </Button>
                            <Button
                                onClick={() => setFilter("archivosVencimiento")}
                                className={cn("flex items-center gap-2", getFilterButtonClass("archivosVencimiento"))}
                                size={"lg"}
                            >
                                <Icon iconName='icon-park-outline:file-date' />
                                Archivos Vencimiento ({archivosVencimiento.length})
                            </Button>
                            <Button
                                onClick={() => setFilter("certificados")}
                                className={cn("flex items-center gap-2", getFilterButtonClass("certificados"))}
                                size={"lg"}
                            >
                                <Icon iconName='tabler:certificate' />
                                Certificados ({certificados.length})
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredFiles.length === 0
                            ? (
                                <Card className="space-y-2 col-span-2">
                                    <div className="text-center py-8 text-gray-500 dark:text-gray-200">
                                        <File className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                        <p className="text-2xl leading-none">No hay documentos disponibles</p>
                                    </div>
                                </Card>
                            )
                            : (filteredFiles.map((file) => (<DocumentCard file={file} key={file.id} />)))
                        }
                    </div>
                </div>
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