"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Eye } from "lucide-react"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { useState } from "react"

interface EquipoImageDialogProps {
    src: string
    numEconomico: string,
    imagenes?: string[]
}

const EquipoImageDialog = ({
    src,
    numEconomico,
    imagenes
}: EquipoImageDialogProps) => {
    const [selectedImage, setSelectedImage] = useState<string>("")
    const imagesArray = [src, ...imagenes || []] as string[]

    const downloadImage = () => {
        const link = document.createElement('a')
        link.href = selectedImage
        link.download = `equipo-${numEconomico}.jpg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Ver imagen completa
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>
                        Foto del equipo {numEconomico}
                    </DialogTitle>
                </DialogHeader>

                <div className="w-full max-w-2xl mx-auto p-4">
                    <Carousel>
                        <CarouselContent>
                            {imagesArray.map((image, index) => {
                                //setSelectedImage(image)
                                return (
                                    <CarouselItem key={index} onLoad={() => setSelectedImage(image)}>
                                        <img
                                            src={image}
                                            alt={`equipo-${numEconomico}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </CarouselItem>
                                )
                            })}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>

                <DialogFooter>
                    <Button onClick={downloadImage}>
                        <Download className="w-4 h-4 mr-2" />
                        Descargar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EquipoImageDialog