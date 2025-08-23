import { ResultadoConDatos, RepeticionesEquipoGrafica2, RepeticionesEquipoGrafica3 } from "@/modules/logistica/graficas/types/grafica2";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/client";

async function construirQuery(
    nombreMes: string,
    equipos: string[] | null = null,
    productos: string[] | null = null,
    year?: number
) {
    const reporteViajesRef = collection(db, "reporteViajes");
    let q = query(reporteViajesRef, where("Mes", "==", nombreMes));

    if (equipos && equipos.length > 0) {
        q = query(q, where("Equipo", "in", equipos));
    }

    if (productos && productos.length > 0) {
        q = query(q, where("Producto", "in", productos));
    }

    const yearParam = year ?? new Date().getFullYear();

    if (typeof yearParam === "number") {
        q = query(q, where("Year", "==", yearParam));
    }

    return q;
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

        const conteoEquipos = querySnapshot.docs.reduce((acc, doc) => {
            const data = doc.data();
            const { Equipo, M3, Producto } = data;

            if (!acc[Equipo]) {
                acc[Equipo] = { conteoViajes: 0, sumaM3: 0, Productos: new Set() };
            }

            acc[Equipo].conteoViajes++;
            acc[Equipo].sumaM3 += M3 || 0;
            acc[Equipo].Productos.add(Producto);

            return acc;
        }, {} as Record<string, { conteoViajes: number; sumaM3: number; Productos: Set<string> }>);

        // Convertir el resultado a un array de RepeticionesEquipo
        const datos = Object.keys(conteoEquipos).map((equipo) => ({
            Viajes: equipo,
            conteoViajes: conteoEquipos[equipo].conteoViajes,
            sumaM3: conteoEquipos[equipo].sumaM3,
            Productos: Array.from(conteoEquipos[equipo].Productos),
        }));

        // Extraer productos y equipos únicos
        const productosFiltrados = Array.from(
            new Set(datos.flatMap((item) => item.Productos))
        );
        const equiposFiltrados = Array.from(
            new Set(datos.map((item) => item.Viajes))
        );

        // Devolver el objeto combinado
        return {
            datos,
            productosFiltrados,
            equiposFiltrados,
        };
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

        const conteoEquipos = querySnapshot.docs.reduce((acc, doc) => {
            const data = doc.data();
            const { Equipo, FALTANTESYOSOBRANTESA20, FALTANTESYOSOBRANTESALNATURAL, DescripcionDelViaje, Producto } = data;

            if (!acc[Equipo]) {
                acc[Equipo] = {};
            }
            if (!acc[Equipo][DescripcionDelViaje]) {
                acc[Equipo][DescripcionDelViaje] = { Productos: new Set<string>(), conteoViajes: 0, FALTANTESYOSOBRANTESA20: 0, FALTANTESYOSOBRANTESALNATURAL: 0 };
            }
            acc[Equipo][DescripcionDelViaje].Productos.add(Producto);
            acc[Equipo][DescripcionDelViaje].conteoViajes++;
            acc[Equipo][DescripcionDelViaje].FALTANTESYOSOBRANTESA20 += FALTANTESYOSOBRANTESA20 !== null ? Number(FALTANTESYOSOBRANTESA20) : 0;
            acc[Equipo][DescripcionDelViaje].FALTANTESYOSOBRANTESALNATURAL += FALTANTESYOSOBRANTESALNATURAL !== null ? Number(FALTANTESYOSOBRANTESALNATURAL) : 0;

            return acc;
        }, {} as Record<string, Record<string, { Productos: Set<string>; conteoViajes: number; FALTANTESYOSOBRANTESA20: number; FALTANTESYOSOBRANTESALNATURAL: number }>>);

        const resultado: RepeticionesEquipoGrafica2[] = [];
        for (const equipo in conteoEquipos) {
            for (const descripcion in conteoEquipos[equipo]) {
                const { Productos, conteoViajes, FALTANTESYOSOBRANTESA20, FALTANTESYOSOBRANTESALNATURAL } = conteoEquipos[equipo][descripcion];
                resultado.push({
                    Viajes: equipo,
                    DescripcionDelViaje: descripcion,
                    Productos: Array.from(Productos),
                    conteoViajes,
                    FALTANTESYOSOBRANTESA20,
                    FALTANTESYOSOBRANTESALNATURAL,
                });
            }
        }

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
            const data = doc.data();
            return {
                Producto: data.Producto,
                Equipo: data.Equipo,
                FALTANTESYOSOBRANTESA20: data.FALTANTESYOSOBRANTESA20 ? data.FALTANTESYOSOBRANTESA20.toString() : null,
                DescripcionDelViaje: data.DescripcionDelViaje,
            };
        });
    } catch (error) {
        console.error("Error obteniendo repeticiones de equipos para gráfica 3:", error);
        throw error;
    }
}