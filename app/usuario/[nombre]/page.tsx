"use client"

import { ArrowLeft } from "lucide-react";
import { usePerfilUsuario } from "@/modules/usuarios/hooks/use-perfil-usuario";
import { AnimatedToggleMode } from "@/components/global/animated-toggle-mode";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { use } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileHeader } from "@/modules/usuarios/components/profile-header";
import { ProfileTabs } from "@/modules/usuarios/components/profile-tabs";

const UsuarioNombrePage = ({ params }: { params: Promise<{ nombre: string }> }) => {
    const { nombre } = use(params);
    const decodedNameParam = nombre ? decodeURIComponent(nombre) : '';
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
        userBdd,
        isLoading
    } = usePerfilUsuario()

    // Use userBdd name if available, otherwise fallback to URL param
    const displayName = userBdd?.nombre || decodedNameParam;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
                <div className="max-w-5xl mx-auto space-y-8">
                    <Skeleton className="h-[200px] w-full rounded-3xl" />
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-[400px] rounded-xl" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="h-32 w-full rounded-xl" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <div className="absolute top-4 left-4 z-10">
                <Button variant={"ghost"} onClick={() => router.back()} className="hover:bg-slate-200 dark:hover:bg-slate-800">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Regresar
                </Button>
            </div>

            <div className="absolute top-4 right-4 z-10">
                <AnimatedToggleMode />
            </div>

            <div className="max-w-5xl mx-auto p-6 lg:p-10 space-y-8">
                <ProfileHeader
                    displayName={displayName}
                    email={email}
                    profilePicture={profilePicture || ""}
                    getInitials={getInitials}
                    statusConfig={statusConfig}
                    StatusIcon={StatusIcon}
                    userBdd={userBdd}
                />

                <ProfileTabs
                    displayName={displayName}
                    email={email}
                    userBdd={userBdd}
                    currentUser={currentUser}
                    profileCompletion={profileCompletion}
                    statusConfig={statusConfig}
                    StatusIcon={StatusIcon}
                    getRegistrationType={getRegistrationType}
                />
            </div>
        </div>
    )
}

export default UsuarioNombrePage