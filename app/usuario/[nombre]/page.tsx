"use client"

import { Activity, ArrowLeft, Award, Building, Calendar, Clock, Download, Edit3, Eye, FileText, Globe, Link, Mail, Settings, Shield, Star, TrendingUp, UserIcon, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePerfilUsuario } from "@/modules/usuarios/hooks/use-perfil-usuario";
import { AnimatedToggleMode } from "@/components/global/animated-toggle-mode";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { parseFirebaseDate } from "@/utils/parse-timestamp-date";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import { use } from "react";

const UsuarioNomrePage = ({ params }: { params: Promise<{ nombre: string }> }) => {
    const { nombre } = use(params);
    const decodedName = nombre ? decodeURIComponent(nombre) : '';
    const router = useRouter()

    const {
        StatusIcon,
        currentUser,
        email,
        getInitials,
        getRegistrationType,
        profileCompletion,
        profilePicture,
        statusConfig,
        userBdd
    } = usePerfilUsuario()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
            <div className="absolute top-2 left-2">
                <Button variant={"outline"} onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Regresar a su area
                </Button>
            </div>

            <div className="absolute top-2 right-2">
                <AnimatedToggleMode />
            </div>
            <div className="max-w-7xl mx-auto p-6 space-y-8">
                <div className="relative overflow-hidden rounded-3xl shadow-xl bg-card border-b border-slate-200 dark:border-slate-700">
                    <div className="relative p-8 lg:p-12">
                        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
                                <div className="relative group">
                                    <div className="absolute -inset-1 rounded-full transition duration-300" />
                                    <Avatar className="relative h-32 w-32 border-4 border-white/20 shadow-2xl backdrop-blur-sm">
                                        <AvatarImage src={profilePicture || undefined} alt={decodedName} className="object-cover" />
                                        <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                                            {getInitials(decodedName)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div
                                        className={`absolute -bottom-2 -right-2 p-3 rounded-full ${statusConfig.bgColor} border-4 border-white shadow-lg`}
                                    >
                                        <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <h1 className="text-4xl lg:text-5xl font-bold text-balance bg-gradient-to-r from-black to-slate-50 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                                            {decodedName}
                                        </h1>
                                        <div className="flex items-center space-x-3 text-black dark:text-slate-300">
                                            <Mail className="h-5 w-5" />
                                            <span className="text-xl font-medium">{email}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                        <Badge
                                            variant="secondary"
                                            className="px-4 py-2 text-sm font-semibold dark:bg-white/10 dark:text-white border-white/20 backdrop-blur-sm hover:bg-white/20 transition-colors"
                                        >
                                            <StatusIcon className="h-4 w-4 mr-2" />
                                            {statusConfig.label ? "Activo" : "Inactivo"}
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="px-4 py-2 text-sm font-semibold dark:bg-white/5 dark:text-white border-white/20 backdrop-blur-sm"
                                        >
                                            <Globe className="h-4 w-4 mr-2" />
                                            Cuenta de {getRegistrationType(userBdd?.tipoRegistro || "")}
                                        </Badge>
                                        {userBdd?.rol && (
                                            <Badge
                                                variant="secondary"
                                                className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:text-white border-blue-400/30 backdrop-blur-sm capitalize"
                                            >
                                                <Shield className="h-4 w-4 mr-2" />
                                                {userBdd.rol.replace("_", " ")}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
                                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 shadow-lg font-semibold px-6">
                                    <Edit3 className="h-5 w-5 mr-2" />
                                    Editar Perfil
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-white/20 dark:text-white hover:bg-white/10 font-semibold px-6 bg-transparent"
                                >
                                    <Eye className="h-5 w-5 mr-2" />
                                    Ver detalles
                                </Button>
                            </div>
                        </div>

                        <div className="mt-8 p-6 bg-slate-800/90 backdrop-blur-md rounded-2xl border border-white/20">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <TrendingUp className="h-5 w-5 text-blue-300" />
                                    <span className="text-lg font-semibold text-white">
                                        Complementacion del perfil
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-2xl font-bold text-white">{profileCompletion}%</span>
                                    <Star className="h-5 w-5 text-yellow-400" />
                                </div>
                            </div>
                            <Progress value={profileCompletion} className="h-3 bg-slate-700/50" />
                            <p className="text-sm text-slate-200 mt-2">
                                {profileCompletion === 100
                                    ? "Tu perfil esta completo"
                                    : "Aun falta informacion por llenar"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Estado de la cuenta</p>
                                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{statusConfig.label}</p>
                                </div>
                                <div className="p-3 bg-blue-200 dark:bg-blue-800 rounded-full">
                                    <StatusIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Porcentaje de completado</p>
                                    <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{profileCompletion}%</p>
                                </div>
                                <div className="p-3 bg-emerald-200 dark:bg-emerald-800 rounded-full">
                                    <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between gap-2">
                                <div>
                                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Nivel de acceso</p>
                                    <p className="text-xl font-bold text-purple-900 dark:text-purple-100 capitalize">
                                        {userBdd?.rol?.replace("_", " ") || "Usuario"}
                                    </p>
                                </div>
                                <div className="p-3 bg-purple-200 dark:bg-purple-800 rounded-full">
                                    <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Registration</p>
                                    <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                                        {getRegistrationType(userBdd?.tipoRegistro || "")}
                                    </p>
                                </div>
                                <div className="p-3 bg-amber-200 dark:bg-amber-800 rounded-full">
                                    <Globe className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <Card className="xl:col-span-2">
                        <CardHeader className="pb-6 border-b border-slate-200 dark:border-slate-700">
                            <CardTitle className="text-2xl font-bold flex items-center text-slate-900 dark:text-slate-100">
                                <UserIcon className="h-6 w-6 mr-3 text-blue-600" />
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="group p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                                <UserIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                                                Full Name
                                            </span>
                                        </div>
                                        <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{decodedName}</p>
                                    </div>

                                    <div className="group p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                                                <Mail className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                                                Email Address
                                            </span>
                                        </div>
                                        <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 break-all">{email}</p>
                                    </div>

                                    {userBdd?.rol && (
                                        <div className="group p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                                    <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                                </div>
                                                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                                                    Role & Permissions
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Badge
                                                    variant="secondary"
                                                    className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-700 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-600"
                                                >
                                                    <Award className="h-4 w-4 mr-2" />
                                                    {userBdd?.rol}
                                                </Badge>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    {(userBdd?.empresaId || userBdd?.empleadoId) && (
                                        <div className="group p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                                    <Building className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                                </div>
                                                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                                                    Organization
                                                </span>
                                            </div>
                                            <div className="space-y-4">
                                                {userBdd?.empresaId && (
                                                    <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Company ID</span>
                                                        <code className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm font-mono font-semibold text-slate-800 dark:text-slate-200">
                                                            {userBdd?.empresaId}
                                                        </code>
                                                    </div>
                                                )}
                                                {userBdd?.empleadoId && (
                                                    <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Employee ID</span>
                                                        <code className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm font-mono font-semibold text-slate-800 dark:text-slate-200">
                                                            {userBdd?.empleadoId}
                                                        </code>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="group p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                                                <Globe className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                                                Registration Method
                                            </span>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className="px-4 py-2 text-sm font-bold border-2 border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300"
                                        >
                                            {getRegistrationType(userBdd?.tipoRegistro || "")} Authentication
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-xl">
                        <CardHeader className="pb-6 border-b border-slate-200 dark:border-slate-700">
                            <CardTitle className="text-2xl font-bold flex items-center text-slate-900 dark:text-slate-100">
                                <Activity className="h-6 w-6 mr-3 text-emerald-600" />
                                Activity Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="p-6 rounded-2xl bg-slate-800 text-white shadow-lg border border-slate-600">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="p-2 bg-slate-700 rounded-lg">
                                        <Clock className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="text-sm font-semibold uppercase tracking-wide text-white">Last Access</span>
                                </div>
                                <p className="text-xl font-bold text-white">{format(parseFirebaseDate(userBdd?.ultimoAcceso), "PPP", { locale: es })}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-slate-600">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                            <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Account Created</span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                        {format(parseFirebaseDate(userBdd?.creadoEn), "PPP", { locale: es })}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-slate-600">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                            <Settings className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Last Updated</span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                        {format(parseFirebaseDate(userBdd?.actualizadoEn), "PPP", { locale: es })}
                                    </span>
                                </div>
                            </div>

                            <Separator className="my-6" />

                            <div className="space-y-3">
                                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center">
                                    <FileText className="h-5 w-5 mr-2 text-slate-600 dark:text-slate-400" />
                                    Quick Actions
                                </h4>
                                <div className="grid grid-cols-1 gap-2">
                                    <Button variant="outline" size="sm" className="justify-start font-semibold bg-transparent">
                                        <Download className="h-4 w-4 mr-2" />
                                        Export Profile
                                    </Button>
                                    <Button variant="outline" size="sm" className="justify-start font-semibold bg-transparent">
                                        <Users className="h-4 w-4 mr-2" />
                                        View Team
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl flex items-center">
                            <Globe className="h-5 w-5 mr-2 text-primary" />
                            Authentication Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border border-blue-200 dark:border-blue-800">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Firebase Creation</span>
                                </div>
                                <p className="font-semibold text-lg text-blue-900 dark:text-blue-100">
                                    {format(parseFirebaseDate(currentUser?.metadata.creationTime), "PPP", { locale: es })}
                                </p>
                            </div>

                            <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border border-green-200 dark:border-green-800">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Activity className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    <span className="text-sm font-medium text-green-800 dark:text-green-200">Last Sign In</span>
                                </div>
                                <p className="font-semibold text-lg text-green-900 dark:text-green-100">
                                    {format(parseFirebaseDate(currentUser?.metadata.lastSignInTime), "PPP", { locale: es })}
                                </p>
                            </div>

                            <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border border-purple-200 dark:border-purple-800">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                    <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Email Verified</span>
                                </div>
                                <Badge variant={currentUser?.emailVerified ? "default" : "destructive"} className="font-semibold">
                                    {currentUser?.emailVerified ? "Verified" : "Unverified"}
                                </Badge>
                            </div>

                            <div className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border border-orange-200 dark:border-orange-800">
                                <div className="flex items-center space-x-2 mb-2">
                                    <UserIcon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                    <span className="text-sm font-medium text-orange-800 dark:text-orange-200">User ID</span>
                                </div>
                                <code className="text-xs font-mono bg-orange-200 dark:bg-orange-800 px-2 py-1 rounded text-orange-900 dark:text-orange-100">
                                    {currentUser?.uid.slice(0, 8)}...
                                </code>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {currentUser?.providerData && currentUser?.providerData.length > 0 && (
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl flex items-center">
                                <Link className="h-5 w-5 mr-2 text-primary" />
                                Linked Authentication Providers
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {currentUser?.providerData.map((provider, index) => (
                                    <div key={index} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Globe className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">Provider</span>
                                        </div>
                                        <Badge variant="outline" className="font-semibold">
                                            {provider.providerId}
                                        </Badge>
                                        {provider.email && <p className="text-xs text-muted-foreground mt-2">{provider.email}</p>}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

export default UsuarioNomrePage