"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDirectLink } from "@/hooks/use-direct-link"
import { IconGasStation } from "@tabler/icons-react"
import { Truck, UserPlus, Users } from "lucide-react"
import { useRouter } from "next/navigation"

const MainActions = () => {
    const { directLink } = useDirectLink("")
    const router = useRouter()
    return (
        <Card className="w-full h-full">
            <CardContent className="h-full">
                <CardHeader>
                    <CardTitle>
                        Acciones rapidas
                    </CardTitle>
                    <CardDescription>
                        Acciones rapidas para generar nuevos registros en la base de datos
                    </CardDescription>
                </CardHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-5">
                    <Button
                        className="card flex flex-col items-center justify-center w-full h-full bg-muted rounded-lg"
                        onClick={() => router.push(`${directLink}/equipos/registros/nuevo`)}
                    >
                        <Truck className="size-16" />
                        <h1 className="text-2xl font-bold my-4">Nuevo equipo</h1>
                    </Button>
                    <Button
                        className="card flex flex-col items-center justify-center w-full h-full bg-muted rounded-lg"
                        onClick={() => router.push(`${directLink}/operadores/nuevo`)}
                    >
                        <UserPlus className="size-16" />
                        <h1 className="text-2xl font-bold my-4">Nuevo operador</h1>
                    </Button>
                    <Button
                        className="card flex flex-col items-center justify-center w-full h-full bg-muted rounded-lg"
                        onClick={() => router.push(`${directLink}/clientes/nuevo`)}
                    >
                        <Users className="size-16" />
                        <h1 className="text-2xl font-bold my-4">Nuevo cliente</h1>
                    </Button>
                    <Button
                        className="card flex flex-col items-center justify-center w-full h-full bg-muted rounded-lg"
                        onClick={() => router.push(`${directLink}/estaciones/nuevo`)}
                    >
                        <IconGasStation className="size-16" />
                        <h1 className="text-2xl font-bold my-4">Nueva estacion</h1>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default MainActions