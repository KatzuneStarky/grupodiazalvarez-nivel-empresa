import { useReporteViajes } from "../../reportes-viajes/hooks/use-reporte-viajes"
import { useEffect, useMemo, useState } from "react"

interface ResumenEquipo {
    numEconomico: string;
    FALTANTESYOSOBRANTESA20: number;
    FALTANTESYOSOBRANTESALNATURAL: number;
    viajes: number;
    consumo: number;
}

export const useEquiposDataGeneral = ({ mes, year }: { mes: string, year: number }) => {
    const [selectedRangoViajes, setSelectedRangoViajes] = useState<[number, number]>([0, 0])
    const [selectedAlNatural, setSelectedAlNatural] = useState<[number, number]>([0, 0])
    const [resumenEquipos, setResumenEquipos] = useState<ResumenEquipo[]>([]);
    const [selectedA20, setSelectedA20] = useState<[number, number]>([0, 0])
    const [rangoViajes, setRangoViajes] = useState<[number, number]>([0, 0])
    const [alNatural, setAlNatural] = useState<[number, number]>([0, 0])
    const [numEquipos, setNumEquipos] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [a20, setA20] = useState<[number, number]>([0, 0])

    const { reporteViajes } = useReporteViajes()

    const reportesViajesOrdenados = useMemo(() => {
        return reporteViajes
            .flatMap(viaje => viaje)
            .filter(viaje =>
                (viaje.Mes ?? "").toLowerCase() === mes.toLowerCase() &&
                viaje.Year === year
            )
            .sort((a, b) => (a.Equipo ?? "").localeCompare(b.Equipo ?? ""));
    }, [reporteViajes, mes, year]);

    const filteredData = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        return reportesViajesOrdenados.filter((viaje) => {
            const matchesCantidadA20 =
                (viaje.FALTANTESYOSOBRANTESA20 ?? 0) >= selectedA20[0] &&
                (viaje.FALTANTESYOSOBRANTESA20 ?? 0) <= selectedA20[1];

            const matchesCantidadAlNatural =
                (viaje.FALTANTESYOSOBRANTESALNATURAL ?? 0) >= selectedAlNatural[0] &&
                (viaje.FALTANTESYOSOBRANTESALNATURAL ?? 0) <= selectedAlNatural[1];

            const matchSearch =
                term === "" ||
                (viaje.Cliente ?? "").toLowerCase().includes(term) ||
                (viaje.DescripcionDelViaje ?? "").toLowerCase().includes(term) ||
                (viaje.Equipo ?? "").toLowerCase().includes(term) ||
                (viaje.Operador ?? "").toLowerCase().includes(term) ||
                (viaje.Producto ?? "").toLowerCase().includes(term);

            return matchSearch && matchesCantidadA20 && matchesCantidadAlNatural;
        });
    }, [reportesViajesOrdenados, searchTerm, selectedA20, selectedAlNatural]);

    useEffect(() => {
        if (reportesViajesOrdenados.length > 0) {
            const a20Values = reportesViajesOrdenados.map(e => e.FALTANTESYOSOBRANTESA20 ?? 0);
            if (a20Values.length > 0) {
                const min = Math.min(...a20Values);
                const max = Math.max(...a20Values);
                setA20([min, max]);
                setSelectedA20([min, max]);
            } else {
                setA20([0, 0]);
                setSelectedA20([0, 0]);
            }
        }
    }, [reportesViajesOrdenados])

    useEffect(() => {
        if (reportesViajesOrdenados.length > 0) {
            const alNaturalValues = reportesViajesOrdenados.map(e => e.FALTANTESYOSOBRANTESALNATURAL ?? 0);
            if (alNaturalValues.length > 0) {
                const min = Math.min(...alNaturalValues);
                const max = Math.max(...alNaturalValues);
                setAlNatural([min, max]);
                setSelectedAlNatural([min, max]);
            } else {
                setAlNatural([0, 0]);
                setSelectedAlNatural([0, 0]);
            }
        }
    }, [reportesViajesOrdenados])

    useEffect(() => {
        const record: Record<string, ResumenEquipo> = {};

        filteredData.forEach(viaje => {
            const key = viaje.Equipo;
            if (!key) return;

            if (!record[key]) {
                record[key] = {
                    numEconomico: key,
                    FALTANTESYOSOBRANTESA20: 0,
                    FALTANTESYOSOBRANTESALNATURAL: 0,
                    viajes: 0,
                    consumo: 0,
                };
            }

            record[key].FALTANTESYOSOBRANTESA20 += viaje.FALTANTESYOSOBRANTESA20 ?? 0;
            record[key].FALTANTESYOSOBRANTESALNATURAL += viaje.FALTANTESYOSOBRANTESALNATURAL ?? 0;
            record[key].viajes += 1;
            record[key].consumo += 0;
        });

        setResumenEquipos(Object.values(record));
        setNumEquipos(Object.keys(record));
    }, [filteredData]);

    const filteredResumenEquipos = useMemo(() => {
        return resumenEquipos.filter(equipo =>
            equipo.viajes >= selectedRangoViajes[0] &&
            equipo.viajes <= selectedRangoViajes[1]
        );
    }, [resumenEquipos, selectedRangoViajes]);

    useEffect(() => {
        if (resumenEquipos.length === 0) return;

        const viajesValues = resumenEquipos.map(e => e.viajes);
        const min = Math.min(...viajesValues);
        const max = Math.max(...viajesValues);

        setSelectedRangoViajes([min, max]);
        setRangoViajes([min, max]);
    }, [resumenEquipos]);

    const getValueColor = (value?: number) => {
        if (value === undefined || value === 0) return "text-slate-400"
        return value > 0 ? "text-green-500" : "text-red-500"
    }

    const getValueBg = (value?: number) => {
        if (value === undefined || value === 0) return "bg-slate-50"
        return value > 0 ? "bg-green-50" : "bg-red-50"
    }

    return {
        searchTerm,
        setSearchTerm,
        resumenEquipos,
        numEquipos,
        getValueColor,
        getValueBg,
        alNatural,
        a20,
        selectedAlNatural,
        selectedA20,
        setSelectedAlNatural,
        setSelectedA20,
        filteredResumenEquipos,
        rangoViajes,
        selectedRangoViajes,
        setSelectedRangoViajes,
    }
}