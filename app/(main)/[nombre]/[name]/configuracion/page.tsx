"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CompanyProfile } from "@/modules/admin-area/components/config/company-profile"
import { NotificationsSettings } from "@/modules/admin-area/components/config/notifications-settings"
import { AppearanceSettings } from "@/modules/admin-area/components/config/appearance-settings"
import { SecuritySettings } from "@/modules/admin-area/components/config/security-settings"
import { Building, Bell, Palette, Shield } from "lucide-react"

const ConfigPage = () => {
    return (
        <div className="container mx-auto py-6 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
                <p className="text-muted-foreground">
                    Administra las preferencias de tu empresa y cuenta.
                </p>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general" className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        General
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Notificaciones
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Apariencia
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Seguridad
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                    <CompanyProfile />
                </TabsContent>
                <TabsContent value="notifications" className="space-y-4">
                    <NotificationsSettings />
                </TabsContent>
                <TabsContent value="appearance" className="space-y-4">
                    <AppearanceSettings />
                </TabsContent>
                <TabsContent value="security" className="space-y-4">
                    <SecuritySettings />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default ConfigPage