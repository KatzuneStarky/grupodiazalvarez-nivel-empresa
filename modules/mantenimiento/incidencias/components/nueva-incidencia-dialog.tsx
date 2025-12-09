"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { IncidenciaSchema, IncidenciaSchemaType } from '../schema/incidencia.schema'
import SubmitButton from '@/components/global/submit-button'
import { zodResolver } from '@hookform/resolvers/zod'
import { writeIncidencia } from '../actions/write'
import IncidenciasForm from './incidencias-form'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import React, { useState } from 'react'
import { v7 as uuidv7 } from "uuid";
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

interface NuevaIncidenciaDialogProps {
    operadorId: string
    equipoId: string
}

const NuevaIncidenciaDialog = ({ operadorId, equipoId }: NuevaIncidenciaDialogProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
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

    const onSubmit = async (data: IncidenciaSchemaType) => {
        try {
            setIsSubmitting(true)

            toast.promise(writeIncidencia({
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
                evidencias: data.evidencias.map((evidencia) => ({
                    ...evidencia,
                    id: uuidv7(),
                    createAt: now,
                    updateAt: now,
                })),
            }, equipoId), {
                loading: "Guardando incidencia...",
                success: "Incidencia guardada correctamente",
                error: "Error al guardar la incidencia"
            })

            form.reset()
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
            <DialogContent className="max-w-7xl">
                <DialogHeader>
                    <DialogTitle>Nueva incidencia</DialogTitle>
                </DialogHeader>

                <IncidenciasForm
                    isSubmitting={isSubmitting}
                    operadorId={operadorId}
                    equipoId={equipoId}
                    onSubmit={onSubmit}
                    form={form}
                    submitButton={
                        <SubmitButton
                            isSubmiting={isSubmitting}
                            text='Guardar'
                            loadingText='Guardando...'
                        />
                    }
                />
            </DialogContent>
        </Dialog>
    )
}

export default NuevaIncidenciaDialog