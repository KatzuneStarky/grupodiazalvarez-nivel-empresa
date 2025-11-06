import { Timestamp } from "firebase/firestore";

export interface ProductoSuma {
    [producto: string]: number;
}

export interface DescripcionDelViaje {
    Descripcion: string;
    Productos: ProductoSuma;
}

export interface ClienteViajes {
    Cliente: string;
    DescripcionesDelViaje: DescripcionDelViaje[];
}

export interface ReporteViajes {
    id: string;
    Mes: string;
    Fecha: Date;
    FacturaPemex?: number;
    Cliente: string;
    DescripcionDelViaje: string;
    Producto: string;
    Equipo: string;
    Operador: string;
    M3?: number;
    LitrosA20?: number;
    LitrosDescargadosEstaciones?: number;
    Temp?: number;
    Incremento?: number;
    FALTANTESYOSOBRANTESA20?: number;
    FALTANTESYOSOBRANTESALNATURAL?: number;
    Municipio: string;
    Year?: number;
    Flete?: number;
    createdAt: Date;
    updatedAt: Date;
}