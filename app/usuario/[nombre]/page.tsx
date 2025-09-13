"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/auth-context";
import { AlertCircle, CheckCircle, Edit3, Eye, Globe, Mail, Shield, Star, TrendingUp, XCircle } from "lucide-react";
import { use } from "react";

const UsuarioNomrePage = ({ params }: { params: Promise<{ nombre: string }> }) => {
    const { nombre } = use(params);
    const decodedName = nombre ? decodeURIComponent(nombre) : '';

    const { currentUser, userBdd } = useAuth()

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "activo":
                return {
                    variant: "default" as const,
                    icon: CheckCircle,
                    color: "text-emerald-600",
                    bgColor: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800",
                    label: "Active",
                }
            case "pendiente":
                return {
                    variant: "secondary" as const,
                    icon: AlertCircle,
                    color: "text-amber-600",
                    bgColor: "bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800",
                    label: "Pending",
                }
            case "suspendido":
                return {
                    variant: "destructive" as const,
                    icon: XCircle,
                    color: "text-red-600",
                    bgColor: "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800",
                    label: "Suspended",
                }
            default:
                return {
                    variant: "outline" as const,
                    icon: AlertCircle,
                    color: "text-slate-600",
                    bgColor: "bg-slate-50 border-slate-200 dark:bg-slate-950 dark:border-slate-800",
                    label: "Unknown",
                }
        }
    }

    const getRegistrationType = (type: string) => {
        return type === "google" ? "Google" : "Email"
    }
    const profilePicture = userBdd?.avatarUrl || currentUser?.photoURL
    const email = userBdd?.email || currentUser?.email || "Not provided"
    const getInitials = (name: string) => {
        if (name === "Not provided") return "U"
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    const calculateProfileCompletion = () => {
        const fields = [
            userBdd?.nombre,
            userBdd?.email,
            userBdd?.avatarUrl,
            userBdd?.rol,
            userBdd?.empresaId,
            userBdd?.empleadoId,
        ]
        const completedFields = fields.filter((field) => field && field !== "").length
        return Math.round((completedFields / fields.length) * 100)
    }

    const statusConfig = getStatusConfig(userBdd?.estado || "")
    const StatusIcon = statusConfig.icon
    const profileCompletion = calculateProfileCompletion()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
            <div className="max-w-7xl mx-auto p-6 space-y-8">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-800 dark:via-slate-700 dark:to-slate-900 text-white shadow-2xl border border-slate-200 dark:border-slate-700">
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
                                        <h1 className="text-4xl lg:text-5xl font-bold text-balance bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                                            {decodedName}
                                        </h1>
                                        <div className="flex items-center space-x-3 text-slate-300">
                                            <Mail className="h-5 w-5" />
                                            <span className="text-xl font-medium">{email}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                        <Badge
                                            variant="secondary"
                                            className="px-4 py-2 text-sm font-semibold bg-white/10 text-white border-white/20 backdrop-blur-sm hover:bg-white/20 transition-colors"
                                        >
                                            <StatusIcon className="h-4 w-4 mr-2" />
                                            {statusConfig.label ? "Activo" : "Inactivo"}
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="px-4 py-2 text-sm font-semibold bg-white/5 text-white border-white/20 backdrop-blur-sm"
                                        >
                                            <Globe className="h-4 w-4 mr-2" />
                                            Cuenta de {getRegistrationType(userBdd?.tipoRegistro || "")}
                                        </Badge>
                                        {userBdd?.rol && (
                                            <Badge
                                                variant="secondary"
                                                className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border-blue-400/30 backdrop-blur-sm"
                                            >
                                                <Shield className="h-4 w-4 mr-2" />
                                                {userBdd.rol}
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
                                    className="border-white/20 text-white hover:bg-white/10 font-semibold px-6 bg-transparent"
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
            </div>
        </div>
    )
}

export default UsuarioNomrePage