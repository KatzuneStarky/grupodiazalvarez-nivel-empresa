"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { NewDocumentDialog } from "../../documentos/components/new-document-dialog"
import { Fuel, FileText, User, Route, Zap, Truck } from "lucide-react"
import { useDirectLink } from "@/hooks/use-direct-link"
import { Button } from "@/components/ui/button"

export function FleetActionsSheet() {
    const { directLink } = useDirectLink("")

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Zap className="mr-2 h-4 w-4" />
                    Acciones rapidas
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Acciones rapidas</SheetTitle>
                    <SheetDescription>
                        Maneje los datos de la flota de manera rapida y eficiente
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-3">
                    <Button
                        className="h-auto mx-4 justify-start gap-3 bg-blue-500/10 py-4 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300"
                        variant="outline"
                        onClick={() => window.location.href = `${directLink}/equipos/registros/nuevo`}
                    >
                        <Truck className="mr-2 h-4 w-4" />
                        Agregar equipo
                    </Button>
                    <Button
                        className="h-auto mx-4 justify-start gap-3 py-4 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300"
                        variant="outline"
                        onClick={() => window.location.href = `${directLink}/equipos/tanques/nuevo`}
                    >
                        <Fuel className="mr-2 h-4 w-4" />
                        Agregar tanque
                    </Button>
                    <NewDocumentDialog>
                        <Button
                            className="h-auto mx-4 justify-start gap-3 py-4 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300"
                            variant="outline"
                        >
                            <FileText className="mr-2 h-4 w-4" />
                            Subir documentos
                        </Button>
                    </NewDocumentDialog>
                    <Button
                        className="h-auto mx-4 justify-start gap-3 py-4 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300"
                        variant="outline"
                        onClick={() => window.location.href = `${directLink}/operadores/nuevo`}
                    >
                        <User className="mr-2 h-4 w-4" />
                        Agregar operador
                    </Button>
                    <Button
                        className="h-auto mx-4 justify-start gap-3 py-4 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                        variant="outline"
                        onClick={() => window.location.href = `${directLink}/equipos/rutas/nuevo`}
                    >
                        <Route className="mr-2 h-4 w-4" />
                        Crear nueva ruta
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}