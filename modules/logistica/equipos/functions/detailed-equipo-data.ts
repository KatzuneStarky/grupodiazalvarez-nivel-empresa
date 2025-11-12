import { ArchivosVencimiento } from "../../bdd/equipos/types/archivos-vencimiento";
import { addMonths, addYears, differenceInDays, isValid } from "date-fns";
import { DocumentoConFecha } from "../documentos/types/documento-fecha";
import { EstadoDocumento } from "../documentos/enum/estado-documento";
import { Certificado } from "../../bdd/equipos/types/certificados";
import { Archivo } from "../../bdd/equipos/types/archivos";
import { Equipo } from "../../bdd/equipos/types/equipos";
import { Timestamp } from "firebase/firestore";

export type EstadoVencimiento = "AL_DIA" | "PROXIMO" | "VENCIDO" | "SIN_FECHA";
interface ResultadoCumplimiento {
    total: number;
    sinFecha: number;
    vencidos: number;
    porVencer: number;
    enTiempo: number;
    porcentajeCumplimiento: number;
}

export function parseFirebaseDate(
    fecha: Date | Timestamp | string | number | null | undefined
): Date | null {
    if (!fecha) return null;

    if (fecha instanceof Date) return isNaN(fecha.getTime()) ? null : fecha;

    if (typeof fecha === "number") {
        const d = new Date(fecha);
        return isNaN(d.getTime()) ? null : d;
    }

    if (typeof fecha === "string") {
        const d = new Date(fecha);
        return isNaN(d.getTime()) ? null : d;
    }

    if (typeof (fecha as any).toDate === "function") {
        const d = (fecha as Timestamp).toDate();
        return isNaN(d.getTime()) ? null : d;
    }

    return null;
}

export const tieneFecha = (
    archivo: Archivo | Certificado | ArchivosVencimiento
): archivo is DocumentoConFecha => {
    return Boolean(archivo && "fecha");
};

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

export const esCertificado = (
    archivo: Archivo | Certificado | ArchivosVencimiento
): archivo is Certificado => {
    const nombre = archivo.nombre.toUpperCase();
    return tieneFecha(archivo) && nombre.includes("CERTIFICADO");
};

export const esArchivoVencimiento = (
    archivo: Archivo | Certificado | ArchivosVencimiento
): archivo is ArchivosVencimiento => {
    const nombre = archivo.nombre.toUpperCase();
    return (
        tieneFecha(archivo) &&
        (nombre.includes("POLIZA DE SEGURO") ||
            nombre.includes("VERIFICACION FISICO") ||
            nombre.includes("VERIFICACION HUMO"))
    );
};

export function calcularFechaVencimiento(archivo: DocumentoConFecha): Date | null {
    const nombre = archivo.nombre.toUpperCase();

    const regla = reglas.find((r) => nombre.includes(r.tipo));
    if (!regla) return null;

    const fechaBase = parseFirebaseDate(archivo.fecha);
    if (!(fechaBase instanceof Date) || isNaN(fechaBase.getTime())) return null;

    let vencimiento = fechaBase;
    if (regla.addYears) vencimiento = addYears(vencimiento, regla.addYears);
    if (regla.addMonths) vencimiento = addMonths(vencimiento, regla.addMonths);

    return vencimiento;
}

export function getEstadoVencimiento(archivo: Archivo | Certificado | ArchivosVencimiento): {
    estado: EstadoVencimiento;
    diasRestantes: number | null;
    fechaVencimiento: Date | null;
} {
    if (!tieneFecha(archivo)) {
        return { estado: "SIN_FECHA", diasRestantes: null, fechaVencimiento: null };
    }

    const fechaVencimiento = calcularFechaVencimiento(archivo);
    if (!fechaVencimiento) {
        return { estado: "SIN_FECHA", diasRestantes: null, fechaVencimiento: null };
    }

    const hoy = new Date();
    const diasRestantes = differenceInDays(fechaVencimiento, hoy);

    if (diasRestantes < 0) {
        return { estado: "VENCIDO", diasRestantes, fechaVencimiento };
    } else if (diasRestantes <= 15) {
        return { estado: "PROXIMO", diasRestantes, fechaVencimiento };
    } else {
        return { estado: "AL_DIA", diasRestantes, fechaVencimiento };
    }
}

export const getSafeDocuments = (truck: Equipo): DocumentoConFecha[] => {
    const all = [
        ...(truck.Certificado ?? []),
        ...(truck.ArchivosVencimiento ?? []),
        ...(truck.archivos ?? []),
    ];

    const withDate = all.filter(tieneFecha);
    const validDocs = withDate
        .filter((d): d is DocumentoConFecha => d !== null);
        
    return validDocs;
};

export const calcularEstadoVencimiento = (
    archivo: Partial<DocumentoConFecha> | null | undefined,
    fechaReferencia: Date = new Date()
): EstadoDocumento => {
    if (!archivo || !archivo.fecha) return EstadoDocumento.SIN_FECHA;
    console.log(archivo);
    
    const doc = archivo as DocumentoConFecha;

    const fechaVencimiento = calcularFechaVencimiento(doc);
    if (!fechaVencimiento || !isValid(fechaVencimiento)) {
        return EstadoDocumento.SIN_FECHA;
    }

    const diasRestantes = differenceInDays(fechaVencimiento, fechaReferencia);
    const LIMITE_POR_VENCER = 30;

    if (diasRestantes <= 0) return EstadoDocumento.VENCIDO;
    if (diasRestantes <= LIMITE_POR_VENCER) return EstadoDocumento.POR_VENCER;
    return EstadoDocumento.EN_TIEMPO;
};

export const calcularCumplimientoDocumentalDetallado = (
    equipos: Equipo[]
): ResultadoCumplimiento => {
    //console.group("🧾 Cálculo de Cumplimiento Documental");
    //console.log("Equipos recibidos:", equipos.length);
    const allDocs = equipos.flatMap((truck, i) => {
        const docs = getSafeDocuments(truck);
        //console.log(`🚛 [${i}] Equipo ID=${truck.id}, documentos válidos=${docs.length}`);
        return docs;
    });

    //console.log("📄 Total de documentos combinados:", allDocs.length);


    if (allDocs.length === 0) {
        //console.warn("⚠️ No hay documentos con fecha válida");
        //console.groupEnd();
        return {
            total: 0,
            sinFecha: 0,
            vencidos: 0,
            porVencer: 0,
            enTiempo: 0,
            porcentajeCumplimiento: 0,
        };
    }

    const resumen = {
        total: allDocs.length,
        sinFecha: 0,
        vencidos: 0,
        porVencer: 0,
        enTiempo: 0,
    };

    for (const [i, doc] of allDocs.entries()) {
        const estado = calcularEstadoVencimiento(doc);
        const fechaV = calcularFechaVencimiento(doc);

        //console.log(`📘 [${i}] "${doc.nombre}"`);
        //console.log("  Fecha original:", doc.fecha);
        //console.log("  Fecha vencimiento:", fechaV);
        //console.log("  Estado:", estado);

        switch (estado) {
            case EstadoDocumento.SIN_FECHA:
                resumen.sinFecha++;
                break;
            case EstadoDocumento.VENCIDO:
                resumen.vencidos++;
                break;
            case EstadoDocumento.POR_VENCER:
                resumen.porVencer++;
                break;
            case EstadoDocumento.EN_TIEMPO:
                resumen.enTiempo++;
                break;
        }
    }

    const totalConFecha = resumen.total - resumen.sinFecha;

    const porcentajeCumplimiento =
        totalConFecha > 0
            ? Math.round(((resumen.enTiempo + resumen.porVencer) / totalConFecha) * 100)
            : 0;

    //console.table(resumen);
    //console.log("✅ Porcentaje de cumplimiento:", porcentajeCumplimiento + "%");
    //console.groupEnd();

    return {
        ...resumen,
        porcentajeCumplimiento,
    };
};