import { M3SumByDescripcionYProducto, ReporteViajesFilter, Resultado } from "../../types/grafica1";
import { ReporteViajes } from "@/modules/logistica/reportes-viajes/types/reporte-viajes";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/client";

export async function obtenerM3PorDescripcion({
    mes,
    clientes,
    productos,
    descripcionesDelViaje,
    year
}: ReporteViajesFilter): Promise<Resultado> {
    const conditions = [
        where("Mes", "==", mes),
        where("Year", "==", year ?? new Date().getFullYear())
    ];

    if (clientes && clientes.length > 0) {
        if (clientes.length <= 10) {
            conditions.push(where("Cliente", "in", clientes));
        } else {
            console.warn("El filtro de clientes supera los 10 elementos y debe dividirse en lotes.");
        }
    }

    if (productos && productos.length > 0) {
        if (productos.length <= 10) {
            conditions.push(where("Producto", "in", productos));
        } else {
            console.warn("El filtro de productos supera los 10 elementos y debe dividirse en lotes.");
        }
    }

    if (descripcionesDelViaje && descripcionesDelViaje.length > 0) {
        if (descripcionesDelViaje.length <= 10) {
            conditions.push(where("DescripcionDelViaje", "in", descripcionesDelViaje));
        } else {
            console.warn("El filtro de descripciones supera los 10 elementos y debe dividirse en lotes.");
        }
    }

    const q = query(collection(db, "reporteViajes"), ...conditions);
    const querySnapshot = await getDocs(q);

    const m3SumByDescripcionYProducto = new Map<string, Map<string, number>>();
    const clientesFiltrados = new Set<string>();
    const productosFiltrados = new Set<string>();
    const descripcionesFiltradas = new Set<string>();

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const { DescripcionDelViaje, M3, Cliente, Producto } = data;

        clientesFiltrados.add(Cliente);
        productosFiltrados.add(Producto);
        descripcionesFiltradas.add(DescripcionDelViaje);

        if (!m3SumByDescripcionYProducto.has(DescripcionDelViaje)) {
            m3SumByDescripcionYProducto.set(DescripcionDelViaje, new Map());
        }

        const productoMap = m3SumByDescripcionYProducto.get(DescripcionDelViaje)!;
        productoMap.set(Producto, (productoMap.get(Producto) || 0) + (M3 || 0));
    });

    const m3PorDescripcionYProducto: M3SumByDescripcionYProducto[] = [];

    m3SumByDescripcionYProducto.forEach((productos, descripcionDelViaje) => {
        productos.forEach((totalM3, producto) => {
            m3PorDescripcionYProducto.push({ descripcionDelViaje, producto, totalM3 });
        });
    });

    return {
        m3PorDescripcionYProducto,
        clientesFiltrados: [...clientesFiltrados],
        productosFiltrados: [...productosFiltrados],
        descripcionesFiltradas: [...descripcionesFiltradas],
    };
}

export async function obtenerSumaM3PorDescripcionDelViaje(
    descripcionDelViaje: string[] | null = null,
    mes: string,
    clientes: string[] | null = null,
    productos: string[] | null = null,
    year?: number
): Promise<{ data: { DescripcionDelViaje: string; Cliente: string; Producto: string; sumaM3: number }[] }> {
    const conditions = [
        where("Mes", "==", mes),
        where("Year", "==", year ?? new Date().getFullYear())
    ];

    if (clientes?.length) {
        conditions.push(where("Cliente", "in", clientes));
    }
    if (productos?.length) {
        conditions.push(where("Producto", "in", productos));
    }
    if (descripcionDelViaje?.length) {
        conditions.push(where("DescripcionDelViaje", "in", descripcionDelViaje));
    }

    const q = query(collection(db, "reporteViajes"), ...conditions);
    const querySnapshot = await getDocs(q);

    const dataMap = querySnapshot.docs.reduce((acc, doc) => {
        const reporte = doc.data() as ReporteViajes;
        const { DescripcionDelViaje, Cliente, Producto, M3 } = reporte;

        if (DescripcionDelViaje && Cliente && Producto && M3 !== undefined) {
            const key = `${DescripcionDelViaje}-${Cliente}-${Producto}`;
            if (!acc[key]) {
                acc[key] = { DescripcionDelViaje, Cliente, Producto, sumaM3: 0 };
            }
            acc[key].sumaM3 += M3;
        }

        return acc;
    }, {} as Record<string, { DescripcionDelViaje: string; Cliente: string; Producto: string; sumaM3: number }>);

    const data = Object.values(dataMap);

    return { data };
}

export async function fetchReporteDataGrafica1(
    mes: string,
    selectedClientes: string[],
    selectedProductos: string[],
    selectedDescripciones: string[],
    selectedYear: number | null,
    capitalizedMonthName: string,
    currentYear: number
) {
    const year = selectedYear ?? currentYear;

    const [response, response1] = await Promise.all([
        obtenerM3PorDescripcion({
            mes: mes || capitalizedMonthName,
            clientes: selectedClientes.length > 0 ? selectedClientes : null,
            productos: selectedProductos.length > 0 ? selectedProductos : null,
            descripcionesDelViaje: selectedDescripciones.length > 0 ? selectedDescripciones : null,
            year,
        }),
        obtenerSumaM3PorDescripcionDelViaje(
            selectedDescripciones.length > 0 ? selectedDescripciones : null,
            mes || capitalizedMonthName,
            selectedClientes.length > 0 ? selectedClientes : null,
            selectedProductos.length > 0 ? selectedProductos : null,
            year
        ),
    ]);

    return { response, response1 };
}