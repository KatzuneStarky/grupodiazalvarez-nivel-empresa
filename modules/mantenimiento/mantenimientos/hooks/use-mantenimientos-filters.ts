import { Mantenimiento } from "@/modules/logistica/bdd/equipos/types/mantenimiento"
import { useEquipos } from "@/modules/logistica/bdd/equipos/hooks/use-equipos"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { endOfDay, isValid, startOfDay } from "date-fns"
import { useEffect, useMemo, useState } from "react"
import { DateRange } from "react-day-picker"

export const useMantenimientosFilters = () => {
    const [selectedRecord, setSelectedRecord] = useState<Mantenimiento | null>(null)
    const [selectedKmRange, setSelectedKmRange] = useState<[number, number]>([0, 0])
    const [tipoServicioFilter, setTipoServicioFilter] = useState("all")
    const [kmRange, setKmRange] = useState<[number, number]>([0, 0])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [mecanico, setMecanico] = useState<string>("all")
    const [equipoId, setEquipoId] = useState<string>("all")
    const [searchTerm, setSearchTerm] = useState("")
    const { equipos } = useEquipos()

    const mantenimientos = useMemo(() => {
        return equipos.flatMap((equipo) => {
            return equipo.mantenimiento
        }).sort((a, b) => {
            return new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        })
    }, [equipos])

    const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
        if (mantenimientos.length === 0) return undefined;
        const fechas = mantenimientos.map(m => new Date(m.fecha).getTime());
        return {
            from: new Date(Math.min(...fechas)),
            to: new Date(Math.max(...fechas)),
        };
    });

    const filterMantenimientos = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        const mecFilter = mecanico.trim().toLowerCase();
        const tipoFilter = tipoServicioFilter.trim().toLowerCase();

        return mantenimientos.filter((mantenimiento) => {
            const fecha = parseFirebaseDate(mantenimiento.fecha);
            if (!(fecha instanceof Date) || !isValid(fecha)) return false;

            if (dateRange?.from && fecha < startOfDay(new Date(dateRange.from))) return false;
            if (dateRange?.to && fecha > endOfDay(new Date(dateRange.to))) return false;

            const matchesTipo =
                tipoFilter === "all" ||
                (mantenimiento.tipoServicio ?? "").toLowerCase() === tipoFilter;

            const matchesMecanico =
                mecFilter === "all" ||
                (mantenimiento.mecanicoId ?? "").toLowerCase().includes(mecFilter);

            const matchesEquipo = equipoId === "all" || mantenimiento.equipoId === equipoId;

            const matchesKm =
                selectedKmRange[0] <= mantenimiento.kmMomento &&
                mantenimiento.kmMomento <= selectedKmRange[1];

            const matchSearch =
                term === "" ||
                (mantenimiento.notas ?? "").toLowerCase().includes(term) ||
                (mantenimiento.kmMomento ?? 0).toString().includes(term) ||
                (mantenimiento.mecanicoId ?? "").toLowerCase().includes(term) ||
                (mantenimiento.tipoServicio ?? "").toLowerCase().includes(term) ||
                (mantenimiento.equipoId ?? "").toLowerCase().includes(term);

            return matchesTipo && matchesMecanico && matchesEquipo && matchesKm && matchSearch;
        });
    }, [
        mantenimientos,
        dateRange,
        tipoServicioFilter,
        mecanico,
        equipoId,
        selectedKmRange,
        searchTerm,
    ]);

    useEffect(() => {
        if (mantenimientos.length > 0) {
            const kmValues = mantenimientos.map(m => m.kmMomento)
            const min = 0
            const max = Math.max(...kmValues)

            setKmRange([min, max])
            setSelectedKmRange([min, max])
        }
    }, [mantenimientos])

    const uniqueMecanicos = [...new Set(mantenimientos.map(m => m.mecanicoId || ""))];

    const numEconomicoEquipo = (equipoId: string): string => {
        return equipos.find((e) => e.id === equipoId)?.numEconomico || ""
    }

    const handleTableCellClick = (record: Mantenimiento) => {
        setSelectedRecord(record)
        setIsDialogOpen(true)
    }

    return {
        selectedRecord,
        kmRange,
        isDialogOpen,
        setMecanico,
        setEquipoId,
        setSearchTerm,
        setDateRange,
        filterMantenimientos,
        uniqueMecanicos,
        numEconomicoEquipo,
        handleTableCellClick,
        equipoId,
        tipoServicioFilter,
        setTipoServicioFilter,
        searchTerm,
        mecanico,
        equipos,
        dateRange,
        selectedKmRange,
        setSelectedKmRange,
        setIsDialogOpen,
        setSelectedRecord
    }
}