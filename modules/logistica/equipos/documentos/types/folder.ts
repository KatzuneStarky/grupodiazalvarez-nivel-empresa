import { ArchivosVencimiento } from "@/modules/logistica/bdd/equipos/types/archivos-vencimiento";
import { Certificado } from "@/modules/logistica/bdd/equipos/types/certificados";
import { Archivo } from "@/modules/logistica/bdd/equipos/types/archivos";

export type Folder = {
    id: string;
    name: string;
    path: string;
    archivos: Archivo[];
    archivosVencimiento: ArchivosVencimiento[]
    certificado: Certificado[]
    equipoId: string
    createdAt: Date
    updatedAt: Date
}