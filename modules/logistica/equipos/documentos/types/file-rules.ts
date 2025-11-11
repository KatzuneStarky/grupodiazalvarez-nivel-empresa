import { ArchivosVencimiento } from "@/modules/logistica/bdd/equipos/types/archivos-vencimiento";
import { Certificado } from "@/modules/logistica/bdd/equipos/types/certificados";
import { calcularEstadoVencimiento } from "@/functions/tipo-archivo-equipo";
import { Archivo } from "@/modules/logistica/bdd/equipos/types/archivos";
import { Equipo } from "@/modules/logistica/bdd/equipos/types/equipos";
import { parseFirebaseDate } from "@/utils/parse-timestamp-date";
import { EstadoDocumento } from "../enum/estado-documento";
import { DocumentoConFecha } from "./documento-fecha";

export const tieneFecha = (
  archivo: Archivo | Certificado | ArchivosVencimiento | null | undefined
): archivo is DocumentoConFecha => {
  if (!archivo || !("fecha" in archivo)) return false;

  const fecha = parseFirebaseDate((archivo as any).fecha);
  return fecha instanceof Date && !isNaN(fecha.getTime());
};

export type ReglaVencimiento = {
  tipo: "CERTIFICADO" | "POLIZA DE SEGURO" | "VERIFICACION FISICO" | "VERIFICACION HUMO";
  addYears?: number;
  addMonths?: number;
};

export const getDaysUntil = (date: Date | string): number => {
  const today = new Date();
  const parsed = typeof date === "string" ? new Date(date) : parseFirebaseDate(date);
  const diffTime = parsed.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const reglas: ReglaVencimiento[] = [
  { tipo: "CERTIFICADO", addYears: 3 },
  { tipo: "POLIZA DE SEGURO", addYears: 1 },
  { tipo: "VERIFICACION FISICO", addYears: 1 },
  { tipo: "VERIFICACION HUMO", addMonths: 6 },
];

export const getSafeDocuments = (truck: Equipo): DocumentoConFecha[] => {
  const all = [
    ...(truck.Certificado || []),
    ...(truck.ArchivosVencimiento || []),
    ...(truck.archivos || []),
  ];

  return all.filter(tieneFecha);
};

export const calcularCumplimientoDocumentalDetallado = (equipos: Equipo[]) => {
  const allDocs = equipos.flatMap(getSafeDocuments);

  if (allDocs.length === 0) {
    return {
      total: 0,
      sinFecha: 0,
      vencidos: 0,
      porVencer: 0,
      enTiempo: 0,
      porcentajeCumplimiento: 0,
    };
  }

  const estados = allDocs.map(calcularEstadoVencimiento);

  const sinFecha = estados.filter(e => e === EstadoDocumento.SIN_FECHA).length;
  const vencidos = estados.filter(e => e === EstadoDocumento.VENCIDO).length;
  const porVencer = estados.filter(e => e === EstadoDocumento.POR_VENCER).length;
  const enTiempo = estados.filter(e => e === EstadoDocumento.EN_TIEMPO).length;

  const porcentajeCumplimiento = Math.round(((enTiempo + porVencer) / allDocs.length) * 100);

  return {
    total: allDocs.length,
    sinFecha,
    vencidos,
    porVencer,
    enTiempo,
    porcentajeCumplimiento,
  };
};