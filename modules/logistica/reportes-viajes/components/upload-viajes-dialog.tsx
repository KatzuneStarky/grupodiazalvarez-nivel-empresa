"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import UploadViajesExcel from "@/components/global/upload-viajes-excel"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

const UploadViajesDialog = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    className="h-auto mx-4 justify-start gap-3 bg-amber-500/10 py-4 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300"
                    variant="outline"
                >
                    <Upload className="h-5 w-5" />
                    <div className="flex flex-col items-start">
                        <span className="font-medium">Importar viajes</span>
                        <span className="text-xs text-muted-foreground">
                            Importar datos de viajes desde un archivo Excel
                        </span>
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Importar datos</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Importar datos de viajes desde un archivo Excel
                </DialogDescription>
                <UploadViajesExcel />
            </DialogContent>
        </Dialog>
    )
}

export default UploadViajesDialog