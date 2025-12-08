import useEquipoDataById from "@/modules/logistica/equipos/hooks/use-equipos-data-by-id"
import { useOperadores } from "@/modules/logistica/bdd/operadores/hooks/use-estaciones"
import { useIncidencias } from "../incidencias/hooks/use-incidencias"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { endOfDay, isValid, startOfDay } from "date-fns"
import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { DateRange } from "react-day-picker"

export const useAllOperatorData = () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
    const [filterEstado, setFilterEstado] = useState<string>("")
    const [searchTerm, setSearchTerm] = useState<string>("")

    const { incidencias } = useIncidencias()
    const { operadores } = useOperadores()
    const { currentUser } = useAuth()

    const incidenciasOrdenadas = useMemo(() => {
        return [...incidencias].sort((a, b) => parseFirebaseDate(a.creadtedAt).getTime() - parseFirebaseDate(b.creadtedAt).getTime());
    }, [incidencias]);

    const email = currentUser?.email?.toLowerCase()
    const operadorActual = operadores.find((operador) => operador.email.toLowerCase() === email)

    const { data } = useEquipoDataById(operadorActual?.idEquipo || "")

    useEffect(() => {
        if (incidencias.length === 0) return;
        const fechas = incidencias.map(e => parseFirebaseDate(e.creadtedAt).getTime());
        setDateRange({
            from: new Date(Math.min(...fechas)),
            to: new Date(Math.max(...fechas)),
        });
    }, [incidencias]);

    const filteredIncidencias = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        const estado = filterEstado.trim().toLowerCase();

        return incidenciasOrdenadas.filter((incidencia) => {
            const fecha = parseFirebaseDate(incidencia.creadtedAt);
            if (!(fecha instanceof Date) || !isValid(fecha)) return false;

            if (dateRange?.from && fecha < startOfDay(dateRange.from)) return false;
            if (dateRange?.to && fecha > endOfDay(dateRange.to)) return false;

            const matchEstado =
                estado === ""
                || incidencia.estado.toLowerCase().includes(estado)

            const matchSearch =
                term === ""
                || incidencia.ubicacion?.direccionAproximada?.toString().toLowerCase().includes(term)
                || incidencia.velocidadAprox?.toString().toLowerCase().includes(term)
                || incidencia.kmActual?.toString().toLowerCase().includes(term)

            return matchSearch && matchEstado
        });
    }, [incidenciasOrdenadas, searchTerm]);

    return {
        mantenimientosData: data.equipo?.mantenimientos,
        archivosData: data.archivos,
        equipoData: data.equipo,
        filteredIncidencias,
        setFilterEstado,
        operadorActual,
        setSearchTerm,
        setDateRange,
        filterEstado,
        incidencias,
        operadores,
        searchTerm,
        dateRange,
    }
}