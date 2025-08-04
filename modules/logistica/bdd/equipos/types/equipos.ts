import { EstadoEquipos } from "../enum/estado-equipos";
import { Archivo } from "./archivos";
import { ArchivosVencimiento } from "./archivos-vencimiento";
import { Certificado } from "./certificados";
import { Tanque } from "./tanque";

export interface Equipo {
    id: string;
    numEconomico: string;
    marca: string;
    modelo: string;
    year: number;
    serie?: string;
    placas?: string;
    m3?: number;
    tipoTanque?: string;
    activo?: boolean;
    estado: EstadoEquipos;
    archivos: Archivo[];
    tanque: Tanque[];
    //mantenimiento: Mantenimiento[];
    //Revisiones: Revisiones[];
    createAt: Date;
    updateAt: Date;
    Certificado: Certificado[];
    ArchivosVencimiento: ArchivosVencimiento[];
}

export interface EquipoRevision {
    equipo: Equipo;
    //revision: Revisiones;
}