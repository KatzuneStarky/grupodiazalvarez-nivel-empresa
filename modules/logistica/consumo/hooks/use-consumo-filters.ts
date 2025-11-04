import { endOfDay, endOfMonth, isValid, startOfDay, startOfMonth } from "date-fns";
import { getCurrentMonthCapitalized } from "@/functions/monts-functions";
import { parseFirebaseDate } from "@/utils/parse-timestamp-date";
import { useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { useConsumo } from "./use-consumo";
import { meses } from "@/constants/meses";

export const useConsumoFilters = () => {
    const currentMont = getCurrentMonthCapitalized()
    const { consumo, loading } = useConsumo()

    const [filterEquipoType, setFilterEquipoType] = useState<string>("Todos")
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [mes, setMes] = useState<string>(currentMont)

    useEffect(() => {
        if (!mes) return;

        const monthName = mes.toLowerCase();
        const monthIndex = meses.findIndex((m) => m.toLowerCase() === monthName);

        if (monthIndex === -1) return;

        const now = new Date();
        const year = now.getFullYear();

        const firstDay = startOfMonth(new Date(year, monthIndex, 1));
        const lastDay = endOfMonth(new Date(year, monthIndex, 1));

        setDateRange({ from: firstDay, to: lastDay });
    }, [mes]);

    const consumoOrdered = useMemo(() => {
        return consumo
            .flatMap((c) => c)
            .sort(
                (a, b) =>
                    new Date(parseFirebaseDate(b.fecha)).getTime() -
                    new Date(parseFirebaseDate(a.fecha)).getTime()
            );
    }, [consumo])


    const filterConsumo = (mes: string) => {
        return consumoOrdered.filter((item) => {
            const fecha = parseFirebaseDate(item.fecha);
            const nombreMes = fecha.toLocaleString("es-MX", { month: "long" });
            const capitalized = nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);
            return capitalized === mes;
        });
    };

    const consumoFiltrado = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        return consumoOrdered.filter((item) => {
            const fecha = parseFirebaseDate(item.fecha);

            if (!(fecha instanceof Date) || !isValid(fecha)) return false;

            if (dateRange?.from && fecha < startOfDay(new Date(dateRange.from))) return false;
            if (dateRange?.to && fecha > endOfDay(new Date(dateRange.to))) return false;

            {/**
                if (term) {
                const match =
                    item.?.toLowerCase().includes(term) ||
                    item.Equipo?.toLowerCase().includes(term) ||
                    item.Operador?.toLowerCase().includes(term) ||
                    item.Producto?.toLowerCase().includes(term);
                if (!match) return false;
            } */}

            return true;
        });
    }, [consumoOrdered, dateRange, searchTerm]);


    return {
        searchTerm,
        setSearchTerm,
        mes,
        setMes,
        loading,
        consumoFiltrado,
        dateRange,
        setDateRange,
    }
}