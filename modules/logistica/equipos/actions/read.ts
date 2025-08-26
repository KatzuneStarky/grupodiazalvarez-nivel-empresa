import { EquipoConMantenimientos, Evidencia, Mantenimiento, MantenimientoConDetalles, MantenimientoData } from "../../bdd/equipos/types/mantenimiento";
import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { ArchivosVencimiento } from "../../bdd/equipos/types/archivos-vencimiento";
import { Certificado } from "../../bdd/equipos/types/certificados";
import { Archivo } from "../../bdd/equipos/types/archivos";
import { Equipo } from "../../bdd/equipos/types/equipos";
import { Tanque } from "../../bdd/equipos/types/tanque";
import { db } from "@/firebase/client";

export const getEquipoById = async (id: string): Promise<EquipoConMantenimientos | null> => {
    try {
        const equipoRef = doc(db, "equipos", id);
        const equipoSnap = await getDoc(equipoRef);

        const equipo = { id: equipoSnap.id, ...equipoSnap.data() } as Equipo;

        const mantenimientosSnapshot = await getDocs(collection(db, `mantenimientos`));
        const mantenimientosConDetalles: MantenimientoConDetalles[] = await Promise.all(
            mantenimientosSnapshot.docs.map(async (mantenimientoDoc) => {
                const mantenimiento = mantenimientoDoc.data() as Mantenimiento;
                const mantenimientoId = mantenimientoDoc.id;

                const mantenimientoDataSnapshot = await getDocs(collection(db, `mantenimientos/${mantenimientoId}/mantenimientoData`));
                const mantenimientoData = mantenimientoDataSnapshot.docs.map((doc) => doc.data() as MantenimientoData);

                const evidenciasSnapshot = await getDocs(collection(db, `mantenimientos/${mantenimientoId}/evidencia`));
                const evidencias = evidenciasSnapshot.docs.map((doc) => doc.data() as Evidencia);

                return {
                    ...mantenimiento,
                    id: mantenimientoId,
                    mantenimientoData,
                    evidencias,
                };
            })
        );

        const tanqueRef = collection(db, "equipos", equipo.id, "tanques")
        const tanquesSnapshot = await getDocs(tanqueRef);
        const tanques: Tanque[] = tanquesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Tanque));

        return { ...equipo, mantenimientos: mantenimientosConDetalles, tanques };
    } catch (error) {
        console.error(`Error obteniendo el equipo con ID ${id}:`, error);
        throw new Error(`Error obteniendo el equipo con ID ${id}`);
    }
};

export function listenArchivosByEquipoId(equipoId: string, callback: (archivos: Archivo[]) => void) {
    const archivosRef = collection(db, `equipos/${equipoId}/archivos`);

    const unsubscribe = onSnapshot(archivosRef, (archivosSnapshot) => {
        const archivosData: Archivo[] = archivosSnapshot.docs.map(doc => ({ ...doc.data(), equipoId } as Archivo));
        callback(archivosData);
    });

    return unsubscribe;
}

export function listenCertificadosByEquipoId(equipoId: string, callback: (certificados: Certificado[]) => void) {
    const certificadosRef = collection(db, `equipos/${equipoId}/certificados`);

    const unsubscribe = onSnapshot(certificadosRef, (certificadosSnapshot) => {
        const certificadosData: Certificado[] = certificadosSnapshot.docs.map(doc => ({ ...doc.data(), equipoId } as Certificado));
        callback(certificadosData);
    });

    return unsubscribe;
}

export function listenArchivosVencimientoByEquipoId(equipoId: string, callback: (archivosVencimiento: ArchivosVencimiento[]) => void) {
    const archivosVencimientoRef = collection(db, `equipos/${equipoId}/archivosVencimiento`);

    const unsubscribe = onSnapshot(archivosVencimientoRef, (archivosVencimientoSnapshot) => {
        const archivosVencimientoData: ArchivosVencimiento[] = archivosVencimientoSnapshot.docs.map(doc => ({ ...doc.data(), equipoId } as ArchivosVencimiento));
        callback(archivosVencimientoData);
    });

    return unsubscribe;
}

export function getUltimoMantenimiento({ equipoId }: { equipoId: string }, mantenimientos?: Mantenimiento[] | null): Mantenimiento | null {
    if (!mantenimientos || mantenimientos.length === 0) return null;

    const mantenimientosOrdenados 
        = [...mantenimientos].sort((a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime());
    const mantenimientoEquipo = mantenimientosOrdenados.find((m) => m.equipoId === equipoId)
    return mantenimientoEquipo || null;
}