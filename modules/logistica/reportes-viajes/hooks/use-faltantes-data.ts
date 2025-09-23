import { ReporteViajes } from "../types/reporte-viajes";
import { useState } from "react";

export interface DescripcionDelViaje1 {
    Descripcion: string;
    Municipio: string;
    FALTANTESYOSOBRANTESA20: number;
    FALTANTESYOSOBRANTESALNATURAL: number;
    isA20Positive: boolean;
    isAlNaturalPositive: boolean;
}

export interface ClienteViajes1 {
    Cliente: string;
    DescripcionesDelViaje: DescripcionDelViaje1[];
}

export interface UseFaltantesProps {
    reporteViajes: ReporteViajes[];
    selectedYear?: number;
    currentYear: number
}

export const useFaltantesData = ({ reporteViajes, selectedYear, currentYear }: UseFaltantesProps) => {
    const [searchDescripcion, setSearchDescripcion] = useState<string>('');
    const [searchMunicipio, setSearchMunicipio] = useState<string>('');
    const [secondSelection, setSecondSelection] = useState<string>('');
    const [firstSelection, setFirstSelection] = useState<string>('');
    const [searchCliente, setSearchCliente] = useState<string>('');

    const year = selectedYear || currentYear;

    const createDescripcion = (curr: ReporteViajes): DescripcionDelViaje1 => {
        const A20 = curr.FALTANTESYOSOBRANTESA20 || 0;
        const AlNat = curr.FALTANTESYOSOBRANTESALNATURAL || 0;

        return {
            Descripcion: curr.DescripcionDelViaje,
            Municipio: curr.Municipio || '',
            FALTANTESYOSOBRANTESA20: A20,
            FALTANTESYOSOBRANTESALNATURAL: AlNat,
            isA20Positive: A20 >= 0,
            isAlNaturalPositive: AlNat >= 0,
        };
    };

    const filterByYearAndMunicipio = (viajes: ReporteViajes[]) =>
        viajes.filter(
            (v) =>
                v.Year === year &&
                v.Municipio.toLowerCase().includes(searchMunicipio.toLowerCase())
        );

    const groupByCliente = (viajes: ReporteViajes[]): ClienteViajes1[] => {
        const faltantesMap = new Map<string, ClienteViajes1>();

        viajes.forEach((curr) => {
            const descripcion = createDescripcion(curr);

            if (!faltantesMap.has(curr.Cliente)) {
                faltantesMap.set(curr.Cliente, {
                    Cliente: curr.Cliente,
                    DescripcionesDelViaje: [descripcion],
                });
            } else {
                const cliente = faltantesMap.get(curr.Cliente)!;
                const index = cliente.DescripcionesDelViaje.findIndex(
                    (d) => d.Descripcion === descripcion.Descripcion
                );

                if (index === -1) {
                    cliente.DescripcionesDelViaje.push(descripcion);
                } else {
                    cliente.DescripcionesDelViaje[index].FALTANTESYOSOBRANTESA20 +=
                        descripcion.FALTANTESYOSOBRANTESA20;
                    cliente.DescripcionesDelViaje[index].FALTANTESYOSOBRANTESALNATURAL +=
                        descripcion.FALTANTESYOSOBRANTESALNATURAL;

                    const d = cliente.DescripcionesDelViaje[index];
                    d.isA20Positive = d.FALTANTESYOSOBRANTESA20 >= 0;
                    d.isAlNaturalPositive = d.FALTANTESYOSOBRANTESALNATURAL >= 0;
                }
            }
        });

        return Array.from(faltantesMap.values());
    };

    const filterFaltantes = (faltantes: ClienteViajes1[]): ClienteViajes1[] =>
        faltantes
            .filter((c) =>
                c.Cliente.toLowerCase().includes(searchCliente.toLowerCase())
            )
            .map((c) => ({
                ...c,
                DescripcionesDelViaje: c.DescripcionesDelViaje.filter(
                    (d) =>
                        d.Descripcion.toLowerCase().includes(searchDescripcion.toLowerCase()) &&
                        d.Municipio.toLowerCase().includes(searchMunicipio.toLowerCase())
                ),
            }))
            .filter((c) => c.DescripcionesDelViaje.length > 0);

    const viajesFiltrados = filterByYearAndMunicipio(reporteViajes);
    const faltantes = groupByCliente(viajesFiltrados);
    const filteredFaltantes = filterFaltantes(faltantes);

    const descripcionesUnicas = Array.from(
        new Map(reporteViajes.map((v) => [v.DescripcionDelViaje, v])).values()
    ).map((v) => ({
        value: v.DescripcionDelViaje,
        label: v.DescripcionDelViaje,
        cliente: v.Cliente,
    }));

    const firstDescripcion = reporteViajes.find(
        (v) => v.DescripcionDelViaje === firstSelection
    );
    const secondDescripcion = reporteViajes.find(
        (v) => v.DescripcionDelViaje === secondSelection
    );

    return {
        searchCliente,
        setSearchCliente,
        searchDescripcion,
        setSearchDescripcion,
        searchMunicipio,
        setSearchMunicipio,
        firstSelection,
        setFirstSelection,
        secondSelection,
        setSecondSelection,
        faltantes,
        filteredFaltantes,
        descripcionesUnicas,
        firstDescripcion,
        secondDescripcion,
    };
}