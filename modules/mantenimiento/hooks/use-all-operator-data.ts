import useEquipoDataById from "@/modules/logistica/equipos/hooks/use-equipos-data-by-id"
import { useOperadores } from "@/modules/logistica/bdd/operadores/hooks/use-estaciones"
import { useIncidencias } from "../incidencias/hooks/use-incidencias"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { endOfDay, isValid, startOfDay } from "date-fns"
import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { DateRange } from "react-day-picker"
import { RolUsuario } from "@/enum/user-roles"
import { useAllIncidencias } from "../incidencias/hooks/use-all-incidencias"
import { useEquipos } from "@/modules/logistica/bdd/equipos/hooks/use-equipos"

export const useAllOperatorData = () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
    const [filterEstado, setFilterEstado] = useState<string>("")
    const [searchTerm, setSearchTerm] = useState<string>("")

    const { operadores } = useOperadores()
    const { equipos } = useEquipos()
    const { currentUser, userBdd } = useAuth()
    const email = currentUser?.email?.toLowerCase()
    const operadorActual = operadores.find((operador) => operador.email.toLowerCase() === email)

    const isAdmin = userBdd?.rol === RolUsuario.Admin || userBdd?.rol === RolUsuario.Super_Admin

    const { data } = useEquipoDataById(operadorActual?.idEquipo || "")

    // Fetch individual operator incidences
    const { incidencias: operatorIncidencias } = useIncidencias(operadorActual?.idEquipo || "")
    // Fetch ALL incidences (for admins)
    const { incidencias: allIncidencias } = useAllIncidencias()

    // Determine which set of incidences to use
    const activeIncidencias = isAdmin ? allIncidencias : operatorIncidencias

    const incidenciasOrdenadas = useMemo(() => {
        return [...activeIncidencias].sort((a, b) => parseFirebaseDate(a.creadtedAt).getTime() - parseFirebaseDate(b.creadtedAt).getTime());
    }, [activeIncidencias]);


    useEffect(() => {
        if (activeIncidencias.length === 0) return;
        const fechas = activeIncidencias.map(e => parseFirebaseDate(e.creadtedAt).getTime());
        setDateRange({
            from: new Date(Math.min(...fechas)),
            to: new Date(Math.max(...fechas)),
        });
    }, [activeIncidencias]);

    const filteredIncidencias = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        const estado = filterEstado.trim().toLowerCase();

        return incidenciasOrdenadas.filter((incidencia) => {
            const fecha = parseFirebaseDate(incidencia.creadtedAt);
            if (!(fecha instanceof Date) || !isValid(fecha)) return false;

            if (dateRange?.from && fecha < startOfDay(dateRange.from)) return false;
            if (dateRange?.to && fecha > endOfDay(dateRange.to)) return false;

            const matchEstado =
                estado === "all"
                || incidencia.estado.toLowerCase().includes(estado)

            const matchSearch =
                term === ""
                || incidencia.ubicacion?.direccionAproximada?.toString().toLowerCase().includes(term)
                || incidencia.velocidadAprox?.toString().toLowerCase().includes(term)
                || incidencia.kmActual?.toString().toLowerCase().includes(term)

            return matchSearch && matchEstado
        });
    }, [incidenciasOrdenadas, searchTerm, filterEstado, dateRange]);

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
        incidencias: activeIncidencias,
        operadores,
        equipos, // Return all equipments
        searchTerm,
        dateRange,
        userBdd,
    }
}