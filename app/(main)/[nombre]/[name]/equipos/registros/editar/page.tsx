"use client"

import { EquiposSchema, EquiposSchemaType } from "@/modules/logistica/equipos/schemas/equipo.schema"
import { EstadoEquipos } from "@/modules/logistica/bdd/equipos/enum/estado-equipos"
import { useEquipos } from "@/modules/logistica/bdd/equipos/hooks/use-equipos"
import EquipoForm from "@/modules/logistica/equipos/components/equipo-form"
import { updateEquipo } from "@/modules/logistica/equipos/actions/write"
import SubmitButton from "@/components/global/submit-button"
import { useRouter, useSearchParams } from "next/navigation"
import PageTitle from "@/components/custom/page-title"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Truck } from "lucide-react"
import { toast } from "sonner"

const EditarEquipoPage = () => {
    const [isSubmitting, setIsSubmiting] = useState<boolean>(false)
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const searchParams = useSearchParams()
    const { equipos } = useEquipos()
    const router = useRouter()

    const equipoId = searchParams.get("equipoId")
    const equipo = equipos.find((equipo) => equipo.id === equipoId)

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

    const handleImageUpload = (url: string) => {
        console.log("Image uploaded:", url)
        setImageUrl(url)
    }

    const onSubmit = async (data: EquiposSchemaType) => {
        try {
            setIsSubmiting(true)

            toast.promise(updateEquipo({
                ...data,
                imagen: imageUrl || equipo?.imagen || "",
            }, equipoId || ""), {
                loading: `Actualizando el equipo ${equipo?.numEconomico}, favor de esperar...`,
                success: (result) => {
                    if (result.success) {
                        return result.message;
                    } else {
                        throw new Error(result.message);
                    }
                },
                error: (error) => {
                    return error.message || "Error al actualizar el equipo.";
                },
            })

            form.reset()
            router.back()
        } catch (error) {
            toast.error("Error al actualizar el equipo")
            console.log(error);
        } finally {
            setIsSubmiting(false)
        }
    }

    useEffect(() => {
        if (!equipo) return

        const currentValues = form.getValues()

        if (!currentValues.numEconomico) {
            form.setValue("numEconomico", equipo.numEconomico)
            form.setValue("marca", equipo.marca)
            form.setValue("modelo", equipo.modelo)
            form.setValue("year", equipo.year)
            form.setValue("m3", equipo.m3 ?? 0)
            form.setValue("tipoUnidad", equipo.tipoUnidad)
            form.setValue("placas", equipo.placas)
            form.setValue("serie", equipo.serie)
            form.setValue("tipoTanque", equipo.tipoTanque)
            form.setValue("activo", equipo.activo)
            form.setValue("estado", equipo.estado)
            form.setValue("ultimaUbicacion", equipo.ultimaUbicacion)
            form.setValue("gpsActivo", equipo.gpsActivo)
            form.setValue("rendimientoPromedioKmPorLitro", equipo.rendimientoPromedioKmPorLitro)
            form.setValue("ultimoConsumo", equipo.ultimoConsumo)
            form.setValue("seguro", equipo.seguro)
            form.setValue("permisoSCT", equipo.permisoSCT)
            form.setValue("idOperador", equipo.idOperador)
            form.setValue("grupoUnidad", equipo.grupoUnidad)
            form.setValue("imagen", equipo.imagen)
        }
    }, [equipo, form])

    return (
        <div className="container mx-auto px-4 py-8">
            <PageTitle
                description={"Edite la información necesaria para actualizar el equipo actual"}
                title={`Actualizar los datos del equipo ${equipo?.numEconomico}`}
                icon={<Truck className="h-12 w-12 text-primary" />}
            />
            <Separator className="mt-4" />
            <EquipoForm
                form={form}
                isSubmiting={isSubmitting}
                onSubmit={onSubmit}
                equipoId={equipoId || ""}
                handleImageUpload={handleImageUpload}
                imageUrl={imageUrl || ""}
                setImageUrl={setImageUrl}
                submitButton={
                    <SubmitButton
                        isSubmiting={isSubmitting}
                        text="Actualizar el equipo"
                        loadingText="Actualizando el equipo..."
                    />
                }
            />
        </div>
    )
}

export default EditarEquipoPage