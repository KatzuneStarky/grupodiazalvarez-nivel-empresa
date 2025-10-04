"use client"

import { RutaSchema, RutaSchemaType } from "@/modules/logistica/rutas/schemas/ruta.schema"
import { useRutas } from "@/modules/logistica/rutas/hooks/use-rutas"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import { useEffect, useState } from "react"
import SubmitButton from "@/components/global/submit-button"
import PageTitle from "@/components/custom/page-title"
import { Route } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import RoutesForm from "@/modules/logistica/rutas/components/routes-form"
import { toast } from "sonner"
import { updateRoute } from "@/modules/logistica/rutas/actions/write"

const EditarRutaPage = () => {
    const [selectionMode, setSelectionMode] = useState<"none" | "origin" | "destination">("none")
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const searchParams = useSearchParams()
    const { rutas } = useRutas()
    const router = useRouter()
    const newId = uuidv4()

    const rutaId = searchParams.get("rutaId")
    const ruta = rutas?.find((ruta) => ruta.id === rutaId)

    const form = useForm<RutaSchemaType>({
        resolver: zodResolver(RutaSchema),
        defaultValues: {
            activa: true,
            clasificacion: "material peligroso",
            descripcion: "",
            destino: {
                latitud: 0,
                longitud: 0,
                nombre: ""
            },
            idCliente: "",
            origen: {
                latitud: 0,
                longitud: 0,
                nombre: ""
            },
            tipoViaje: "local",
            trayecto: {
                activo: true,
                destino: {
                    latitud: 0,
                    longitud: 0,
                    nombre: ""
                },
                origen: {
                    latitud: 0,
                    longitud: 0,
                    nombre: ""
                },
                horas: 0,
                kilometros: 0,
                tipoTrayecto: "redondo"
            },
            viajeFacturable: true
        }
    })

    const onSubmit = (data: RutaSchemaType) => {
        try {
            setIsSubmitting(true)

            toast.promise(updateRoute({
                activa: data.activa,
                clasificacion: data.clasificacion,
                descripcion: data.descripcion,
                destino: {
                    latitud: data.destino.latitud,
                    longitud: data.destino.longitud,
                    nombre: data.destino.nombre
                },
                idCliente: newId,
                origen: {
                    latitud: data.origen.latitud,
                    longitud: data.origen.longitud,
                    nombre: data.origen.nombre
                },
                tipoViaje: data.tipoViaje,
                trayecto: {
                    activo: data.activa,
                    destino: {
                        latitud: data.destino.latitud,
                        longitud: data.destino.longitud,
                        nombre: data.destino.nombre
                    },
                    horas: data.trayecto.horas,
                    id: newId,
                    kilometros: data.trayecto.kilometros,
                    origen: {
                        latitud: data.origen.latitud,
                        longitud: data.origen.longitud,
                        nombre: data.origen.nombre
                    },
                    tipoTrayecto: data.trayecto.tipoTrayecto
                },
                viajeFacturable: data.viajeFacturable,
            }, rutaId || ""), {
                loading: "Actualizando el registro de la ruta, favor de esperar...",
                success: (result) => {
                    if (result.success) {
                        return result.message;
                    } else {
                        throw new Error(result.message);
                    }
                },
                error: (error) => {
                    return error.message || "Error al actualizar la ruta.";
                },
            })

            form.reset()
            router.back()
        } catch (error) {
            toast.error("Error al actualizar la ruta")
            console.log(error);
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        if (!ruta) return

        const currentValues = form.getValues()
        if (!currentValues.origen || !currentValues.descripcion) {
            form.setValue("idCliente", ruta.idCliente),
                form.setValue("origen", ruta.origen || currentValues.origen)
            form.setValue("destino", ruta.destino || currentValues.destino)
            form.setValue("descripcion", ruta.descripcion || currentValues.descripcion)
            form.setValue("tipoViaje", ruta.tipoViaje)
            form.setValue("clasificacion", ruta.clasificacion)
            form.setValue("activa", ruta.activa)
            form.setValue("viajeFacturable", ruta.viajeFacturable)
            form.setValue("trayecto", ruta.trayecto)
        }

    }, [ruta, form])

    return (
        <div className="container mx-auto px-4 py-8">
            <PageTitle
                description={`Actualice los datos y modifique si es necesario la ruta de punto A a punto B en el mapa`}
                title={`Actualizacion de la ruta`}
                icon={<Route className="h-12 w-12 text-primary" />}
            />
            <Separator className="my-8" />
            <RoutesForm
                form={form}
                isSubmiting={isSubmitting}
                onSubmit={onSubmit}
                selectionMode={selectionMode}
                setSelectionMode={setSelectionMode}
                submitButton={
                    <SubmitButton
                        isSubmiting={isSubmitting}
                        loadingText="Actualizando ruta..."
                        text="Actualizar ruta"
                    />
                }
            />
        </div>
    )
}

export default EditarRutaPage