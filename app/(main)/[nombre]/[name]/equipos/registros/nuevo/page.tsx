"use client"

import { EquiposSchema, EquiposSchemaType } from "@/modules/logistica/equipos/schemas/equipo.schema"
import { EstadoEquipos } from "@/modules/logistica/bdd/equipos/enum/estado-equipos"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { useState } from "react"

const NuevoEquipoPage = () => {
    const [isSubmitting, setIsSubmiting] = useState<boolean>(false)

    const form = useForm<EquiposSchemaType>({
        resolver: zodResolver(EquiposSchema),
        defaultValues: {
            activo: true,
            estado: EstadoEquipos.DISPONIBLE,
            gpsActivo: false,
            idOperador: "",
            m3: 0,
            marca: "",
            modelo: "",
            numEconomico: "",
            permisoSCT: {
                numero: "",
                tipo: "",
                vigenciaHasta: new Date()
            },
            placas: "",
            rendimientoPromedioKmPorLitro: 0,
            seguro: {
                aseguradora: "",
                numeroPoliza: "",
                tipoCobertura: "",
                vigenciaHasta: new Date()
            },
            serie: "",
            tipoTanque: "",
            tipoUnidad: "",
            ultimaUbicacion: {
                direccionAproximada: "",
                fecha: new Date(),
                latitud: 0,
                longitud: 0
            },
            ultimoConsumo: {
                fecha: new Date(),
                litros: 0,
                odometro: 0
            },
            year: 0
        }
    })

    const onSubmit = async(data: EquiposSchemaType) => {

    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>

                </form>
            </Form>
        </div>
    )
}

export default NuevoEquipoPage