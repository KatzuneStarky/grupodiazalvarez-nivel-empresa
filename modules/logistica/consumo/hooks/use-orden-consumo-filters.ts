import { parseFirebaseDate } from "@/utils/parse-timestamp-date";
import { useOrdenesConsumos } from "./use-ordenes-consumos";
import { endOfDay, isValid, startOfDay } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";

export const useOrdenConsumoFilters = () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
    const [filterEstado, setFilterEstado] = useState<string>("all")
    const [searchTerm, setSearchTerm] = useState<string>('')
    const { ordenesConsumos } = useOrdenesConsumos()

    const ordenesOrdenadas = useMemo(() => {
        return [...ordenesConsumos].sort((a, b) => a.folio - b.folio);
    }, [ordenesConsumos]);    

    useEffect(() => {
        if (ordenesConsumos.length === 0) return;
        const fechas = ordenesConsumos.map(e => parseFirebaseDate(e.fecha).getTime());
        setDateRange({
            from: new Date(Math.min(...fechas)),
            to: new Date(Math.max(...fechas)),
        });
    }, [ordenesConsumos]);

    const filteredOrdenes = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        const estadoFilter = filterEstado.trim().toLowerCase();

        return ordenesOrdenadas.filter((orden) => {
            const fecha = parseFirebaseDate(orden.fecha);
            if (!(fecha instanceof Date) || !isValid(fecha)) return false;

            if (dateRange?.from && fecha < startOfDay(dateRange.from)) return false;
            if (dateRange?.to && fecha > endOfDay(dateRange.to)) return false;

            const matchEstado =
                estadoFilter === "all" ||
                orden.estado.toLowerCase() === estadoFilter

            const matchSearch =
                term === ""
                || orden.kilometraje.toString().toLowerCase().includes(term)
                || orden.folio.toString().toLowerCase().includes(term)
                || orden.numEconomico.toLowerCase().includes(term)
                || orden.operador.toLowerCase().includes(term)
                || orden.destino.toLowerCase().includes(term)

            return matchSearch && matchEstado
        });

    }, [ordenesOrdenadas, searchTerm, dateRange, filterEstado]);

    return {
        ordenesOrdenadas,
        filteredOrdenes,
        ordenesConsumos,
        setFilterEstado,
        setSearchTerm,
        setDateRange,
        filterEstado,
        searchTerm,
        dateRange,
    }
}