import { ArchivosVencimiento } from "@/modules/logistica/bdd/equipos/types/archivos-vencimiento";
import { Timestamp } from "firebase/firestore";

export const convertirFecha = (fecha: Timestamp | Date): Date => {
    const date = fecha instanceof Timestamp ? fecha.toDate() : fecha;
    date.setFullYear(date.getFullYear() + 3);
    return date;
};

export const convertirFechaVencimiento = (archivo: ArchivosVencimiento): Date => {
    const date = archivo.fecha instanceof Timestamp ? archivo.fecha.toDate() : archivo.fecha;

    if (archivo.nombre.includes('POLIZA DE SEGURO') || archivo.nombre.includes('VERIFICACION FISICO')) {
        date.setFullYear(date.getFullYear() + 1);
    } else if (archivo.nombre.includes('VERIFICACION HUMO')) {
        date.setMonth(date.getMonth() + 6);
    }

    return date;
};