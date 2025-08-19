import { useEffect, useState } from "react";
import { calcularFletePorCliente, calcularM3PorCliente } from "../reportes-viajes/actions/read";

export const useDahboardLogisticaPerformanceChartData = () => {
    const [startDate, setStartDate] = useState<Date | undefined>(undefined)
    const [endDate, setEndDate] = useState<Date | undefined>(undefined)
    const [chartData, setChartData] = useState<{ Cliente: string; Flete: number }[]>([])
    const [chartData2, setChartData2] = useState<{ Cliente: string; M3: number }[]>([])

    const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#d0ed57"];

    useEffect(() => {
        const fetchChartData = async () => {
            if (startDate && endDate) {
                const data = await calcularFletePorCliente(startDate, endDate)
                const formattedData = Object.entries(data).map(([Cliente, Flete]) => ({ Cliente, Flete }))
                setChartData(formattedData)
            }
        }

        fetchChartData()
    }, [startDate, endDate])

    useEffect(() => {
        const fetchChartData2 = async () => {
            if (startDate && endDate) {
                const data = await calcularM3PorCliente(startDate, endDate)
                const formattedData = Object.entries(data).map(([Cliente, M3]) => ({ Cliente, M3 }))
                setChartData2(formattedData)
            }
        }

        fetchChartData2()
    }, [startDate, endDate])

    return {
        startDate,
        endDate,
        chartData,
        chartData2,
        colors,
        setStartDate,
        setEndDate
    }
}