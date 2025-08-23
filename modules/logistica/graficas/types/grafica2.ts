export interface RepeticionesEquipo {
    Viajes: string;
    conteoViajes: number;
    sumaM3: number;
    Productos: string[];
    DescripcionDelViaje?: string;
}

export interface RepeticionesEquipoGrafica2 {
    Viajes: string;
    DescripcionDelViaje: string;
    Productos: string[];
    conteoViajes: number;
    FALTANTESYOSOBRANTESA20: number;
    FALTANTESYOSOBRANTESALNATURAL: number;
}

export interface RepeticionesEquipoGrafica3 {
    Equipo: string
    Producto: string;
    FALTANTESYOSOBRANTESA20: string | null;
    DescripcionDelViaje: string;
}

export interface ResultadoConDatos {
    datos: RepeticionesEquipo[];
    productosFiltrados: string[];
    equiposFiltrados: string[];
}