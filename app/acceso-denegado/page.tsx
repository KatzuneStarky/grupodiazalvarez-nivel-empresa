"use client"

import { Progress } from "@/components/ui/progress";
import { AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AccesoDenegado = () => {
    const [countdown, setCountdown] = useState<number>(10);
    const [progress, setProgress] = useState<number>(100);
    const router = useRouter();

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prevCount) => {
                if (prevCount <= 1) {
                    clearInterval(timer);
                    router.push('/');
                    return 0;
                }
                return prevCount - 1;
            });
        }, 1000);

        const progressTimer = setInterval(() => {
            setProgress((prevProgress) => {
                const newProgress = (countdown / 10) * 100;
                return newProgress;
            });
        }, 100);

        return () => {
            clearInterval(timer);
            clearInterval(progressTimer);
        };
    }, [router, countdown]);

    const handleRedirect = () => {
        router.push('/');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-background">
            <div className="max-w-md w-full p-8 bg-card rounded-lg shadow-lg border border-border">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-destructive/10">
                    <AlertCircle className="w-8 h-8 text-destructive" />
                </div>

                <h1 className="text-3xl font-bold mb-3">Acceso Denegado</h1>

                <p className="mb-6 text-muted-foreground text-lg">
                    No tienes permiso para acceder a esta página.
                </p>

                <div className="mb-8">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-muted-foreground" />
                        <p className="text-muted-foreground">
                            Redirigiéndose a la página principal en <span className="font-bold text-foreground">{countdown}</span> segundos
                        </p>
                    </div>

                    <div className="relative pt-1">
                        <Progress value={progress} className="h-2" />
                    </div>
                </div>

                <div className="space-y-4">
                    <Button
                        onClick={handleRedirect}
                        className="w-full"
                        size="lg"
                    >
                        Ir a la página principal
                    </Button>

                    <p className="text-xs text-muted-foreground">
                        Si crees que esto es un error, por favor contacte al administrador.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default AccesoDenegado