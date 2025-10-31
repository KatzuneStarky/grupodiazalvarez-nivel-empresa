import { getCurrentMonthCapitalized } from "@/functions/monts-functions";
import { parseFirebaseDate } from "@/utils/parse-timestamp-date";
import { endOfDay, isValid, startOfDay } from "date-fns";
import { DateRange } from "react-day-picker";
import { useConsumo } from "./use-consumo";
import { useMemo, useState } from "react";
import { meses } from "@/constants/meses";

export const useConsumoFilters = () => {
    const currentMont = getCurrentMonthCapitalized()
    const { consumo, loading } = useConsumo()

    const [filterEquipoType, setFilterEquipoType] = useState<string>("Todos")
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [mes, setMes] = useState<string>(currentMont)

    const consumoOrdered = useMemo(() => {
        return consumo.flatMap((c) => {
            return c
        }).sort((a, b) => {
            return new Date(parseFirebaseDate(b.fecha)).getTime() - new Date(parseFirebaseDate(a.fecha)).getTime()
        })
    }, [consumo])


    const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
        if (consumo.length === 0) return undefined;
        const fechas = consumo.map(e => new Date(parseFirebaseDate(e.fecha)).getTime());
        return {
            from: new Date(Math.min(...fechas)),
            to: new Date(Math.max(...fechas)),
        };
    });

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
        const consumos = filterConsumo(mes)

        return consumos.filter((item) => {
            const fecha = parseFirebaseDate(item.fecha);
            const monthFecha = fecha.getMonth() + 1
            const dayFecha = fecha.getDate()
            const yearFecha = fecha.getFullYear()
            const currentMonthName = getCurrentMonthCapitalized().split("-")[1];
            const currentMonthNumber = meses.indexOf(currentMonthName) + 1;


            const newFecha = new Date()
            newFecha.setMonth(monthFecha - 1)
            newFecha.setDate(dayFecha)
            newFecha.setFullYear(yearFecha)

            const startFechaMes = startOfDay(fecha);
            const endFechaMes = endOfDay(fecha);

            if (!(fecha instanceof Date) || !isValid(fecha)) return false;

            if (dateRange?.from && fecha < startOfDay(new Date(dateRange.from))) return false;
            if (dateRange?.to && fecha > endOfDay(new Date(dateRange.to))) return false;
        })
    }, [mes, consumoOrdered]);


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