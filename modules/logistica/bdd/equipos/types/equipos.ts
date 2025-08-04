import { ArchivosVencimiento } from "../equipos/archivos-vencimiento";
import { Mantenimiento } from "../mantenimiento/mantenimiento";
import { EstadoEquipos } from "../../enum/estado-equipos";
import { Certificado } from "../equipos/certificados";
import { Revisiones } from "../revisiones/revisiones";
import { Archivo } from "../equipos/archivos";
import { Tanque } from "../equipos/tanque";

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
    mantenimiento: Mantenimiento[];
    Revisiones: Revisiones[];
    createAt: Date;
    updateAt: Date;
    Certificado: Certificado[];
    ArchivosVencimiento: ArchivosVencimiento[];
}

export interface EquipoRevision {
    equipo: Equipo;
    revision: Revisiones;
}