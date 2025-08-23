import { collection, getDocs, query, where } from "firebase/firestore";
import { Flete, FleteAgrupado, ResultFlete } from "../../types/fletes";
import { db } from "@/firebase/client";

export async function obtenerFletesPorMesDescripcionDelViajeYEquipo(
    nombreMes: string,
    descripcionDelViaje?: string[],
    equipo?: string[],
    year?: number
): Promise<ResultFlete> {
    try {
        const reporteViajesRef = collection(db, "reporteViajes");
        const yearParam = year ?? new Date().getFullYear();

        const queryConstraints = [
            where("Mes", "==", nombreMes),
            where("Year", "==", yearParam),
        ];

        if (descripcionDelViaje?.length) {
            queryConstraints.push(where("DescripcionDelViaje", "in", descripcionDelViaje));
        }

        if (equipo?.length) {
            queryConstraints.push(where("Equipo", "in", equipo));
        }

        const q = query(reporteViajesRef, ...queryConstraints);
        const querySnapshot = await getDocs(q);

        const equiposSet = new Set<string>();
        const descripcionesSet = new Set<string>();

        const resultados = querySnapshot.docs.reduce((acc, doc) => {
            const data = doc.data();
            const { Equipo, Flete, DescripcionDelViaje } = data;

            if (!Equipo || !Flete) return acc;

            const fleteNumber = Number(Flete);
            const descripciones = Array.isArray(DescripcionDelViaje)
                ? DescripcionDelViaje
                : [DescripcionDelViaje].filter(Boolean);

            if (!acc[Equipo]) {
                acc[Equipo] = { DescripcionDelViaje: [], TotalFlete: 0 };
            }

            acc[Equipo].DescripcionDelViaje.push(...descripciones);
            acc[Equipo].TotalFlete += fleteNumber;

            // Guardar valores únicos en los sets
            equiposSet.add(Equipo);
            descripciones.forEach((d) => descripcionesSet.add(d));

            return acc;
        }, {} as { [equipo: string]: { DescripcionDelViaje: string[]; TotalFlete: number } });

        const data: Flete[] = Object.entries(resultados).map(([Equipo, { DescripcionDelViaje, TotalFlete }]) => ({
            Equipo,
            DescripcionDelViaje,
            TotalFlete,
        }));

        return {
            data,
            equiposFiltrados: Array.from(equiposSet),
            descripcionesFiltradas: Array.from(descripcionesSet),
        };
    } catch (error) {
        console.error("Error al obtener los fletes:", error);
        throw new Error("Error al obtener los fletes. Por favor, verifica los parámetros e intenta nuevamente.");
    }
}

export async function obtenerFletesPorMesEquipoYDescripcionDelViaje(
    nombreMes: string,
    descripcionDelViaje?: string[],
    equipo?: string[],
    year?: number
): Promise<{ data: FleteAgrupado[] }> {
    try {
        const reporteViajesRef = collection(db, "reporteViajes");
        const yearParam = year ?? new Date().getFullYear();

        // Construir la consulta
        const queryConstraints = [
            where("Mes", "==", nombreMes),
            where("Year", "==", yearParam),
        ];

        // Filtrar por descripciones de viaje (si se proporcionan)
        if (descripcionDelViaje && descripcionDelViaje.length > 0) {
            queryConstraints.push(where("DescripcionDelViaje", "in", descripcionDelViaje));
        }

        // Filtrar por equipos (si se proporcionan)
        if (equipo && equipo.length > 0) {
            queryConstraints.push(where("Equipo", "in", equipo));
        }

        const q = query(reporteViajesRef, ...queryConstraints);
        const querySnapshot = await getDocs(q);

        // Procesar los datos con reduce
        const resultados = querySnapshot.docs.reduce((acc, doc) => {
            const data = doc.data();
            const { DescripcionDelViaje, Equipo, Flete } = data;

            // Validar datos requeridos
            if (!DescripcionDelViaje || !Flete) return acc;

            const fleteNumber = Number(Flete);

            // Inicializar la estructura si no existe
            if (!acc[DescripcionDelViaje]) {
                acc[DescripcionDelViaje] = {
                    Equipos: new Set<string>(),
                    TotalFlete: 0,
                };
            }

            // Acumular datos
            if (Equipo) {
                acc[DescripcionDelViaje].Equipos.add(Equipo);
            }
            acc[DescripcionDelViaje].TotalFlete += fleteNumber;

            return acc;
        }, {} as { [descripcion: string]: { Equipos: Set<string>; TotalFlete: number } });

        // Convertir los resultados en la estructura deseada
        const data = Object.entries(resultados).map(([DescripcionDelViaje, { Equipos, TotalFlete }]) => ({
            DescripcionDelViaje,
            Equipos: Array.from(Equipos),
            TotalFlete,
            CountEquipos: Equipos.size,
        }));

        return { data };
    } catch (error) {
        console.error("Error al obtener los fletes:", error);
        throw new Error("Error al obtener los fletes");
    }
}