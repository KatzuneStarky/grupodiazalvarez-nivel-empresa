import { ArchivosVencimiento } from "@/modules/logistica/bdd/equipos/types/archivos-vencimiento";
import { EstadoDocumento, VencimientoEstado } from "@/modules/logistica/equipos/documentos/enum/estado-documento";
import { DocumentoConFecha } from "@/modules/logistica/equipos/documentos/types/documento-fecha";
import { reglas } from "@/modules/logistica/equipos/functions/detailed-equipo-data";
import { Certificado } from "@/modules/logistica/bdd/equipos/types/certificados";
import { Archivo } from "@/modules/logistica/bdd/equipos/types/archivos";
import { parseFirebaseDate } from "@/utils/parse-timestamp-date";
import { differenceInDays } from "date-fns";

export const obtenerFechaVencimiento = (archivo: DocumentoConFecha): Date | null => {
  if (!archivo.fecha) return null;

  const base = parseFirebaseDate(archivo.fecha);
  const regla = reglas.find(r => archivo.nombre.toUpperCase().includes(r.tipo));
  if (!regla) return null;

  const vencimiento = new Date(base);
  if (regla.addYears) vencimiento.setFullYear(vencimiento.getFullYear() + regla.addYears);
  if (regla.addMonths) vencimiento.setMonth(vencimiento.getMonth() + regla.addMonths);
  return vencimiento;
};

export const calcularEstadoVencimiento = (archivo: DocumentoConFecha): EstadoDocumento => {
  const fechaVencimiento = obtenerFechaVencimiento(archivo);
  if (!fechaVencimiento) return EstadoDocumento.SIN_FECHA;

  const dias = differenceInDays(fechaVencimiento, new Date());
  if (dias <= 0) return EstadoDocumento.VENCIDO;
  if (dias <= 30) return EstadoDocumento.POR_VENCER;
  return EstadoDocumento.EN_TIEMPO;
};

const tieneFecha = (archivo: Archivo | Certificado | ArchivosVencimiento): archivo is Certificado | ArchivosVencimiento => {
  return archivo && "fecha" in archivo;
};

export const esCertificado = (archivo: Archivo | Certificado | ArchivosVencimiento): archivo is Certificado => {
  return tieneFecha(archivo) && archivo.nombre.includes("CERTIFICADO");
};

export const esArchivoVencimiento = (archivo: Archivo | Certificado | ArchivosVencimiento): archivo is ArchivosVencimiento => {
  return tieneFecha(archivo) && (
    archivo.nombre.includes("POLIZA DE SEGURO") ||
    archivo.nombre.includes("VERIFICACION FISICO") ||
    archivo.nombre.includes("VERIFICACION HUMO")
  );
};