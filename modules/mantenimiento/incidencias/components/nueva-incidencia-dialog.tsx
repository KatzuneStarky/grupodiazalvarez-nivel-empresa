"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { getDownloadURL, ref as storageRef, uploadBytesResumable } from "firebase/storage"
import { EvidenciaSchemaType } from "../../mantenimientos/schemas/mantenimiento.schema"
import { IncidenciaSchema, IncidenciaSchemaType } from '../schema/incidencia.schema'
import IncidenciasForm, { PendingFile } from './incidencias-form'
import SubmitButton from '@/components/global/submit-button'
import { zodResolver } from '@hookform/resolvers/zod'
import { writeIncidencia } from '../actions/write'
import { Button } from '@/components/ui/button'
import { storage } from "@/firebase/client"
import { useForm } from 'react-hook-form'
import { v7 as uuidv7 } from "uuid";
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface NuevaIncidenciaDialogProps {
    operadorId: string
    equipoId: string
}

const NuevaIncidenciaDialog = ({ operadorId, equipoId }: NuevaIncidenciaDialogProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([])
    const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
    const [isUploading, setIsUploading] = useState(false)
    const now = new Date()

    const form = useForm<IncidenciaSchemaType>({
        resolver: zodResolver(IncidenciaSchema),
        defaultValues: {
            operadorId,
            equipoId,
            categoria: "Seguridad",
            estado: "Reportada",
            tipo: "Mecanica",
            severidad: "Baja",
            fecha: new Date(),
            ubicacion: {
                latitud: 0,
                longitud: 0,
                direccionAproximada: "",
            },
            kmActual: 0,
            nivelCombustible: 0,
            velocidadAprox: 0,
            operable: false,
            evidencias: [],
            mantenimientoId: "",
        },
    })

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || [])

        const newPendingFiles: PendingFile[] = files.map((file) => ({
            file,
            preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
            id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }))

        setPendingFiles((prev) => [...prev, ...newPendingFiles])

        event.target.value = ""
    }

    const handleRemovePendingFile = (id: string) => {
        setPendingFiles((prev) => {
            const fileToRemove = prev.find((f) => f.id === id)
            if (fileToRemove?.preview) {
                URL.revokeObjectURL(fileToRemove.preview)
            }
            return prev.filter((f) => f.id !== id)
        })
        setUploadProgress((prev) => {
            const newProgress = { ...prev }
            delete newProgress[id]
            return newProgress
        })
    }

    const uploadSingleFile = (pendingFile: PendingFile): Promise<EvidenciaSchemaType> => {
        return new Promise((resolve, reject) => {
            const path = `incidencias/${operadorId} - ${equipoId}`
            const fileRef = storageRef(storage, `${path}/${pendingFile.file.name}`)
            const uploadTask = uploadBytesResumable(fileRef, pendingFile.file)

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    setUploadProgress((prev) => ({ ...prev, [pendingFile.id]: progress }))
                },
                (error) => {
                    console.error("Error uploading file:", error)
                    reject(error)
                },
                async () => {
                    const url = await getDownloadURL(uploadTask.snapshot.ref)
                    const evidencia: EvidenciaSchemaType = {
                        nombre: pendingFile.file.name,
                        ruta: url,
                        tipo: pendingFile.file.type,
                    }
                    resolve(evidencia)
                }
            )
        })
    }

    const uploadPendingFiles = async (): Promise<EvidenciaSchemaType[]> => {
        if (pendingFiles.length === 0) return []

        setIsUploading(true)
        const uploadedEvidencias: EvidenciaSchemaType[] = []

        try {
            for (const pendingFile of pendingFiles) {
                const evidencia = await uploadSingleFile(pendingFile)
                uploadedEvidencias.push(evidencia)
            }

            // Limpiar previews
            pendingFiles.forEach((f) => {
                if (f.preview) URL.revokeObjectURL(f.preview)
            })
            setPendingFiles([])
            setUploadProgress({})

            // toast.success(`${uploadedEvidencias.length} archivo(s) subido(s) correctamente`)
            return uploadedEvidencias
        } catch (error) {
            toast.error("Error al subir algunos archivos")
            throw error
        } finally {
            setIsUploading(false)
        }
    }

    const onSubmit = async (data: IncidenciaSchemaType) => {
        try {
            setIsSubmitting(true)

            let evidenciasSubidas: EvidenciaSchemaType[] = []
            if (pendingFiles.length > 0) {
                evidenciasSubidas = await uploadPendingFiles()
            }

            const evidenciasFinales = [
                ...data.evidencias.map((evidencia) => ({
                    ...evidencia,
                    id: uuidv7(),
                    createAt: now,
                    updateAt: now,
                })),
                ...evidenciasSubidas.map((evidencia) => ({
                    ...evidencia,
                    id: uuidv7(),
                    createAt: now,
                    updateAt: now,
                }))
            ]

            await writeIncidencia({
                descripcion: data.descripcion,
                equipoId: equipoId,
                fecha: data.fecha,
                operadorId: operadorId,
                tipo: data.tipo,
                severidad: data.severidad,
                ubicacion: {
                    latitud: data.ubicacion?.latitud ?? 0,
                    longitud: data.ubicacion?.longitud ?? 0,
                    direccionAproximada: data.ubicacion?.direccionAproximada ?? "",
                },
                estado: data.estado,
                kmActual: data.kmActual,
                nivelCombustible: data.nivelCombustible,
                velocidadAprox: data.velocidadAprox,
                operable: data.operable,
                categoria: data.categoria,
                mantenimientoId: data.mantenimientoId,
                evidencias: evidenciasFinales,
            }, equipoId)

            toast.success("Incidencia guardada correctamente")

            form.reset()
            setPendingFiles([])
            setUploadProgress({})
        } catch (error) {
            console.log(error)
            toast.error("Error al guardar la incidencia")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                    Nueva incidencia
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-7xl h-[85vh] flex flex-col p-0 gap-0">
                <DialogHeader className="p-6 pb-2 shrink-0">
                    <DialogTitle>Nueva incidencia</DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-hidden p-6 pt-2 h-full">
                    <IncidenciasForm
                        isSubmitting={isSubmitting || isUploading}
                        operadorId={operadorId}
                        equipoId={equipoId}
                        onSubmit={onSubmit}
                        form={form}
                        pendingFiles={pendingFiles}
                        handleFileChange={handleFileChange}
                        handleRemovePendingFile={handleRemovePendingFile}
                        uploadProgress={uploadProgress}
                        submitButton={
                            <SubmitButton
                                isSubmiting={isSubmitting || isUploading}
                                text='Guardar'
                                loadingText='Guardando...'
                            />
                        }
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default NuevaIncidenciaDialog