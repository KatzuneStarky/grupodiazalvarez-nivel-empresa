"use client"

import { EstacionDeServicioSchema, EstacionDeServicioType } from "@/modules/logistica/estaciones/schemas/estacion-servicio.schema"
import EstacionesForm from "@/modules/logistica/estaciones/components/estaciones-form"
import { useEstaciones } from "@/modules/logistica/estaciones/hooks/use-estaciones"
import { updateEstacion } from "@/modules/logistica/estaciones/actions/write"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { useRouter, useSearchParams } from "next/navigation"
import SubmitButton from "@/components/global/submit-button"
import PageTitle from "@/components/custom/page-title"
import { zodResolver } from "@hookform/resolvers/zod"
import { Separator } from "@/components/ui/separator"
import { IconGasStation } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const EditarEstacionPage = () => {
    const [isSubmiting, setIsSubmiting] = useState<boolean>(false)
    const searchParams = useSearchParams()
    const { estaciones } = useEstaciones()
    const router = useRouter()

    const estacionId = searchParams.get("estacionId")
    const estacion = estaciones?.find((estacion) => estacion.id === estacionId)

    const form = useForm<EstacionDeServicioType>({
        resolver: zodResolver(EstacionDeServicioSchema),
        defaultValues: {
            activo: true,
            contacto: [],
            direccion: {
                calle: "",
                colonia: "",
                estado: "",
                pais: "",
                ciudad: "",
                codigoPostal: "",
                numeroExterior: "",
                numeroInterior: ""
            },
            fechaRegistro: new Date(),
            horarios: "",
            nombre: "",
            numeroPermisoCRE: "",
            productos: [],
            razonSocial: "",
            rfc: "",
            tanques: [],
            ubicacion: {
                lat: 0,
                lng: 0
            }
        }
    })

    const onSubmit = async (data: EstacionDeServicioType) => {
        try {
            setIsSubmiting(true)
            toast.promise(updateEstacion({
                activo: data.activo,
                contacto: data.contacto.map(contacto => ({
                    email: contacto.email,
                    responsable: contacto.responsable,
                    telefono: contacto.telefono,
                    cargo: contacto.cargo
                })),
                direccion: {
                    calle: data.direccion.calle,
                    colonia: data.direccion.colonia,
                    estado: data.direccion.estado,
                    pais: data.direccion.pais,
                    ciudad: data.direccion.ciudad,
                    codigoPostal: data.direccion.codigoPostal,
                    numeroExterior: data.direccion.numeroExterior,
                    numeroInterior: data.direccion.numeroInterior || "",
                },
                fechaRegistro: data.fechaRegistro,
                nombre: data.nombre,
                tanques: data.tanques.map(tanque => ({
                    capacidadActual: tanque.capacidadActual,
                    capacidadTotal: tanque.capacidadTotal,
                    tipoCombustible: tanque.tipoCombustible,
                    fechaUltimaRecarga: tanque.fechaUltimaRecarga,
                    numeroTanque: tanque.numeroTanque
                })),
                horarios: data.horarios,
                numeroPermisoCRE: data.numeroPermisoCRE,
                productos: data.tanques.map((tanque) => tanque.tipoCombustible),
                razonSocial: data.razonSocial,
                rfc: data.rfc,
                ubicacion: {
                    lat: data.ubicacion?.lat || 0,
                    lng: data.ubicacion?.lng || 0
                }
            }, estacionId || ""), {
                loading: "Creando registro de estacion de servicio, favor de esperar...",
                success: (result) => {
                    if (result.success) {
                        return result.message;
                    } else {
                        throw new Error(result.message);
                    }
                },
                error: (error) => {
                    return error.message || "Error al registrar la estacion de servicio.";
                },
                finally: () => {
                    setIsSubmiting(false)
                }
            })

            form.reset()
            router.back()
        } catch (error) {
            console.log(error)
            toast.error("Error al guardar la estación")
        } finally {
            setIsSubmiting(false)
        }
    }

    useEffect(() => {
        if (!estacion) return

        const currentValues = form.getValues()
        if (!currentValues.nombre) {
            const contactos = Array.isArray(estacion.contacto)
                ? estacion.contacto
                : estacion.contacto
                    ? [estacion.contacto]
                    : []

            form.setValue("numeroPermisoCRE", estacion.numeroPermisoCRE || "")
            form.setValue("razonSocial", estacion.razonSocial || "")
            form.setValue("rfc", estacion.rfc || "")
            form.setValue("nombre", estacion.nombre)
            form.setValue("fechaRegistro", parseFirebaseDate(estacion.fechaRegistro) || new Date())
            form.setValue("horarios", estacion.horarios || "")
            form.setValue("activo", estacion.activo)
            form.setValue("tanques", estacion.tanques.map((tanque) => ({
                capacidadActual: tanque.capacidadActual,
                capacidadTotal: tanque.capacidadTotal,
                tipoCombustible: tanque.tipoCombustible || "Magna",
                fechaUltimaRecarga: parseFirebaseDate(tanque.fechaUltimaRecarga) || new Date(),
                numeroTanque: tanque.numeroTanque || ""
            })))
            form.setValue("contacto", contactos.map((contacto) => ({
                email: contacto.email || "",
                responsable: contacto.responsable || "",
                telefono: contacto.telefono || "",
                cargo: contacto.cargo || "Gerente",
            })))
            form.setValue("direccion", estacion.direccion)
            form.setValue("ubicacion", estacion.ubicacion)
        }
    }, [estacion, form])

    return (
        <div className="container mx-auto px-4 py-8">
            <PageTitle
                description={`Actualice la información de la estación (${estacion?.razonSocial})`}
                title={`Actualizar la estacion ${estacion?.nombre}`}
                icon={<IconGasStation className="h-12 w-12 text-primary" />}
            />
            <Separator className="mt-4" />
            <EstacionesForm
                form={form}
                isSubmiting={isSubmiting}
                onSubmit={onSubmit}
                submitButton={
                    <SubmitButton
                        isSubmiting={isSubmiting}
                        text="Actualizar la estacion"
                        loadingText="Actualizando la estacion..."
                    />
                }
            />
        </div>
    )
}

export default EditarEstacionPage