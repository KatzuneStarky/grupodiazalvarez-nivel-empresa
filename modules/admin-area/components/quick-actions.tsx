"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cog, Download, Plus, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import CreateAreaMenuForm from "./menu-form"

const QuickActions = ({ areaId, empresaName }: { areaId: string, empresaName: string }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant={"default"} className="h-auto p-4 flex flex-col items-start space-y-2">
                                <Plus className="h-5 w-5" />
                                <div className="text-left">
                                    <div className="font-medium text-sm">Agregar menu</div>
                                    <div className="text-xs text-muted-foreground">
                                        Agregar un nuevo menu a la lista
                                    </div>
                                </div>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>
                                    Crea un nuevo menu
                                </DialogTitle>
                                <DialogDescription>
                                    Agrega un nuevo link a tu área,
                                    ten en cuenta que se debe contactar
                                    al administrador para tener en cuenta los cambios.
                                </DialogDescription>
                            </DialogHeader>
                            <CreateAreaMenuForm
                                areaId={areaId}
                                empresaName={empresaName}
                            />
                        </DialogContent>
                    </Dialog>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant={"outline"} className="h-auto p-4 flex flex-col items-start space-y-2">
                                <UserPlus className="h-5 w-5" />
                                <div className="text-left">
                                    <div className="font-medium text-sm">Invitar usuario</div>
                                    <div className="text-xs text-muted-foreground">
                                        Invita un nuevo usuario a tu área
                                    </div>
                                </div>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>
                                </DialogTitle>
                                <DialogDescription>
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant={"outline"} className="h-auto p-4 flex flex-col items-start space-y-2">
                                <Download className="h-5 w-5" />
                                <div className="text-left">
                                    <div className="font-medium text-sm">Exportar datos</div>
                                    <div className="text-xs text-muted-foreground">
                                        Exportar datos del area actual
                                    </div>
                                </div>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>
                                </DialogTitle>
                                <DialogDescription>
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant={"outline"} className="h-auto p-4 flex flex-col items-start space-y-2">
                                <Cog className="h-5 w-5" />
                                <div className="text-left">
                                    <div className="font-medium text-sm">Configurar area</div>
                                    <div className="text-xs text-muted-foreground text-wrap">
                                        Configuracion del area actual,
                                        aqui puedes cambiar el nombre,
                                        la descripcion y la imagen del area.
                                    </div>
                                </div>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>
                                </DialogTitle>
                                <DialogDescription>
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    )
}

export default QuickActions