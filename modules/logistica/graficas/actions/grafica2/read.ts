import { ResultadoConDatos, RepeticionesEquipoGrafica2, RepeticionesEquipoGrafica3 } from "@/modules/logistica/graficas/types/grafica2";
import { collection, getDocs, Query, query, where } from "firebase/firestore";
import { db } from "@/firebase/client";

async function construirQuery(
    nombreMes: string,
    equipos: string[] | null = null,
    productos: string[] | null = null,
    year: number = new Date().getFullYear()
): Promise<Query> {
    const reporteViajesRef = collection(db, "reporteViajes");

    let q: Query = query(reporteViajesRef, where("Mes", "==", nombreMes));

    if (equipos?.length) {
        q = query(q, where("Equipo", "in", equipos));
    }

    if (productos?.length) {
        q = query(q, where("Producto", "in", productos));
    }

    q = query(q, where("Year", "==", year));

    return q;
}

interface EquipoStats {
    conteoViajes: number;
    sumaM3: number;
    productos: Set<string>;
}

interface ViajeStats {
    productos: Set<string>;
    conteoViajes: number;
    faltantesA20: number;
    faltantesNatural: number;
}

export async function obtenerRepeticionesEquipos(
    nombreMes: string,
    equipos: string[] | null = null,
    productos: string[] | null = null,
    year?: number
): Promise<ResultadoConDatos> {
    try {
        const q = await construirQuery(nombreMes, equipos, productos, year);
        const querySnapshot = await getDocs(q);

        const conteo = new Map<string, EquipoStats>();

        querySnapshot.forEach((doc) => {
            const { Equipo, M3 = 0, Producto } = doc.data();

            if (!Equipo) return;

            if (!conteo.has(Equipo)) {
                conteo.set(Equipo, { conteoViajes: 0, sumaM3: 0, productos: new Set() });
            }

            const equipoStats = conteo.get(Equipo)!;
            equipoStats.conteoViajes++;
            equipoStats.sumaM3 += M3;
            if (Producto) equipoStats.productos.add(Producto);
        });

        const datos = Array.from(conteo.entries()).map(([equipo, stats]) => ({
            Viajes: equipo,
            conteoViajes: stats.conteoViajes,
            sumaM3: stats.sumaM3,
            Productos: Array.from(stats.productos),
        }));

        const productosFiltrados = Array.from(new Set(datos.flatMap((item) => item.Productos)));
        const equiposFiltrados = datos.map((item) => item.Viajes);

        return { datos, productosFiltrados, equiposFiltrados };
    } catch (error) {
        console.error("Error obteniendo repeticiones de equipos:", error);
        throw error;
    }
}

export async function obtenerRepeticionesEquiposGrafica2(
    nombreMes: string,
    equipos: string[] | null = null,
    productos: string[] | null = null,
    year?: number
): Promise<RepeticionesEquipoGrafica2[]> {
    try {
        const q = await construirQuery(nombreMes, equipos, productos, year);
        const querySnapshot = await getDocs(q);

        const conteo = new Map<string, Map<string, ViajeStats>>();

        querySnapshot.forEach((doc) => {
            const {
                Equipo,
                DescripcionDelViaje,
                Producto,
                FALTANTESYOSOBRANTESA20 = 0,
                FALTANTESYOSOBRANTESALNATURAL = 0
            } = doc.data();

            if (!Equipo || !DescripcionDelViaje) return;

            if (!conteo.has(Equipo)) conteo.set(Equipo, new Map());
            const viajesMap = conteo.get(Equipo)!;

            if (!viajesMap.has(DescripcionDelViaje)) {
                viajesMap.set(DescripcionDelViaje, {
                    productos: new Set(),
                    conteoViajes: 0,
                    faltantesA20: 0,
                    faltantesNatural: 0,
                });
            }

            const stats = viajesMap.get(DescripcionDelViaje)!;
            stats.productos.add(Producto);
            stats.conteoViajes++;
            stats.faltantesA20 += Number(FALTANTESYOSOBRANTESA20) || 0;
            stats.faltantesNatural += Number(FALTANTESYOSOBRANTESALNATURAL) || 0;
        });

        const resultado: RepeticionesEquipoGrafica2[] = [];
        conteo.forEach((viajesMap, equipo) => {
            viajesMap.forEach((stats, descripcion) => {
                resultado.push({
                    Viajes: equipo,
                    DescripcionDelViaje: descripcion,
                    Productos: Array.from(stats.productos),
                    conteoViajes: stats.conteoViajes,
                    FALTANTESYOSOBRANTESA20: stats.faltantesA20,
                    FALTANTESYOSOBRANTESALNATURAL: stats.faltantesNatural,
                });
            });
        });

        return resultado;
    } catch (error) {
        console.error("Error obteniendo repeticiones de equipos para gráfica 2:", error);
        throw error;
    }
}

export async function obtenerRepeticionesEquiposGrafica3(
    nombreMes: string,
    equipos: string[] | null = null,
    productos: string[] | null = null,
    year?: number
): Promise<RepeticionesEquipoGrafica3[]> {
    try {
        const q = await construirQuery(nombreMes, equipos, productos, year);
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc) => {
            const {
                Producto,
                Equipo,
                FALTANTESYOSOBRANTESA20,
                DescripcionDelViaje,
            } = doc.data() as {
                Producto: string;
                Equipo: string;
                FALTANTESYOSOBRANTESA20?: number | null;
                DescripcionDelViaje: string;
            };

            return {
                Producto,
                Equipo,
                FALTANTESYOSOBRANTESA20:
                    FALTANTESYOSOBRANTESA20 != null ? FALTANTESYOSOBRANTESA20.toString() : null,
                DescripcionDelViaje,
            };
        });
    } catch (error) {
        console.error("Error obteniendo repeticiones de equipos para gráfica 3:", error);
        throw error;
    }
}