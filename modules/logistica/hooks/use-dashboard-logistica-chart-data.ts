"use client"

import { getM3ByMonth } from "../reportes-viajes/actions/read";
import { useTotalFletePorMes } from "./use-total-flete-mes";
import { useEffect, useMemo, useState } from "react";

type ChartData = { Mes: string; Total: number };

export const useDashboardLogisticaChartData = (year: number, currentYear: number) => {
    const selectedYear = year || currentYear;

    const [chartDataM3, setChartDataM3] = useState<ChartData[]>([]);
    const [isLoadingM3, setIsLoadingM3] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const {
        totalFletePorMes,
        isLoading: isLoadingFlete,
        error: errorFlete
    } = useTotalFletePorMes(selectedYear);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingM3(true);
            setError(null);

            try {
                const data = await getM3ByMonth(selectedYear);
                console.log(data);
                

                const formatted = data.map((item) => ({
                    Mes: item.month,
                    Total: item.total,
                }));

                const allZero = formatted.every((i) => i.Total === 0);
                setChartDataM3(allZero ? [] : formatted);
            } catch (err) {
                setError(err as Error);
                setChartDataM3([]);
            } finally {
                setIsLoadingM3(false);
            }
        };

        fetchData();
    }, [selectedYear]);

    const chartDataFlete = useMemo(() => {
        if (!totalFletePorMes?.length) return [];

        const formatted = totalFletePorMes.map((item) => ({
            Mes: item.Mes,
            Total: item.TotalFlete,
        }));

        const allZero = formatted.every((i) => i.Total === 0);
        return allZero ? [] : formatted;
    }, [totalFletePorMes]);

    const isLoading = isLoadingM3 || isLoadingFlete;
    const combinedError = error || errorFlete;

    return {
        chartDataFlete,
        chartDataM3,
        isLoading,
        error: combinedError,
    };
};