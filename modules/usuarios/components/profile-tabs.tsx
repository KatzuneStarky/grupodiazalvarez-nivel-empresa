"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Building, Calendar, Clock, Download, Edit3, Globe, Link, Mail, Settings, Shield, Star, TrendingUp, UserIcon, Users } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { InfoCard } from "./info-card"
import { EditProfileDialog } from "./edit-profile-dialog"
import { LucideIcon } from "lucide-react"
import { ManageTwoFactorCard } from "@/modules/auth/components/manage-two-factor-card"
import { BackupCodesCard } from "@/modules/auth/components/backup-codes-card"
import { TrustedDevicesCard } from "@/modules/auth/components/trusted-devices-card"
import { useExportUserData } from "../hooks/use-export-user-data"
import { ProfessionalInfoCard } from "./professional-info-card"
import { ContactInfoCard } from "./contact-info-card"
import { EmergencyContactCard } from "./emergency-contact-card"
import { PreferencesCard } from "./preferences-card"
import { DriverLicenseCard } from "./driver-license-card"
import { CertificationsCard } from "./certifications-card"
import { AssignedVehiclesCard } from "./assigned-vehicles-card"

interface ProfileTabsProps {
    displayName: string
    email: string | null | undefined
    userBdd: any
    currentUser: any
    profileCompletion: number
    statusConfig: {
        label: string
        color: string
        bgColor: string
    }
    StatusIcon: LucideIcon
    getRegistrationType: (type: string) => string
}

export const ProfileTabs = ({
    displayName,
    email,
    userBdd,
    currentUser,
    profileCompletion,
    statusConfig,
    StatusIcon,
    getRegistrationType
}: ProfileTabsProps) => {
    const { exportUserData } = useExportUserData()

    return (
        <Tabs defaultValue="overview" className="w-full space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:w-[600px] h-12 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <TabsTrigger value="overview" className="rounded-lg font-medium text-xs lg:text-sm">Resumen</TabsTrigger>
                <TabsTrigger value="personal" className="rounded-lg font-medium text-xs lg:text-sm">Personal</TabsTrigger>
                <TabsTrigger value="professional" className="rounded-lg font-medium text-xs lg:text-sm">Profesional</TabsTrigger>
                <TabsTrigger value="logistics" className="rounded-lg font-medium text-xs lg:text-sm">Logística</TabsTrigger>
                <TabsTrigger value="security" className="rounded-lg font-medium text-xs lg:text-sm">Seguridad</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Estado</p>
                                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{statusConfig.label}</p>
                                </div>
                                <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-full">
                                    <StatusIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Completado</p>
                                    <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{profileCompletion}%</p>
                                </div>
                                <div className="p-3 bg-emerald-100 dark:bg-emerald-800 rounded-full">
                                    <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Rol</p>
                                    <p className="text-xl font-bold text-purple-900 dark:text-purple-100 capitalize">
                                        {userBdd?.rol?.replace("_", " ") || "Usuario"}
                                    </p>
                                </div>
                                <div className="p-3 bg-purple-100 dark:bg-purple-800 rounded-full">
                                    <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Registro</p>
                                    <p className="text-xl font-bold text-amber-900 dark:text-amber-100">
                                        {getRegistrationType(userBdd?.tipoRegistro || "")}
                                    </p>
                                </div>
                                <div className="p-3 bg-amber-100 dark:bg-amber-800 rounded-full">
                                    <Globe className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-slate-500" />
                                Actividad Reciente
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                        <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-slate-100">Último Acceso</p>
                                        <p className="text-sm text-slate-500">Fecha de tu última conexión</p>
                                    </div>
                                </div>
                                <p className="font-semibold text-slate-900 dark:text-slate-100">
                                    {userBdd?.ultimoAcceso ? format(parseFirebaseDate(userBdd.ultimoAcceso), "PPP", { locale: es }) : "N/A"}
                                </p>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                                        <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-slate-100">Última Actualización</p>
                                        <p className="text-sm text-slate-500">Cambios en tu perfil</p>
                                    </div>
                                </div>
                                <p className="font-semibold text-slate-900 dark:text-slate-100">
                                    {userBdd?.actualizadoEn ? format(parseFirebaseDate(userBdd.actualizadoEn), "PPP", { locale: es }) : "N/A"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Star className="h-5 w-5 text-yellow-500" />
                                Estado del Perfil
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">Completado</span>
                                    <span className="text-slate-500">{profileCompletion}%</span>
                                </div>
                                <Progress value={profileCompletion} className="h-2" />
                            </div>
                            <p className="text-sm text-slate-500">
                                {profileCompletion === 100
                                    ? "¡Excelente! Tu perfil está completo."
                                    : "Completa tu información para sacar el máximo provecho."}
                            </p>
                            <Separator />
                            <div className="space-y-2">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    size="sm"
                                    onClick={exportUserData}
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Exportar Datos
                                </Button>
                                <Button variant="outline" className="w-full justify-start" size="sm">
                                    <Users className="h-4 w-4 mr-2" />
                                    Ver Equipo
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

            <TabsContent value="personal" className="space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <UserIcon className="h-5 w-5 text-blue-500" />
                            Información Personal
                        </CardTitle>
                        <EditProfileDialog
                            currentUser={currentUser}
                            userBdd={userBdd}
                            trigger={
                                <Button size="sm">
                                    <Edit3 className="h-4 w-4 mr-2" />
                                    Editar
                                </Button>
                            }
                        />
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoCard
                            icon={UserIcon}
                            label="Nombre Completo"
                            value={displayName}
                            colorClass="text-blue-600 dark:text-blue-400"
                        />
                        <InfoCard
                            icon={Mail}
                            label="Correo Electrónico"
                            value={email}
                            colorClass="text-emerald-600 dark:text-emerald-400"
                        />
                        {(userBdd?.empresaId || userBdd?.empleadoId) && (
                            <InfoCard
                                icon={Building}
                                label="Organización"
                                colorClass="text-orange-600 dark:text-orange-400"
                            >
                                <div className="space-y-2 mt-2">
                                    {userBdd?.empresaId && (
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">Empresa ID</span>
                                            <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{userBdd.empresaId}</code>
                                        </div>
                                    )}
                                    {userBdd?.empleadoId && (
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">Empleado ID</span>
                                            <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{userBdd.empleadoId}</code>
                                        </div>
                                    )}
                                </div>
                            </InfoCard>
                        )}
                        <InfoCard
                            icon={Globe}
                            label="Método de Registro"
                            colorClass="text-indigo-600 dark:text-indigo-400"
                            value={`${getRegistrationType(userBdd?.tipoRegistro || "")} Authentication`}
                        />
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="professional" className="space-y-6">
                <ProfessionalInfoCard userBdd={userBdd} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ContactInfoCard userBdd={userBdd} />
                    <EmergencyContactCard userBdd={userBdd} />
                </div>

                <PreferencesCard userBdd={userBdd} />
            </TabsContent>

            <TabsContent value="logistics" className="space-y-6">
                <DriverLicenseCard userBdd={userBdd} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <CertificationsCard userBdd={userBdd} />
                    <AssignedVehiclesCard userBdd={userBdd} />
                </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
                <ManageTwoFactorCard />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <BackupCodesCard />
                    <TrustedDevicesCard />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-purple-500" />
                                Detalles de Autenticación
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-slate-500" />
                                    <span className="text-sm font-medium">Creado en Firebase</span>
                                </div>
                                <span className="text-sm font-bold">
                                    {currentUser?.metadata.creationTime ? format(new Date(currentUser.metadata.creationTime), "PPP", { locale: es }) : "N/A"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <Activity className="h-4 w-4 text-slate-500" />
                                    <span className="text-sm font-medium">Último inicio de sesión</span>
                                </div>
                                <span className="text-sm font-bold">
                                    {currentUser?.metadata.lastSignInTime ? format(new Date(currentUser.metadata.lastSignInTime), "PPP", { locale: es }) : "N/A"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <UserIcon className="h-4 w-4 text-slate-500" />
                                    <span className="text-sm font-medium">User ID</span>
                                </div>
                                <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                    {currentUser?.uid}
                                </code>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Link className="h-5 w-5 text-blue-500" />
                                Proveedores Vinculados
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {currentUser?.providerData.map((provider: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                        <div className="flex items-center gap-3">
                                            <Globe className="h-4 w-4 text-slate-500" />
                                            <span className="font-medium capitalize">{provider.providerId}</span>
                                        </div>
                                        {provider.email && <span className="text-xs text-slate-500">{provider.email}</span>}
                                    </div>
                                ))}
                                {(!currentUser?.providerData || currentUser.providerData.length === 0) && (
                                    <p className="text-sm text-slate-500">No hay proveedores vinculados.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>
        </Tabs>
    )
}
