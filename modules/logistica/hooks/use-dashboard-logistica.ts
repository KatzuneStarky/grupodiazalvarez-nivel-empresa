"use client"

import { getPercentageChangeBetweenWeeks, getTotalFleteByMonth, getTotalFleteByWeek, getTotalM3ForCurrentMonth, getTotalM3ForCurrentWeek } from "../reportes-viajes/actions/read";
import { getCurrentMonthCapitalized, getPreviousMonth, getPreviousMonthCapitalized } from "@/functions/monts-functions";
import { useReporteViajes } from "../reportes-viajes/hooks/use-reporte-viajes";
import { useOperadores } from "../bdd/operadores/hooks/use-estaciones";
import { useEstaciones } from "../bdd/estaciones/hooks/use-estaciones";
import { useEquipos } from "../bdd/equipos/hooks/use-equipos";
import { endOfWeek, getWeek, startOfWeek } from "date-fns";
import { useYear } from "@/context/year-context";
import { useEffect, useState } from "react";

export const useDashboardDataLogistica = () => {
    const { selectedYear } = useYear();

    const [percentageChangeWeek, setPercentageChangeWeek] = useState<number>(0);
    const [totalM3CurrentMonth, setTotalM3CurrentMonth] = useState<number>(0)
    const [totalFleteSemana, setTotalFleteSemana] = useState<number>(0);
    const [percentageChange, setPercentageChange] = useState<number>(0);
    const [totalM3Week, setTotalM3Week] = useState<number>(0);
    const [totalViajes, setTotalViajes] = useState<number>(0)
    const [totalFlete, setTotalFlete] = useState<number>(0);
    const [percentage, setPercentage] = useState<number>(0);
    const [totalM3, setTotalM3] = useState<number>(0);

    const mesActual = getCurrentMonthCapitalized();
    const { reporteViajes } = useReporteViajes()
    const { operadores } = useOperadores();
    const { estaciones } = useEstaciones();
    const { equipos } = useEquipos();

    const semanaActual = getWeek(new Date());
    const primerDiaSemana = startOfWeek(new Date());
    const ultimoDiaSemana = endOfWeek(new Date());

    const estacionesCount = estaciones.length;
    const operadoresCount = operadores.length;
    const equiposCount = equipos.length;
    const clientesCount = 0;

    useEffect(() => {
        const viajesAnio = reporteViajes.filter(viaje => viaje.Year === selectedYear)
        const totalViajesMesActual = viajesAnio.filter(viaje => viaje.Mes === "Julio").length
        setTotalViajes(totalViajesMesActual)
    }, [reporteViajes])

    useEffect(() => {
        if (!selectedYear) return;

        const fetchTotalFlete = (totalFletePorMes: { Mes: string; TotalFlete: number; Year: number }[]) => {
            const mesActualData = totalFletePorMes.find(mes => mes.Mes === mesActual && mes.Year === selectedYear);

            let mesAnteriorNombre: string;
            let mesAnteriorYear = selectedYear;

            if (mesActual === "Enero") {
                mesAnteriorNombre = "Diciembre";
                mesAnteriorYear = selectedYear - 1;
            } else {
                mesAnteriorNombre = getPreviousMonthCapitalized();
            }

            const mesAnteriorData = totalFletePorMes.find(mes => mes.Mes === mesAnteriorNombre && mes.Year === mesAnteriorYear);

            if (mesActualData) {
                setTotalFlete(mesActualData.TotalFlete);

                if (mesAnteriorData && mesAnteriorData.TotalFlete && mesAnteriorData.TotalFlete !== 0) {
                    const porcentajeCambio = ((mesActualData.TotalFlete - mesAnteriorData.TotalFlete) / mesAnteriorData.TotalFlete) * 100;
                    setPercentage(porcentajeCambio);
                } else {
                    setPercentage(0);
                }
            }
        };

        getTotalFleteByMonth(selectedYear, fetchTotalFlete);
    }, [selectedYear, mesActual]);

    useEffect(() => {
        //if (!selectedYear || !mesActual) return;

        const fetchTotalM3 = async () => {
            const total = await getTotalM3ForCurrentMonth("Julio", selectedYear || 0);
            console.log(total);
            setTotalM3(total);
        };

        fetchTotalM3();
    }, [mesActual, selectedYear]);

    useEffect(() => {
        if (!selectedYear || !mesActual) return;

        const fetchTotalFletePorSemana = (total: number) => {
            setTotalFleteSemana(total);
        };

        getTotalFleteByWeek(selectedYear, mesActual, fetchTotalFletePorSemana);
    }, [selectedYear, mesActual]);

    useEffect(() => {
        if (!mesActual || !selectedYear) return;

        const fetchM3Data = async () => {
            const currentMonthTotal = await getTotalM3ForCurrentMonth(mesActual, selectedYear);
            setTotalM3CurrentMonth(currentMonthTotal);

            const previousMonth = getPreviousMonth(mesActual);
            const previousMonthTotal = await getTotalM3ForCurrentMonth(previousMonth, selectedYear);

            if (previousMonthTotal && previousMonthTotal !== 0) {
                const percentage = ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100;
                setPercentageChange(percentage);
            } else {
                setPercentageChange(0);
            }
        };

        fetchM3Data();
    }, [mesActual, selectedYear]);

    useEffect(() => {
        const fetchM3 = async () => {
            const totalM3ForWeek = await getTotalM3ForCurrentWeek(selectedYear || 0);
            setTotalM3Week(totalM3ForWeek);
        };

        fetchM3();
    }, [selectedYear]);

    useEffect(() => {
        const fetchPercentageChange = async () => {
            const change = await getPercentageChangeBetweenWeeks(selectedYear || 0);
            setPercentageChangeWeek(change);
        };

        fetchPercentageChange();
    }, [selectedYear]);

    return {
        percentageChangeWeek,
        totalFleteSemana,
        percentageChange,
        totalM3Week,
        totalFlete,
        percentage,
        totalM3,
        estacionesCount,
        operadoresCount,
        equiposCount,
        clientesCount,
        mesActual,
        semanaActual,
        primerDiaSemana,
        ultimoDiaSemana,
        totalViajes,
        totalM3CurrentMonth
    };
};