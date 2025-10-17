"use client"

import { Button } from "@/components/ui/button"
import { QRCodeCanvas } from "qrcode.react"
import { QrCode } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"

const DeailogQr = ({
    id,
    numEconomico,
    serie,
    qrCodeRef
}: {
    id: string,
    numEconomico: string,
    serie: string,
    qrCodeRef: React.RefObject<HTMLDivElement | null>
}) => {
    const shortSerie = serie.slice(serie.length - 6, serie.length)
    const nombreArchivo = `${numEconomico}_${shortSerie}_qrcode.png`

    const downloadQRCode = () => {
        if (!qrCodeRef.current) return
        try {
            if (qrCodeRef.current) {
                const canvas = qrCodeRef.current.querySelector("canvas");

                if (canvas) {
                    const image = canvas.toDataURL("image/png");
                    const link = document.createElement("a");
                    link.href = image;
                    link.download = nombreArchivo;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    toast.success("QR descargado correctamente",
                        {
                            description: `Descargado como: ${nombreArchivo}`,
                            icon: (<QrCode className="mr-2" />)
                        }
                    )
                }
            }
        } catch (error) {
            console.log(error);
            toast.error("Error al descargar el QR", { description: `${error}` })
        }
    };

    return (
        <Dialog>
            <DialogTrigger>
                <div ref={qrCodeRef} className="rounded-xl cursor-pointer">
                    <QRCodeCanvas
                        value={`https://www.grupodiazalvarez.com/protegido/equipo?equipoId=${id}`}
                        className="border-4 rounded-xl"
                        size={300}
                    />
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Descarga del codigo QR para uso empresarial</DialogTitle>
                </DialogHeader>

                <div className="flex items-center justify-center w-full">
                    <div
                        ref={qrCodeRef}
                        className="rounded-xl group inline-block"
                    >
                        <QRCodeCanvas
                            value={`https://www.grupodiazalvarez.com/protegido/equipo?equipoId=${id}`}
                            className="border-4 rounded-xl"
                            size={400}
                        />

                        <Button
                            className={`
                                w-32 absolute right-36 top-20 
                                opacity-0 translate-y-4
                                group-hover:opacity-100 group-hover:translate-y-0
                                transition-all duration-300 ease-in-out
                                flex items-center gap-2
                            `}
                            onClick={downloadQRCode}
                        >
                            <QrCode />
                            Descargar QR
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DeailogQr