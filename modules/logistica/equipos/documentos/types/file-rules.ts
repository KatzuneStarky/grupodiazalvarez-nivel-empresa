import { ArchivosVencimiento } from "@/modules/logistica/bdd/equipos/types/archivos-vencimiento";
import { Certificado } from "@/modules/logistica/bdd/equipos/types/certificados";

export type ReglaVencimiento = {
  tipo: "CERTIFICADO" | "POLIZA DE SEGURO" | "VERIFICACION FISICO" | "VERIFICACION HUMO";
  addYears?: number;
  addMonths?: number;
};

export const reglas: ReglaVencimiento[] = [
  { tipo: "CERTIFICADO", addYears: 3 },
  { tipo: "POLIZA DE SEGURO", addYears: 1 },
  { tipo: "VERIFICACION FISICO", addYears: 1 },
  { tipo: "VERIFICACION HUMO", addMonths: 6 },
];

export type DocumentoConFecha = Certificado | ArchivosVencimiento;