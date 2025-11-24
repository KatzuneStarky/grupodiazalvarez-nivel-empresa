"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Mail, Shield, Globe } from "lucide-react"
import { LucideIcon } from "lucide-react"

interface ProfileHeaderProps {
    displayName: string
    email: string | null | undefined
    profilePicture: string | null
    getInitials: (name: string) => string
    statusConfig: {
        label: string
        color: string
        bgColor: string
    }
    StatusIcon: LucideIcon
    userBdd: {
        rol?: string
        tipoRegistro?: string
    } | null
}

export const ProfileHeader = ({
    displayName,
    email,
    profilePicture,
    getInitials,
    statusConfig,
    StatusIcon,
    userBdd
}: ProfileHeaderProps) => {
    return (
        <div className="relative overflow-hidden rounded-3xl shadow-xl bg-card border-b border-slate-200 dark:border-slate-700 mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10" />
            <div className="relative p-8 lg:p-10">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="relative group">
                        <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 opacity-20 group-hover:opacity-40 transition duration-300 blur-sm" />
                        <Avatar className="relative h-32 w-32 border-4 border-white dark:border-slate-800 shadow-2xl">
                            <AvatarImage src={profilePicture || undefined} alt={displayName} className="object-cover" />
                            <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                                {getInitials(displayName)}
                            </AvatarFallback>
                        </Avatar>
                        <div
                            className={`absolute -bottom-2 -right-2 p-2.5 rounded-full ${statusConfig.bgColor} border-4 border-white dark:border-slate-800 shadow-lg`}
                        >
                            <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} />
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div className="space-y-1">
                            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                                {displayName}
                            </h1>
                            <div className="flex items-center justify-center md:justify-start space-x-2 text-slate-500 dark:text-slate-400">
                                <Mail className="h-4 w-4" />
                                <span className="text-lg font-medium">{email}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <Badge
                                variant="secondary"
                                className="px-3 py-1.5 text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                            >
                                <StatusIcon className="h-3.5 w-3.5 mr-1.5" />
                                {statusConfig.label}
                            </Badge>

                            {userBdd?.rol && (
                                <Badge
                                    variant="outline"
                                    className="px-3 py-1.5 text-sm font-medium border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20 capitalize"
                                >
                                    <Shield className="h-3.5 w-3.5 mr-1.5" />
                                    {userBdd.rol.replace("_", " ")}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
