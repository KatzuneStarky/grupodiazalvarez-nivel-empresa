import { parseFirebaseDate } from "@/utils/parse-timestamp-date";
import { endOfDay, isValid, startOfDay } from "date-fns";
import { EstacionServicio } from "../types/estacion";
import { useEffect, useMemo, useState } from "react"
import { useEstaciones } from "./use-estaciones";
import { DateRange } from "react-day-picker";

export const useEstacionesFilters = () => {
    const [selectedTanquesRange, setSelectedTanquesRange] = useState<[number, number]>([0, 0])
    const [selectCapacidadRage, setSelectCapacidadRange] = useState<[number, number]>([0, 0])
    const [capacidadRange, setCapacidadRange] = useState<[number, number]>([0, 0])
    const [tanquesRange, setTanquesRange] = useState<[number, number]>([0, 0])
    const [filterCombustible, setFilterCombustible] = useState<string>("all")
    const [searchTerm, setSearchTerm] = useState<string>("")
    const { estaciones } = useEstaciones()

    const estacionesOrdered = useMemo(() => {
        return estaciones.flatMap((estacion) => {
            return estacion
        }).sort((a, b) => {
            return new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime()
        })
    }, [estaciones])

    const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
        if (estaciones.length === 0) return undefined;
        const fechas = estaciones.map(e => new Date(e.fechaRegistro).getTime());
        return {
            from: new Date(Math.min(...fechas)),
            to: new Date(Math.max(...fechas)),
        };
    });

    const filteredEstaciones = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        const combustibleFilter = filterCombustible.trim().toLowerCase();

        return estacionesOrdered.filter((estacion) => {
            const fecha = parseFirebaseDate(estacion.fechaRegistro);
            if (!(fecha instanceof Date) || !isValid(fecha)) return false;

            if (dateRange?.from && fecha < startOfDay(new Date(dateRange.from))) return false;
            if (dateRange?.to && fecha > endOfDay(new Date(dateRange.to))) return false;

            const matchesTanquesCount =
                selectedTanquesRange[0] <= estacion.tanques.length &&
                estacion.tanques.length <= selectedTanquesRange[1];

            const matchesCapacidadCount =
                selectCapacidadRage[0] <= estacion.tanques.reduce((acc, t) => acc + t.capacidadTotal, 0) &&
                estacion.tanques.reduce((acc, t) => acc + t.capacidadTotal, 0) <= selectCapacidadRage[1]

            const matchCombustible =
                combustibleFilter === "all" ||
                estacion.tanques.some(tanque => tanque.tipoCombustible.toLowerCase() === combustibleFilter)

            const matchSearch = term === "" ||
                (estacion.nombre?.toLowerCase().includes(term.toLowerCase())) ||
                (estacion.contacto?.some(c =>
                (c?.responsable?.toLowerCase().includes(term.toLowerCase()) ||
                    c?.telefono?.includes(term) ||
                    c?.email?.toLowerCase().includes(term.toLowerCase()))
                ) ?? false)

            return matchSearch
                && matchesTanquesCount
                && matchCombustible
                && matchesCapacidadCount
        })
    }, [
        dateRange,
        estacionesOrdered,
        searchTerm,
        selectedTanquesRange,
        filterCombustible,
        selectCapacidadRage
    ])

    useEffect(() => {
        if (estaciones.length > 0) {
            const tanquesValues = estaciones.map(e => e.tanques.length)
            const min = 0
            const max = Math.max(...tanquesValues)

            setTanquesRange([min, max])
            setSelectedTanquesRange([min, max])
        }
    }, [estaciones])

    useEffect(() => {
        if (estaciones.length > 0) {
            const capacidadValues = estaciones.map(e => e.tanques.reduce((acc, t) => acc + t.capacidadTotal, 0))
            const min = 0
            const max = Math.max(...capacidadValues)

            setCapacidadRange([min, max])
            setSelectCapacidadRange([min, max])
        }
    }, [estaciones])

    const getMainContact = (station: EstacionServicio) => {
        if (!Array.isArray(station.contacto) || station.contacto.length === 0) return "Sin contacto"

        const firstContacto = station.contacto[0]
        return firstContacto.responsable || firstContacto.telefono || firstContacto.email || "Sin contacto"
    }

    const getStationFuelByType = (station: EstacionServicio) => {
        const fuelTypes = new Map<
            string,
            { tanks: typeof station.tanques; totalCapacity: number; currentCapacity: number }
        >()

        station.tanques.forEach((tanque) => {
            const tipo = tanque.tipoCombustible
            if (!fuelTypes.has(tipo)) {
                fuelTypes.set(tipo, { tanks: [], totalCapacity: 0, currentCapacity: 0 })
            }
            const fuelData = fuelTypes.get(tipo)!
            fuelData.tanks.push(tanque)
            fuelData.totalCapacity += tanque.capacidadTotal
            fuelData.currentCapacity += tanque.capacidadActual
        })

        return Array.from(fuelTypes.entries()).map(([tipo, data]) => ({
            tipo,
            tanks: data.tanks,
            totalCapacity: data.totalCapacity,
            currentCapacity: data.currentCapacity,
            percentage: data.totalCapacity > 0 ? (data.currentCapacity / data.totalCapacity) * 100 : 0,
        }))
    }

    return {
        searchTerm,
        setSearchTerm,
        dateRange,
        setDateRange,
        estaciones,
        getMainContact,
        getStationFuelByType,
        filteredEstaciones,
        selectedTanquesRange,
        setSelectedTanquesRange,
        tanquesRange,
        filterCombustible,
        setFilterCombustible,
        setSelectCapacidadRange,
        capacidadRange,
        selectCapacidadRage,
    }
}