"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconGasStation } from "@tabler/icons-react"
import { Truck, UserPlus, Users } from "lucide-react"

const MainActions = () => {
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
                    <div className="card flex flex-col items-center justify-center w-full h-full bg-muted rounded-lg">
                        <Truck className="w-24 h-24" />
                        <h1 className="text-2xl font-bold my-4">Nuevo equipo</h1>
                    </div>
                    <div className="card flex flex-col items-center justify-center w-full h-full bg-muted rounded-lg">
                        <UserPlus className="w-24 h-24" />
                        <h1 className="text-2xl font-bold my-4">Nuevo operador</h1>
                    </div>
                    <div className="card flex flex-col items-center justify-center w-full h-full bg-muted rounded-lg">
                        <Users className="w-24 h-24" />
                        <h1 className="text-2xl font-bold my-4">Nuevo cliente</h1>
                    </div>
                    <div className="card flex flex-col items-center justify-center w-full h-full bg-muted rounded-lg">
                        <IconGasStation className="w-24 h-24" />
                        <h1 className="text-2xl font-bold my-4">Nueva estacion</h1>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default MainActions