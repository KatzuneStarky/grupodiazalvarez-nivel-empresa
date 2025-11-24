"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, AlertCircle } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context"
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export const SecuritySettings = () => {
    const { currentUser } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    // Check if user is logged in with Google
    const isGoogleUser = currentUser?.providerData.some(
        (provider) => provider.providerId === "google.com"
    )

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!currentUser || !currentUser.email) return

        if (newPassword !== confirmPassword) {
            toast.error("Error", {
                description: "Las contraseñas nuevas no coinciden."
            })
            return
        }

        if (newPassword.length < 6) {
            toast.error("Error", {
                description: "La contraseña debe tener al menos 6 caracteres."
            })
            return
        }

        setIsLoading(true)

        try {
            // Re-authenticate user
            const credential = EmailAuthProvider.credential(currentUser.email, currentPassword)
            await reauthenticateWithCredential(currentUser, credential)

            // Update password
            await updatePassword(currentUser, newPassword)

            toast.success("Contraseña actualizada", {
                description: "Tu contraseña ha sido cambiada exitosamente."
            })

            // Clear form
            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")

        } catch (error: any) {
            console.error("Error updating password:", error)
            let message = "No se pudo actualizar la contraseña."

            if (error.code === "auth/wrong-password") {
                message = "La contraseña actual es incorrecta."
            } else if (error.code === "auth/too-many-requests") {
                message = "Demasiados intentos fallidos. Intenta más tarde."
            } else if (error.code === "auth/requires-recent-login") {
                message = "Por seguridad, debes volver a iniciar sesión antes de cambiar tu contraseña."
            }

            toast.error("Error", {
                description: message
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (isGoogleUser) {
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Seguridad</CardTitle>
                        <CardDescription>
                            Administra la seguridad de tu cuenta.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Cuenta de Google</AlertTitle>
                            <AlertDescription>
                                Iniciaste sesión con Google. Tu contraseña y seguridad son administradas por Google.
                                Para cambiar tu contraseña, debes hacerlo desde la configuración de tu cuenta de Google.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Seguridad</CardTitle>
                    <CardDescription>
                        Administra tu contraseña y la seguridad de tu cuenta.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current-password">Contraseña Actual</Label>
                            <Input
                                id="current-password"
                                type="password"
                                required
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-password">Nueva Contraseña</Label>
                            <Input
                                id="new-password"
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Actualizando..." : (
                                    <>
                                        <Lock className="mr-2 h-4 w-4" />
                                        Cambiar Contraseña
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
