"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import UploadViajesExcel from "@/components/global/upload-viajes-excel"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

const UploadViajesDialog = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Importar datos
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