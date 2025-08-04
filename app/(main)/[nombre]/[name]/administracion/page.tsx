"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import CreateAreaMenuForm from "@/modules/admin-area/components/menu-form"
import { useEmpresa } from "@/context/empresa-context"
import { Separator } from "@/components/ui/separator"
import { useArea } from "@/context/area-context"
import { Button } from "@/components/ui/button"
import Icon from "@/components/global/icon"
import MenuOrder from "@/modules/admin-area/components/menu-order"

const AdministracionPage = () => {
    const { empresa } = useEmpresa()
    const { area } = useArea()

    return (
        <div className="flex flex-col justify-center gap-4 w-full">
            <div className="flex items-center justify-end w-full">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="w-44 py-2 my-4">
                            <Icon iconName="ri:menu-add-fill" />
                            Agregar nuevo menu
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
                            areaId={area?.id || ""}
                            empresaName={empresa?.nombre || ""}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <Separator />

            <div className="flex flex-col items-center justify-center w-full">
                <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight 
                    text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                    Configuracion del menu
                </h1>
                <p className="mb-6 text-lg font-normal text-gray-500 
                    lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
                    Puedes modificar el orden, editar o eliminar los menús de tu área
                </p>
            </div>

            <MenuOrder areaId={area?.id || ""} />
        </div>
    )
}

export default AdministracionPage