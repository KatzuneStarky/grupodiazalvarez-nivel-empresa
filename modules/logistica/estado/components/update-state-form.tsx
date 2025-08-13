"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EstadoEquipos } from "../../bdd/equipos/enum/estado-equipos";
import { Equipo } from "../../bdd/equipos/types/equipos";
import { updateEquipoEstado } from "../actions/write";
import { Button } from "@/components/ui/button";
import Icon from "@/components/global/icon";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const UpdateEstadoEquipoForm = ({ equipo }: { equipo: Equipo | null }) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [estado, setEstado] = useState<EstadoEquipos | undefined>(equipo?.estado);
    const router = useRouter();

    const handleEstadoChange = (value: EstadoEquipos) => {
        setEstado(value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await updateEquipoEstado(equipo?.id || "", estado || "");
            toast.success(`Se ha actualizado el estado del equipo ${equipo?.numEconomico}`);
            router.refresh();
        } catch (error) {
            console.error("Error actualizando el estado del equipo:", error);
            toast.error(`Error actualizando el estado del equipo ${equipo?.numEconomico}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center w-full">
            <Select
                value={estado || ''}
                onValueChange={handleEstadoChange}
                disabled={isSubmitting}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione un estado" />
                </SelectTrigger>
                <SelectContent>
                    {Object.values(EstadoEquipos).map((estado) => (
                        <SelectItem key={estado} value={estado}>
                            {estado.replace(/_/g, ' ')}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Button
                type="submit"
                className="mt-4"
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <Loader className="animate-spin" />
                ) : (
                    <Icon iconName="material-symbols:save" />
                )}
                {isSubmitting ? "Actualizando..." : "Actualizar estado"}
            </Button>
        </form>
    )
}

export default UpdateEstadoEquipoForm