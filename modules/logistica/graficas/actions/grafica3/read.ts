import { collection, getDocs, Query, query, where } from "firebase/firestore";
import { Data, Data3, Data4, ResultData1 } from "../../types/grafica3";
import { db } from "@/firebase/client";

export async function obtenerReporte1(
    nombreMes: string,
    productos: string[] | null = null,
    clientes: string[] | null = null,
    descripciones: string[] | null = null,
    municipios: string[] | null = null,
    year?: number
): Promise<ResultData1> {
    try {
        const reporteViajesRef = collection(db, "reporteViajes");

        let q: Query = query(reporteViajesRef, where("Mes", "==", nombreMes));

        if (clientes?.length) {
            q = query(q, where("Cliente", "in", clientes));
        }
        if (productos?.length) {
            q = query(q, where("Producto", "in", productos));
        }
        if (descripciones?.length) {
            q = query(q, where("DescripcionDelViaje", "in", descripciones));
        }
        if (municipios?.length) {
            q = query(q, where("Municipio", "in", municipios));
        }

        const yearParam = year ?? new Date().getFullYear();
        q = query(q, where("Year", "==", yearParam));

        const querySnapshot = await getDocs(q);

        const resultado: Data[] = [];
        const clientesSet = new Set<string>();
        const productosSet = new Set<string>();
        const descripcionesSet = new Set<string>();
        const municipiosSet = new Set<string>();

        const map = new Map<
            string,
            { DescripcionDelViaje: Set<string>; Municipio: string; M3: number }
        >();

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const { Cliente, M3, DescripcionDelViaje, Producto, Municipio } = data;

            const key = `${Cliente}|${Producto}|${DescripcionDelViaje}`;

            if (!map.has(key)) {
                map.set(key, {
                    DescripcionDelViaje: new Set<string>(),
                    Municipio,
                    M3: 0,
                });
            }

            const item = map.get(key)!;
            item.DescripcionDelViaje.add(DescripcionDelViaje);
            item.M3 += M3 ? Number(M3) : 0;

            clientesSet.add(Cliente);
            productosSet.add(Producto);
            descripcionesSet.add(DescripcionDelViaje);
            municipiosSet.add(Municipio);
        });

        for (const [key, value] of map.entries()) {
            const [Cliente, Producto] = key.split("|");
            resultado.push({
                Cliente,
                Producto,
                Municipio: value.Municipio,
                DescripcionDelViaje: Array.from(value.DescripcionDelViaje),
                sumaM3: value.M3,
            });
        }

        return {
            resultado,
            clientesFiltrados: Array.from(clientesSet),
            productosFiltrados: Array.from(productosSet),
            descripcionesFiltradas: Array.from(descripcionesSet),
            municipiosFiltrados: Array.from(municipiosSet),
        };
    } catch (error) {
        console.error("Error en obtenerReporte1:", error);
        throw error;
    }
}

export async function obtenerReporte2(
    nombreMes: string,
    productos: string[] | null = null,
    clientes: string[] | null = null,
    descripciones: string[] | null = null,
    municipios: string[] | null = null,
    year?: number
): Promise<Data3[]> {
    const reporteViajesRef = collection(db, "reporteViajes");

    let q = query(reporteViajesRef, where("Mes", "==", nombreMes));

    if (clientes && clientes.length > 0) {
        q = query(q, where("Cliente", "in", clientes));
    }

    if (productos && productos.length > 0) {
        q = query(q, where("Producto", "in", productos));
    }

    if (descripciones && descripciones.length > 0) {
        q = query(q, where("DescripcionDelViaje", "in", descripciones));
    }

    if (municipios && municipios.length > 0) { // Filtrado por múltiples municipios
        q = query(q, where("Municipio", "in", municipios));
    }

    const yearParam = year ?? new Date().getFullYear();

    if (typeof yearParam === "number") {
        q = query(q, where("Year", "==", yearParam));
    }

    const querySnapshot = await getDocs(q);

    const conteoEquipos: Record<
        string,
        Record<
            string,
            Record<
                string,
                Record<
                    string,
                    {
                        DescripcionDelViaje: Set<string>;
                        M3: number;
                        FALTANTESYOSOBRANTESA20: number;
                        FALTANTESYOSOBRANTESALNATURAL: number;
                        conteoViajes: number;
                    }
                >
            >
        >
    > = {};

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const {
            Cliente,
            DescripcionDelViaje,
            Producto,
            Municipio,
            M3,
            FALTANTESYOSOBRANTESA20,
            FALTANTESYOSOBRANTESALNATURAL,
        } = data;

        if (!conteoEquipos[Cliente]) {
            conteoEquipos[Cliente] = {};
        }
        if (!conteoEquipos[Cliente][Producto]) {
            conteoEquipos[Cliente][Producto] = {};
        }
        const descripcionKey = JSON.stringify(DescripcionDelViaje);
        if (!conteoEquipos[Cliente][Producto][descripcionKey]) {
            conteoEquipos[Cliente][Producto][descripcionKey] = {};
        }
        if (!conteoEquipos[Cliente][Producto][descripcionKey][Municipio]) {
            conteoEquipos[Cliente][Producto][descripcionKey][Municipio] = {
                DescripcionDelViaje: new Set<string>(),
                M3: 0,
                FALTANTESYOSOBRANTESA20: 0,
                FALTANTESYOSOBRANTESALNATURAL: 0,
                conteoViajes: 0,
            };
        }

        conteoEquipos[Cliente][Producto][descripcionKey][Municipio].DescripcionDelViaje.add(
            DescripcionDelViaje
        );
        conteoEquipos[Cliente][Producto][descripcionKey][Municipio].M3 += M3 !== null ? Number(M3) : 0;
        conteoEquipos[Cliente][Producto][descripcionKey][Municipio].FALTANTESYOSOBRANTESA20 +=
            FALTANTESYOSOBRANTESA20 !== null ? Number(FALTANTESYOSOBRANTESA20) : 0;
        conteoEquipos[Cliente][Producto][descripcionKey][Municipio].FALTANTESYOSOBRANTESALNATURAL +=
            FALTANTESYOSOBRANTESALNATURAL !== null ? Number(FALTANTESYOSOBRANTESALNATURAL) : 0;
        conteoEquipos[Cliente][Producto][descripcionKey][Municipio].conteoViajes += 1;
    });

    const resultado: Data3[] = [];

    for (const cliente in conteoEquipos) {
        for (const producto in conteoEquipos[cliente]) {
            for (const descripcion in conteoEquipos[cliente][producto]) {
                for (const municipio in conteoEquipos[cliente][producto][descripcion]) {
                    const conteoMunicipio = conteoEquipos[cliente][producto][descripcion][municipio];
                    if (conteoMunicipio) {
                        resultado.push({
                            Cliente: cliente,
                            DescripcionDelViaje: JSON.parse(descripcion),
                            Producto: producto,
                            Municipio: municipio,
                            conteoViajes: conteoMunicipio.conteoViajes,
                            FALTANTESYOSOBRANTESA20: conteoMunicipio.FALTANTESYOSOBRANTESA20,
                            FALTANTESYOSOBRANTESALNATURAL: conteoMunicipio.FALTANTESYOSOBRANTESALNATURAL,
                            sumaM3: conteoMunicipio.M3,
                        });
                    }
                }
            }
        }
    }

    return resultado;
}

export async function obtenerReporte3(
    nombreMes: string,
    productos: string[] | null = null,
    clientes: string[] | null = null,
    descripciones: string[] | null = null,
    municipios: string[] | null = null,
    year?: number
): Promise<Data4[]> {
    try {
        const reporteViajesRef = collection(db, "reporteViajes");

        let q = query(reporteViajesRef, where("Mes", "==", nombreMes));

        // Agregar filtro por clientes si se especifican
        if (clientes && clientes.length > 0) {
            q = query(q, where("Cliente", "in", clientes));
        }

        // Agregar filtro por productos si se especifican
        if (productos && productos.length > 0) {
            q = query(q, where("Producto", "in", productos));
        }

        // Agregar filtro por descripciones del viaje si se especifican
        if (descripciones && descripciones.length > 0) {
            q = query(q, where("DescripcionDelViaje", "in", descripciones));
        }

        // Agregar filtro por municipios si se especifican
        if (municipios && municipios.length > 0) { // Filtrado por múltiples municipios
            q = query(q, where("Municipio", "in", municipios));
        }

        const yearParam = year ?? new Date().getFullYear();

        if (typeof yearParam === "number") {
            q = query(q, where("Year", "==", yearParam));
        }

        const querySnapshot = await getDocs(q);

        // Formatear los datos obtenidos
        const datosFormateados = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                Cliente: data.Cliente,
                DescripcionDelViaje: data.DescripcionDelViaje,
                Producto: data.Producto,
                Municipio: data.Municipio,
                FALTANTESYOSOBRANTESA20: data.FALTANTESYOSOBRANTESA20
                    ? data.FALTANTESYOSOBRANTESA20.toString()
                    : null,
                Equipo: data.Equipo,
            };
        });

        return datosFormateados;
    } catch (error) {
        // Manejo de errores
        console.error("Error al obtener el reporte:", error);
        throw error;
    }
}