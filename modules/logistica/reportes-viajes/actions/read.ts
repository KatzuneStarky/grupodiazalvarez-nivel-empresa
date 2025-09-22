import { collection, getDocs, onSnapshot, query, Timestamp, where } from "firebase/firestore";
import { endOfWeek, getWeekOfMonth, startOfWeek, subWeeks } from "date-fns";
import { ReporteViajes } from "../types/reporte-viajes";
import { meses } from "@/constants/meses";
import { db } from "@/firebase/client";

export function getTotalFleteByMonth(
    year: number,
    callback: (data: { Mes: string; TotalFlete: number; Year: number }[]) => void
) {
    const reporteViajesRef = collection(db, "reporteViajes");
    const q = query(reporteViajesRef, where("Year", "==", year));

    onSnapshot(q, (querySnapshot) => {
        const fletePorMes = querySnapshot.docs.reduce((acc, doc) => {
            const data = doc.data() as ReporteViajes;
            const mes = data.Mes;
            const flete = data.Flete || 0;

            acc[mes] = (acc[mes] || 0) + flete;
            return acc;
        }, {} as Record<string, number>);

        const totalFletePorMes = meses.map((mes) => ({
            Mes: mes,
            TotalFlete: fletePorMes[mes] || 0,
            Year: year,
        }));

        callback(totalFletePorMes);
    });
}

export const getTotalM3ForCurrentMonth = async (mes: string, year: number): Promise<number> => {
    const reporteViajesRef = collection(db, "reporteViajes");
    const q = query(reporteViajesRef, where("Mes", "==", mes), where("Year", "==", year));
    const querySnapshot = await getDocs(q);

    const totalM3 = querySnapshot.docs.reduce((sum, doc) => {
        const data = doc.data() as ReporteViajes;
        return sum + (data.M3 || 0);
    }, 0);

    return totalM3;
};

export function getTotalFleteByWeek(
    year: number,
    month: string,
    callback: (total: number) => void
) {
    const reporteViajesRef = collection(db, "reporteViajes");
    const q = query(
        reporteViajesRef,
        where("Year", "==", year),
        where("Mes", "==", month)
    );

    const semanaActual = getWeekOfMonth(new Date());

    onSnapshot(q, (querySnapshot) => {
        const totalFlete = querySnapshot.docs.reduce((sum, doc) => {
            const data = doc.data() as ReporteViajes;
            const docDate = data.Fecha ? new Date(data.Fecha.toLocaleString()) : null;

            if (!docDate) return sum;

            const docWeek = getWeekOfMonth(docDate);
            return docWeek === semanaActual ? sum + (data.Flete || 0) : sum;
        }, 0);

        callback(totalFlete);
    });
}

export const getTotalM3ForCurrentWeek = async (year: number): Promise<number> => {
    const currentDate = new Date();
    const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
    const endOfCurrentWeek = endOfWeek(currentDate, { weekStartsOn: 1 });

    const reporteViajesRef = collection(db, "reporteViajes");
    const q = query(
        reporteViajesRef,
        where("Fecha", ">=", startOfCurrentWeek),
        where("Fecha", "<=", endOfCurrentWeek),
        where("Year", "==", year)
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.reduce((total, doc) => {
        const data = doc.data() as ReporteViajes;
        return total + (data.M3 || 0);
    }, 0);
};

const getTotalM3ForWeek = async (startDate: Date, endDate: Date, year: number): Promise<number> => {
    const reporteViajesRef = collection(db, "reporteViajes");
    const q = query(
        reporteViajesRef,
        where("Fecha", ">=", startDate),
        where("Fecha", "<=", endDate),
        where("Year", "==", year)
    );

    const querySnapshot = await getDocs(q);

    let totalM3 = 0;

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        totalM3 += data.M3 || 0;
    });

    return totalM3;
};

export const getPercentageChangeBetweenWeeks = async (year: number): Promise<number> => {
    const currentDate = new Date();

    const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
    const endOfCurrentWeek = endOfWeek(currentDate, { weekStartsOn: 1 });

    const startOfPreviousWeek = startOfWeek(subWeeks(currentDate, 1), { weekStartsOn: 1 });
    const endOfPreviousWeek = endOfWeek(subWeeks(currentDate, 1), { weekStartsOn: 1 });

    const totalM3CurrentWeek = await getTotalM3ForWeek(startOfCurrentWeek, endOfCurrentWeek, year);

    const totalM3PreviousWeek = await getTotalM3ForWeek(startOfPreviousWeek, endOfPreviousWeek, year);

    if (totalM3PreviousWeek === 0) {
        return 0;
    }

    const percentageChange = ((totalM3CurrentWeek - totalM3PreviousWeek) / totalM3PreviousWeek) * 100;

    return percentageChange;
};

export const getM3ByMonth = async (year: number): Promise<{ month: string; total: number }[]> => {
    const reportsRef = collection(db, "reporteViajes");

    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59);

    const reportsQuery = query(
        reportsRef,
        where("Fecha", ">=", startOfYear),
        where("Fecha", "<=", endOfYear)
    );

    const snapshot = await getDocs(reportsQuery);

    const data: { month: string; total: number }[] = meses.map((month) => ({
        month,
        total: 0,
    }));

    snapshot.forEach((doc) => {
        const report = doc.data() as ReporteViajes;

        if (report.M3 && report.Fecha) {
            let date: Date;

            if (report.Fecha instanceof Timestamp) {
                date = report.Fecha.toDate();
            } else {
                date = report.Fecha;
            }

            const monthIndex = date.getMonth();
            const monthName = meses[monthIndex];

            const monthData = data.find((d) => d.month === monthName);
            if (monthData) {
                monthData.total += report.M3;
            }
        }
    });

    return data;
};

export async function calcularFletePorCliente(
    startDate: Date,
    endDate: Date
): Promise<Record<string, number>> {
    try {
        const reporteCollection = collection(db, "reporteViajes");
        const startTimestamp = Timestamp.fromDate(startDate);
        const endTimestamp = Timestamp.fromDate(endDate);

        const q = query(
            reporteCollection,
            where("Fecha", ">=", startTimestamp),
            where("Fecha", "<=", endTimestamp)
        );

        const querySnapshot = await getDocs(q);

        const totalFletePorCliente: Record<string, number> = {};

        querySnapshot.forEach((doc) => {
            const data = doc.data() as ReporteViajes;
            const cliente = data.Cliente;
            const flete = data.Flete || 0;

            if (!totalFletePorCliente[cliente]) {
                totalFletePorCliente[cliente] = 0;
            }

            totalFletePorCliente[cliente] += flete;
        });

        return totalFletePorCliente;
    } catch (error) {
        console.error("Error al calcular el total de flete por cliente:", error);
        throw error;
    }
}

export async function calcularM3PorCliente(
    startDate: Date,
    endDate: Date
): Promise<Record<string, number>> {
    try {
        const reporteCollection = collection(db, "reporteViajes");
        const startTimestamp = Timestamp.fromDate(startDate);
        const endTimestamp = Timestamp.fromDate(endDate);

        const q = query(
            reporteCollection,
            where("Fecha", ">=", startTimestamp),
            where("Fecha", "<=", endTimestamp)
        );

        const querySnapshot = await getDocs(q);

        // Acumulador para total por cliente
        const totalM3PorCliente: Record<string, number> = {};

        querySnapshot.forEach((doc) => {
            const data = doc.data() as ReporteViajes;
            const cliente = data.Cliente;
            const m3 = data.M3 || 0;

            if (!totalM3PorCliente[cliente]) {
                totalM3PorCliente[cliente] = 0;
            }
            totalM3PorCliente[cliente] += m3;
        });

        return totalM3PorCliente;
    } catch (error) {
        console.error("Error al calcular el total de M3 por cliente:", error);
        throw error;
    }
}

export const groupByClienteDescripcion = (viajes: ReporteViajes[]) => {
    const result = viajes.reduce((acc, curr) => {
        const cliente = curr.Cliente;
        const descripcion = curr.DescripcionDelViaje;
        const municipio = curr.Municipio;

        if (!acc[cliente]) {
            acc[cliente] = { Municipio: municipio, Descripciones: {} };
        }

        if (!acc[cliente].Descripciones[descripcion]) {
            acc[cliente].Descripciones[descripcion] = { TotalA20: 0, TotalNatural: 0 };
        }

        acc[cliente].Descripciones[descripcion].TotalA20 += curr.FALTANTESYOSOBRANTESA20 || 0;
        acc[cliente].Descripciones[descripcion].TotalNatural += curr.FALTANTESYOSOBRANTESALNATURAL || 0;

        return acc;
    }, {} as Record<string, { Municipio?: string; Descripciones: Record<string, { TotalA20: number; TotalNatural: number }> }>);

    return Object.entries(result).map(([cliente, { Municipio, Descripciones }]) => ({
        Cliente: cliente,
        Municipio,
        Descripciones: Object.entries(Descripciones).map(([descripcion, totals]) => ({
            DescripcionDelViaje: descripcion,
            TotalA20: totals.TotalA20,
            TotalNatural: totals.TotalNatural,
        })),
    }));
};