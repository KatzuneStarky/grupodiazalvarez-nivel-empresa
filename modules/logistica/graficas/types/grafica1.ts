export type ReporteData = {
    descripcionDelViaje: string;
    producto: string;
    totalM3: number;
};

export interface Data2Item {
    DescripcionDelViaje: string;
    Cliente: string;
    Producto: string;
    sumaM3: number;
}

export interface ReporteViajesFilter {
    mes: string;
    clientes: string[] | null;
    productos: string[] | null;
    descripcionesDelViaje: string[] | null;
    year?: number
}

export interface M3SumByDescripcionYProducto {
    descripcionDelViaje: string;
    producto: string;
    totalM3: number;
}

export interface Resultado {
    m3PorDescripcionYProducto: M3SumByDescripcionYProducto[];
    clientesFiltrados: string[];
    productosFiltrados: string[];
    descripcionesFiltradas: string[];
}