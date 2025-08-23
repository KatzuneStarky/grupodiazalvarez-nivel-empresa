export interface Data {
    DescripcionDelViaje: string[];
    Cliente: string;
    Producto: string;
    Municipio: string;
    sumaM3: number;
}

export interface Data2 {
    DescripcionDelViaje: string[];
    Cliente: string;
    Producto: string;
    Municipio: string;
    sumaM3: number;
    Viajes: number
}

export interface Data3 {
    DescripcionDelViaje: string[];
    Cliente: string;
    Producto: string;
    Municipio: string;
    conteoViajes: number;
    FALTANTESYOSOBRANTESA20: number;
    FALTANTESYOSOBRANTESALNATURAL: number;
    sumaM3: number;
}

export interface Data4 {
    DescripcionDelViaje: string;
    Cliente: string;
    Producto: string;
    Municipio: string;
    FALTANTESYOSOBRANTESA20: string | null;
    Equipo: string
}

export interface FirestoreData {
    Cliente: string;
    DescripcionDelViaje: string;
    Producto: string;
    Municipio: string;
    FALTANTESYOSOBRANTESA20?: number | null;
    Equipo: string;
}

export interface ResultData1 {
    resultado: Data[]
    clientesFiltrados: string[];
    productosFiltrados: string[]
    descripcionesFiltradas: string[]
    municipiosFiltrados: string[]
}