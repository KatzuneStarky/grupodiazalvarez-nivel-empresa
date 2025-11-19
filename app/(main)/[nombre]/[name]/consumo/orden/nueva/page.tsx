"use client"

import { OrdenDeConsumoSchema, OrdenDeConsumoType } from "@/modules/logistica/consumo/schema/orden-consumo.schema"
import OrdenConsumoForm from "@/modules/logistica/consumo/components/orden/orden-consumo-form"
import { useOrdenesConsumos } from "@/modules/logistica/consumo/hooks/use-ordenes-consumos"
import { useOperadores } from "@/modules/logistica/bdd/operadores/hooks/use-estaciones"
import { useEquipos } from "@/modules/logistica/bdd/equipos/hooks/use-equipos"
import { writeOrdenConsumo } from "@/modules/logistica/consumo/actions/write"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import SubmitButton from "@/components/global/submit-button"
import PageTitle from "@/components/custom/page-title"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/context/auth-context"
import Icon from "@/components/global/icon"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { toast } from "sonner"

const NuevaOrdenConsumoPage = () => {
    const [isSubmitting, setIsSubmiting] = useState<boolean>(false)
    const { ordenesConsumos } = useOrdenesConsumos()
    const { operadores } = useOperadores()
    const { equipos } = useEquipos()
    const { userBdd } = useAuth()

    const lastOrdenConsumo = ordenesConsumos.sort((a, b) => b.folio - a.folio)[0]

    const form = useForm<OrdenDeConsumoType>({
        resolver: zodResolver(OrdenDeConsumoSchema),
        defaultValues: {
            destino: "",
            equipoId: "",
            operadorId: "",
            estado: "GENERADA",
            fecha: new Date(),
            folio: 0,
            kilometraje: 0,
            numEconomico: "",
            observaciones: "",
            operadorNombre: "",
            mediciones: {
                antes: {
                    diesel: 0,
                    medidaTablero: 0,
                    medidaTanque: 0
                },
                despues: {
                    diesel: 0,
                    medidaTablero: 0,
                    medidaTanque: 0
                }
            }
        }
    })

    const equipoId = form.watch("equipoId")
    const numEconomico = equipos.find((equipo) => equipo.id === equipoId)?.numEconomico || "No encontrado"

    const operadorId = form.watch("operadorId")
    const operadorNombre = operadores.find((operador) => operador.id === operadorId)?.nombres
    const operadorApellidos = operadores.find((operador) => operador.id === operadorId)?.apellidos
    const operadorNombreCompleto
        = operadorNombre && operadorApellidos
            ? `${operadorNombre} ${operadorApellidos}`
            : "No encontrado"

    const onSubmit = async (data: OrdenDeConsumoType) => {
        try {
            setIsSubmiting(true)

            toast.promise(writeOrdenConsumo({
                folio: lastOrdenConsumo?.folio || 1,
                estado: "GENERADA",
                destino: data.destino,
                fecha: parseFirebaseDate(data.fecha),
                idEquipo: data.equipoId,
                numEconomico: numEconomico,
                idOperador: data.operadorId,
                operador: operadorNombreCompleto,
                kilometraje: data.kilometraje,
                mediciones: {
                    antes: {
                        diesel: data.mediciones.antes.diesel,
                        medidaTablero: data.mediciones.antes.medidaTablero,
                        medidaTanque: data.mediciones.antes.medidaTanque
                    },
                    despues: {
                        diesel: 0,
                        medidaTablero: 0,
                        medidaTanque: 0
                    }
                },
                observaciones: data.observaciones,
            }), {
                loading: "Creando registro de orden, favor de esperar...",
                success: (result) => {
                    if (result.success) {
                        return result.message;
                    } else {
                        throw new Error(result.message);
                    }
                },
                error: (error) => {
                    return error.message || "Error al registrar la orden.";
                },
            })

            form.reset()
            //window.location.reload()
        } catch (error) {
            console.error(error)
            toast.error("Error al generar la nueva orden de consumo")
        } finally {
            setIsSubmiting(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <PageTitle
                title={"Nuevo registro de orden de consumo"}
                description={"Ingrese la información necesaria para generar la nueva orden de consumo"}
                icon={<Icon iconName="picon:fuel" className="w-12 h-12 text-primary" />}
            />
            <Separator className="mt-4" />
            <OrdenConsumoForm
                lastFolio={lastOrdenConsumo?.folio || 1}
                operadorNombre={operadorNombreCompleto}
                numEconomico={numEconomico}
                isSubmiting={isSubmitting}
                operadores={operadores}
                operadorId={operadorId}
                onSubmit={onSubmit}
                equipoId={equipoId}
                equipos={equipos}
                form={form}
                submitButton={
                    <SubmitButton
                        isSubmiting={isSubmitting}
                        text="Generar orden"
                        loadingText="Generando nueva orden"
                    />
                }
            />
        </div>
    )
}

export default NuevaOrdenConsumoPage