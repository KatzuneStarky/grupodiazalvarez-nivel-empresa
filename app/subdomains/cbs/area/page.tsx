"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDuration } from "@/utils/format-duration";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react"

const CBSAreaPage = () => {
    const [waitingTime, setWaitingTime] = useState<number>(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setWaitingTime(prevTime => prevTime + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Cuenta pendiente de aprobacion</CardTitle>
                    <CardDescription>
                        Su cuenta se encuentra en proceso de aprovacion
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col items-center space-y-6 pt-4">
                    <div className="flex flex-col items-center justify-center">
                        <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
                        <p className="text-sm text-muted-foreground">
                            Esperando a que un administrador acepte al usuario
                        </p>
                    </div>

                    <div className="bg-muted p-4 rounded-lg w-full">
                        <p className="text-sm leading-relaxed">
                            Su cuenta está actualmente pendiente de aprobación.
                            Un administrador revisará su información y le asignará un área en breve.
                            Se le notificará por correo electrónico una vez que su cuenta haya sido aprobada.
                        </p>
                    </div>

                    <div className="flex items-center justify-center bg-primary/5 rounded-full px-4 py-2">
                        <span className="text-sm font-medium">
                            Tiempo de espera: {formatDuration(waitingTime)}
                        </span>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2 justify-between">
                    <Button
                        variant="outline"
                        className="w-full sm:w-auto"
                    //onClick={logout}
                    >
                        Cerrar sesion
                    </Button>
                    <Button
                        className="w-full sm:w-auto"
                        asChild
                    >
                        <a href="mailto:support@example.com">Contacta al administrador</a>
                    </Button>
                </CardFooter>
            </Card>

            <p className="mt-8 text-sm text-muted-foreground">
                Si tiene alguna pregunta no dude en contactar al administrador
            </p>
        </div>
    )
}

export default CBSAreaPage