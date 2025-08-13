import { Operador } from "../../operadores/types/operadores";
import { ArchivosVencimiento } from "./archivos-vencimiento";
import { EstadoEquipos } from "../enum/estado-equipos";
import { Mantenimiento } from "./mantenimiento";
import { Certificado } from "./certificados";
import { Revisiones } from "./revisiones";
import { Archivo } from "./archivos";
import { Tanque } from "./tanque";

export interface Equipo {
    id: string;
    tipoUnidad?: string
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
    idOperador?: string
    operador?: Operador
    grupoUnidad: "GRUPO DIAZ ALVAREZ" | "FELIX DIAZ ALVAREZ" | "GENERAL"
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