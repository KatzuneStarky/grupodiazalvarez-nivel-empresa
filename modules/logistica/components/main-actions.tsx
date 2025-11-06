"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Plus, Truck, Users, UserPlus, MapPin, FileText, Zap } from "lucide-react"
import { useDirectLink } from "@/hooks/use-direct-link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function MainActions() {
    const { directLink } = useDirectLink("")
    const router = useRouter()

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                    <Zap className="h-4 w-4" />
                    Acciones Rápidas
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Acciones Rápidas</SheetTitle>
                    <SheetDescription>Crear y gestionar recursos del sistema</SheetDescription>
                </SheetHeader>
                <div className="grid gap-3">
                    <Button
                        className="h-auto mx-4 justify-start gap-3 bg-blue-500/10 py-4 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300"
                        variant="outline"
                    >
                        <Plus className="h-5 w-5" />
                        <div className="flex flex-col items-start">
                            <span className="font-medium">Nuevo Viaje</span>
                            <span className="text-xs text-muted-foreground">Registrar un nuevo viaje</span>
                        </div>
                    </Button>

                    <Button
                        className="h-auto mx-4 justify-start gap-3 bg-emerald-500/10 py-4 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300"
                        variant="outline"
                        onClick={() => router.push(`${directLink}/clientes/nuevo`)}
                    >
                        <Users className="h-5 w-5" />
                        <div className="flex flex-col items-start">
                            <span className="font-medium">Nuevo Cliente</span>
                            <span className="text-xs text-muted-foreground">Agregar cliente al sistema</span>
                        </div>
                    </Button>

                    <Button
                        className="h-auto mx-4 justify-start gap-3 bg-purple-500/10 py-4 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300"
                        variant="outline"
                        onClick={() => router.push(`${directLink}/equipos/registros/nuevo`)}
                    >
                        <Truck className="h-5 w-5" />
                        <div className="flex flex-col items-start">
                            <span className="font-medium">Nuevo Equipo</span>
                            <span className="text-xs text-muted-foreground">Registrar nuevo vehículo</span>
                        </div>
                    </Button>

                    <Button
                        className="h-auto mx-4 justify-start gap-3 bg-amber-500/10 py-4 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300"
                        variant="outline"
                        onClick={() => router.push(`${directLink}/operadores/nuevo`)}
                    >
                        <UserPlus className="h-5 w-5" />
                        <div className="flex flex-col items-start">
                            <span className="font-medium">Nuevo Operador</span>
                            <span className="text-xs text-muted-foreground">Registrar nuevo operador</span>
                        </div>
                    </Button>

                    <Button
                        className="h-auto mx-4 justify-start gap-3 bg-red-500/10 py-4 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                        variant="outline"
                        onClick={() => router.push(`${directLink}/clientes/nuevo`)}
                    >
                        <UserPlus className="h-5 w-5" />
                        <div className="flex flex-col items-start">
                            <span className="font-medium">Nuevo Cliente</span>
                            <span className="text-xs text-muted-foreground">Registrar nuevo cliente</span>
                        </div>
                    </Button>

                    <Button
                        className="h-auto mx-4 justify-start gap-3 bg-cyan-500/10 py-4 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300"
                        variant="outline"
                        onClick={() => router.push(`${directLink}/equipos/rutas/nuevo`)}
                    >
                        <MapPin className="h-5 w-5" />
                        <div className="flex flex-col items-start">
                            <span className="font-medium">Nueva Ruta</span>
                            <span className="text-xs text-muted-foreground">Crear nueva ruta de entrega</span>
                        </div>
                    </Button>

                    <Button
                        className="h-auto mx-4 justify-start gap-3 bg-rose-500/10 py-4 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300"
                        variant="outline"
                    >
                        <FileText className="h-5 w-5" />
                        <div className="flex flex-col items-start">
                            <span className="font-medium">Generar Reporte</span>
                            <span className="text-xs text-muted-foreground">Exportar datos y análisis</span>
                        </div>
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}