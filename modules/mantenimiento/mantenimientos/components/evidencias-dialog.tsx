"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Evidencia } from "@/modules/logistica/bdd/equipos/types/mantenimiento"
import ImageGallery from "react-image-gallery";
import { Button } from "@/components/ui/button"
import { Image } from "lucide-react"

import "react-image-gallery/styles/css/image-gallery.css";

const EvidenciasDialog = ({
    evidencias
}: {
    evidencias: Evidencia[] | null
}) => {
    const images = evidencias?.map((e) => ({
        original: e.ruta,
        thumbnail: e.ruta,
    })) || []

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="flex items-center justify-center">
                    <Button variant={"outline"} className="w-8 h-8">
                        <Image className="w-4 h-4" />
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-5xl">
                <DialogHeader>
                    <DialogTitle>
                        Evidencias
                    </DialogTitle>
                </DialogHeader>

                {evidencias?.length === 0 ? (
                    <div className="space-y-2">
                        <div className="text-center py-8 text-gray-500 dark:text-gray-200">
                            <Image className="h-24 w-24 mx-auto mb-4 text-gray-300" />
                            <p>No hay evidencias</p>
                            <p className="text-sm">Edite el mantenimiento para agregarlas</p>
                        </div>
                    </div>
                ) : <ImageGallery items={images} showBullets showFullscreenButton showIndex />}
            </DialogContent>
        </Dialog>
    )
}

export default EvidenciasDialog