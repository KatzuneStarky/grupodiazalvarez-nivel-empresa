import { useAuth } from "@/context/auth-context"
import { AlertCircle, CheckCircle, XCircle } from "lucide-react"

export const usePerfilUsuario = () => {
    const { currentUser, userBdd } = useAuth()

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "activo":
                return {
                    variant: "default" as const,
                    icon: CheckCircle,
                    color: "text-emerald-600",
                    bgColor: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800",
                    label: "Activo",
                }
            case "pendiente":
                return {
                    variant: "secondary" as const,
                    icon: AlertCircle,
                    color: "text-amber-600",
                    bgColor: "bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800",
                    label: "Pendiente",
                }
            case "suspendido":
                return {
                    variant: "destructive" as const,
                    icon: XCircle,
                    color: "text-red-600",
                    bgColor: "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800",
                    label: "Suspendido",
                }
            default:
                return {
                    variant: "outline" as const,
                    icon: AlertCircle,
                    color: "text-slate-600",
                    bgColor: "bg-slate-50 border-slate-200 dark:bg-slate-950 dark:border-slate-800",
                    label: "Desconocido",
                }
        }
    }

    const getRegistrationType = (type: string) => {
        return type === "google" ? "Google" : "Email"
    }
    const profilePicture = userBdd?.avatarUrl || currentUser?.photoURL
    const email = userBdd?.email || currentUser?.email || "Desconocido"
    
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

    return {
        currentUser,
        userBdd,
        getStatusConfig,
        getRegistrationType,
        profilePicture,
        email,
        getInitials,
        statusConfig,
        StatusIcon,
        profileCompletion,
        calculateProfileCompletion,
    }
}