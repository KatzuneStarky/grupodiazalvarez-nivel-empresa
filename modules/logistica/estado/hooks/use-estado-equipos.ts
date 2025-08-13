import { EstadoEquipos } from "../../bdd/equipos/enum/estado-equipos";
import { Equipo } from "../../bdd/equipos/types/equipos";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UseEstadoEquipoProps {
    equipos: Equipo[];
    isLoading: boolean;
}

export const useEstadoEquipo = ({ equipos, isLoading }: UseEstadoEquipoProps) => {
    const [loading, setIsLoading] = useState<boolean>(false);
    const [estadoCount, setEstadoCount] = useState<{ [key in EstadoEquipos]: number }>({
        DISPONIBLE: 0,
        EN_TALLER: 0,
        EN_VIAJE: 0,
        FUERA_DE_SERVICIO: 0,
        DISPONIBLE_CON_DETALLES: 0,
    });

    const router = useRouter();

    useEffect(() => {
        const tiempoDeRecarga = 300000;

        const recargarPagina = () => {
            router.refresh();
        };

        const timeoutId = setTimeout(recargarPagina, tiempoDeRecarga);

        return () => clearTimeout(timeoutId);
    }, [router]);

    const contarEquiposPorEstado = () => {
        setIsLoading(true);

        const initialCounts = {
            DISPONIBLE: 0,
            DISPONIBLE_CON_DETALLES: 0,
            EN_TALLER: 0,
            EN_VIAJE: 0,
            FUERA_DE_SERVICIO: 0,
        };

        const counts = equipos.reduce((accumulator, equipo) => {
            accumulator[equipo.estado] += 1;
            return accumulator;
        }, initialCounts);

        setEstadoCount(counts);
        setIsLoading(false);
    };

    useEffect(() => {
        if (!isLoading) {
            contarEquiposPorEstado();
        }
    }, [equipos, isLoading]);

    return {
        loading,
        estadoCount,
    };
};