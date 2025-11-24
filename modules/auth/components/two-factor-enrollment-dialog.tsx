"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Shield, Smartphone } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState, useEffect } from "react"
import { useTwoFactor } from "../hooks/use-two-factor"

const PhoneSchema = z.object({
    phoneNumber: z.string()
        .min(10, "El número debe tener al menos 10 dígitos")
        .regex(/^\+?[1-9]\d{1,14}$/, "Formato de número inválido (ej: +521234567890)")
})

const CodeSchema = z.object({
    code: z.string().length(6, "El código debe tener 6 dígitos")
})

interface TwoFactorEnrollmentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export const TwoFactorEnrollmentDialog = ({
    open,
    onOpenChange,
    onSuccess
}: TwoFactorEnrollmentDialogProps) => {
    const [step, setStep] = useState<'phone' | 'code'>('phone')
    const { enrollPhone, verifyAndEnroll, isEnrolling, verificationId } = useTwoFactor()

    const phoneForm = useForm<z.infer<typeof PhoneSchema>>({
        resolver: zodResolver(PhoneSchema),
        defaultValues: {
            phoneNumber: ""
        }
    })

    const codeForm = useForm<z.infer<typeof CodeSchema>>({
        resolver: zodResolver(CodeSchema),
        defaultValues: {
            code: ""
        }
    })

    useEffect(() => {
        if (!open) {
            setStep('phone')
            phoneForm.reset()
            codeForm.reset()
        }
    }, [open])

    const onPhoneSubmit = async (data: z.infer<typeof PhoneSchema>) => {
        const result = await enrollPhone(data.phoneNumber, 'recaptcha-container-enroll')
        if (result.success) {
            setStep('code')
        }
    }

    const onCodeSubmit = async (data: z.infer<typeof CodeSchema>) => {
        const result = await verifyAndEnroll(data.code)
        if (result.success) {
            onOpenChange(false)
            onSuccess?.()
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-purple-600" />
                        Habilitar Autenticación de Dos Factores
                    </DialogTitle>
                    <DialogDescription>
                        {step === 'phone'
                            ? "Ingresa tu número de teléfono para recibir un código de verificación"
                            : "Ingresa el código de 6 dígitos enviado a tu teléfono"
                        }
                    </DialogDescription>
                </DialogHeader>

                {step === 'phone' ? (
                    <Form {...phoneForm}>
                        <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
                            <FormField
                                control={phoneForm.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Número de Teléfono</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Smartphone className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                                <Input
                                                    placeholder="+521234567890"
                                                    className="pl-10"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div id="recaptcha-container-enroll z-[999]"></div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isEnrolling}
                            >
                                {isEnrolling ? "Enviando..." : "Enviar Código"}
                            </Button>
                        </form>
                    </Form>
                ) : (
                    <Form {...codeForm}>
                        <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} className="space-y-4">
                            <FormField
                                control={codeForm.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Código de Verificación</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="123456"
                                                maxLength={6}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setStep('phone')}
                                    className="flex-1"
                                >
                                    Atrás
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1"
                                >
                                    Verificar
                                </Button>
                            </div>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    )
}
