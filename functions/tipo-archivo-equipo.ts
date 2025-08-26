import { ArchivosVencimiento } from "@/modules/logistica/bdd/equipos/types/archivos-vencimiento";
import { VencimientoEstado } from "@/modules/logistica/equipos/documentos/enum/estado-documento";
import { DocumentoConFecha } from "@/modules/logistica/equipos/documentos/types/file-rules";
import { Certificado } from "@/modules/logistica/bdd/equipos/types/certificados";
import { Archivo } from "@/modules/logistica/bdd/equipos/types/archivos";
import { Timestamp } from "firebase/firestore";
import { differenceInDays } from "date-fns";

export const obtenerFechaVencimiento = (archivo: DocumentoConFecha): Date | null => {
  const fechaBase = archivo.fecha instanceof Timestamp 
    ? archivo.fecha.toDate() 
    : archivo.fecha;

  if ("nombre" in archivo) {
    if (archivo.nombre.includes("CERTIFICADO")) {
      const vencimiento = new Date(fechaBase);
      vencimiento.setFullYear(vencimiento.getFullYear() + 3);
      return vencimiento;
    }
    if (archivo.nombre.includes("POLIZA DE SEGURO") || archivo.nombre.includes("VERIFICACION FISICO")) {
      const vencimiento = new Date(fechaBase);
      vencimiento.setFullYear(vencimiento.getFullYear() + 1);
      return vencimiento;
    }
    if (archivo.nombre.includes("VERIFICACION HUMO")) {
      const vencimiento = new Date(fechaBase);
      vencimiento.setMonth(vencimiento.getMonth() + 6);
      return vencimiento;
    }
  }

  return null;
};

export const calcularEstadoVencimiento = (archivo: DocumentoConFecha): VencimientoEstado => {
  const fechaVencimiento = obtenerFechaVencimiento(archivo);
  if (!fechaVencimiento) return VencimientoEstado.VENCIDO;

  const diasRestantes = differenceInDays(fechaVencimiento, new Date());

  if (diasRestantes <= 0) return VencimientoEstado.VENCIDO;
  if (diasRestantes <= 30) return VencimientoEstado.POR_VENCER;
  return VencimientoEstado.EN_TIEMPO;
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