"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth"
import { ArrowRight, CheckCircle, Loader2, Mail, XCircle } from "lucide-react"
import type { StepOptions, PopperPlacement } from 'shepherd.js'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter, useSearchParams } from "next/navigation"
import { useTour } from "@/context/tour-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { z } from "zod"
import { v4 } from "uuid"

type AuthMode =
    | "signIn"
    | "resetPassword"
    | "recoverEmail"
    | "verifyAndChangeEmail"
    | "revertSecondFactorAddition"
    | null

const emailSchema = z.object({
    email: z.string().email({ message: "Correo electrónico inválido" })
})

const AccionesUsuario = () => {
    const [status, setStatus] = useState<"idle" | "validating" | "success" | "error">("idle");
    const [confirmPassword, setConfirmPassword] = useState("")
    const [continueUrl, setContinueUrl] = useState<string>("")
    const [passwordError, setPasswordError] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [oobCode, setOobCode] = useState<string>("")
    const [mode, setMode] = useState<AuthMode>(null)
    const [apiKey, setApiKey] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("");

    const auth = getAuth();
    const params = useSearchParams()
    const router = useRouter()
    const { startTour, initTour } = useTour()

    useEffect(() => {
        try {
            setLoading(true)

            const urlMode = params.get("mode") as AuthMode
            const key = params.get("apiKey")
            const code = params.get("oobCode")
            const url = params.get("continueUrl")

            setTimeout(() => {
                setMode(urlMode)
                setApiKey(key || "")
                setOobCode(code || "")
                setContinueUrl(url || "")
                setLoading(false)
            }, 1000)
        } catch (error) {
            setLoading(false)
        }
    }, [params])

    useEffect(() => {
        setTimeout(() => {
            const tourId = v4()
            const tour = initTour(tourId)

            if (!tour) return

            const steps: StepOptions[] = [
                {
                    id: 'step-1',
                    attachTo: { element: '.input-email', on: 'right' as PopperPlacement },
                    title: 'Ingresa tu correo',
                    text: 'Aquí puedes crear un nuevo elemento.',
                    buttons: [
                        {
                            text: 'Siguiente',
                            action: () => tour?.next(),
                        },
                    ],
                },
                {
                    id: 'step-2',
                    attachTo: { element: '.sidebar', on: 'bottom' as PopperPlacement },
                    title: 'Menú lateral',
                    text: 'Este es el menú lateral donde puedes navegar.',
                    buttons: [
                        {
                            text: 'Anterior',
                            action: () => tour.back(),
                        },
                        {
                            text: 'Finalizar',
                            action: () => tour.complete(),
                        },
                    ],
                },
            ];

            steps.forEach((step) => tour.addStep(step));
            startTour();
        }, 2000);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-red-600 mb-4" />
                        <p className="text-gray-600">Cargando...</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const isValid = emailSchema.safeParse({
        email
    })

    const verifyEmail = async (email: string) => {
        if (mode === "signIn") {
            try {
                setStatus("validating")
                setLoading(true)
                const url = window.location.href;

                if (!email) {
                    setStatus("error");
                    toast.error("Debes ingresar un correo electrónico");
                    setTimeout(() => {
                        setStatus("idle")
                    }, 2000)
                }

                if (!isValid.success) {
                    setStatus("error");
                    toast.error("El correo electrónico es inválido");
                    setTimeout(() => {
                        setStatus("idle")
                    }, 2000)
                }

                if (email && isSignInWithEmailLink(auth, url)) {
                    await signInWithEmailLink(auth, email, url);
                    setStatus("success");
                    toast.success("Verificación exitosa", {
                        description: "Tu correo electrónico ha sido verificado con éxito.",
                    });

                    setTimeout(() => {
                        setStatus("idle");
                        router.push(continueUrl);
                    }, 1500);
                } else {
                    throw new Error("El enlace no es válido o ha expirado.");
                }
            } catch (error) {
                console.error("❌ Error en autenticación:", error);
                setError(`${error}` || "Error desconocido");
                setStatus("error");
                setLoading(false)
                setTimeout(() => {
                    setStatus("idle")
                }, 2000)
            } finally {
                setLoading(false)
            }
        }
    }

    const renderContent = () => {
        switch (mode) {
            case "signIn":
                return (
                    <Card className="w-full max-w-md">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                <Mail className="h-6 w-6 text-blue-600" />
                            </div>
                            <CardTitle className="text-2xl font-bold">Verifica tu email</CardTitle>
                            <CardDescription>
                                Estamos verificando tu dirección de correo electrónico.
                                Esto puede tomar unos momentos.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Alert className="border-2 border-red-500">
                                <CheckCircle className="h-4 w-4" />
                                <AlertDescription>
                                    Your email verification is in progress. You can close this window once completed.
                                </AlertDescription>
                            </Alert>

                            <Label htmlFor="email">
                                Ingrese su correo electronico
                            </Label>
                            <Input
                                id="email"
                                className="input-email"
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                            <Button
                                className="w-full bg-transparent sidebar"
                                variant={status === "error" ? "destructive" : "outline"}
                                onClick={() => verifyEmail(email)}
                                disabled={status === "validating" || status === "error" || loading}
                            >
                                {status === "validating" && <Loader2 className="w-4 h-4 animate-spin" />}
                                {status === "success" && <CheckCircle className="w-4 h-4" />}
                                {status === "error" && <XCircle className="w-4 h-4" />}
                                {status === "validating" ? "Validando..." : "Continuar"}
                                {status === "idle" && <ArrowRight className="w-4 h-4" />}
                            </Button>
                            {status}
                        </CardContent>
                    </Card>
                )
        }
    }

    return <div className="min-h-screen flex items-center justify-center p-4">{renderContent()}</div>
}

export default AccionesUsuario