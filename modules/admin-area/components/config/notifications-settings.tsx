"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { toast } from "sonner"

export const NotificationsSettings = () => {
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [pushNotifications, setPushNotifications] = useState(false)
    const [marketingEmails, setMarketingEmails] = useState(false)

    const handleSave = () => {
        // Here you would save the preferences to the backend
        toast.success("Preferencias guardadas", {
            description: "Tus preferencias de notificaciones han sido actualizadas."
        })
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Notificaciones</CardTitle>
                    <CardDescription>
                        Elige qué notificaciones quieres recibir.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between space-x-2">
                        <div className="space-y-0.5">
                            <Label htmlFor="email-notifications">Notificaciones por Email</Label>
                            <p className="text-sm text-muted-foreground">
                                Recibe correos sobre actividad importante en tu cuenta.
                            </p>
                        </div>
                        <Switch
                            id="email-notifications"
                            checked={emailNotifications}
                            onCheckedChange={(checked) => {
                                setEmailNotifications(checked)
                                handleSave()
                            }}
                        />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                        <div className="space-y-0.5">
                            <Label htmlFor="push-notifications">Notificaciones Push</Label>
                            <p className="text-sm text-muted-foreground">
                                Recibe notificaciones en tu dispositivo.
                            </p>
                        </div>
                        <Switch
                            id="push-notifications"
                            checked={pushNotifications}
                            onCheckedChange={(checked) => {
                                setPushNotifications(checked)
                                handleSave()
                            }}
                        />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                        <div className="space-y-0.5">
                            <Label htmlFor="marketing-emails">Correos de Marketing</Label>
                            <p className="text-sm text-muted-foreground">
                                Recibe noticias sobre nuevas características y promociones.
                            </p>
                        </div>
                        <Switch
                            id="marketing-emails"
                            checked={marketingEmails}
                            onCheckedChange={(checked) => {
                                setMarketingEmails(checked)
                                handleSave()
                            }}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
