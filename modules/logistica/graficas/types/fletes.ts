export interface Flete {
    Equipo: string;
    TotalFlete: number;
    DescripcionDelViaje: string[];
}

export interface FleteAgrupado {
    DescripcionDelViaje: string;
    TotalFlete: number;
    Equipos: string[];
}

export interface ResultFlete {
    data: Flete[];
    equiposFiltrados: string[];
    descripcionesFiltradas: string[];
}