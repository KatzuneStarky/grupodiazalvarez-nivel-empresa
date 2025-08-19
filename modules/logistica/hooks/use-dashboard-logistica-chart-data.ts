"use client"

import { getM3ByMonth } from "../reportes-viajes/actions/read";
import { useTotalFletePorMes } from "./use-total-flete-mes";
import { useEffect, useState } from "react";

type ChartDataFlete = { Mes: string; TotalFlete: number };
type ChartDataM3 = { month: string; total: number };

export const useDashboardLogisticaChartData = (year: number, currentYear: number) => {
    const [chartData1, setChartData1] = useState<ChartDataFlete[]>([]);
    const [chartData2, setChartData2] = useState<ChartDataM3[]>([]);
    const [isLoading1, setIsLoading1] = useState<boolean>(true);
    const [isLoading2, setIsLoading2] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const selectedYear = year || currentYear;

    const { totalFletePorMes, error: errorFlete } = useTotalFletePorMes(selectedYear);

    useEffect(() => {
        try {
            const formatted = totalFletePorMes.map((item) => ({
                Mes: item.Mes,
                TotalFlete: item.TotalFlete,
            }));

            const allZero = formatted.every((item) => item.TotalFlete === 0);
            setChartData1(allZero ? [] : formatted);
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading1(false);
        }
    }, [totalFletePorMes]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getM3ByMonth(selectedYear);
                const allZero = data.every((item) => item.total === 0);
                setChartData2(allZero ? [] : data);
            } catch (err) {
                setError(err as Error);
            } finally {
                setIsLoading2(false);
            }
        };

        fetchData();
    }, [selectedYear]);

    return {
        chartData1,
        chartData2,
        isLoading: isLoading1 || isLoading2,
        error: error || errorFlete,
    }
}