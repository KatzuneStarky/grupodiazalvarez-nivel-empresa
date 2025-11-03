"use client"

import { Button } from "../ui/button"
import Icon from "../global/icon"
import { toast } from "sonner"

const ExportFirebaseDatabutton = () => {
    const handleExport = async () => {
        try {
            const response = await fetch("/api/firebase/export")
            console.log(response);
            
            //if (!response.ok) throw new Error("Error al exportar los datos")

            const blob = await response.blob()
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = "firestore-export.json"
            document.body.appendChild(link)
            link.click()
            link.remove()
            URL.revokeObjectURL(url)

            toast.success("Datos exportados exitosamente 🚀")
        } catch (error: any) {
            toast.error("Error al exportar datos")
            console.error(error)
        }
    }

    return (
        <Button onClick={handleExport}>
            <Icon iconName="line-md:file-export" />
            Export Firebase Data
        </Button>
    )
}

export default ExportFirebaseDatabutton