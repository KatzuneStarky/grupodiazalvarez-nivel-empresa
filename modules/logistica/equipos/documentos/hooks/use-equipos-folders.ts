import { collection, getDocs, onSnapshot, Timestamp } from "firebase/firestore";
import { FileType } from "@/types/file-types";
import { useEffect, useState } from "react";
import { Folder } from "../types/folder";
import { db } from "@/firebase/client";

const toDate = (value: any, fallback: Date = new Date()): Date => {
  if (!value) return fallback;
  if (value instanceof Timestamp) return value.toDate();
  if (value.toDate instanceof Function) return value.toDate();
  return new Date(value);
};

export const useEquiposWithFolder = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const fetchEquipos = async () => {
      try {
        const equiposRef = collection(db, "equipos");

        unsubscribe = onSnapshot(
          equiposRef,
          async (querySnapshot) => {
            setIsLoading(true);

            const foldersData: Folder[] = await Promise.all(
              querySnapshot.docs.map(async (doc) => {
                const equipoId = doc.id;
                const createdAt = toDate(doc.data().createdAt, new Date());
                const folder: Folder = {
                  id: equipoId,
                  name: doc.data().numEconomico ?? "Sin número económico",
                  path: `/equipos/${equipoId}`,
                  archivos: [],
                  archivosVencimiento: [],
                  certificado: [],
                  equipoId,
                  createdAt,
                  updatedAt: createdAt,
                };

                try {
                  // Obtener subcolecciones en paralelo
                  const [archivosSnap, vencimientoSnap, certificadoSnap] = await Promise.all([
                    getDocs(collection(db, `equipos/${equipoId}/archivos`)),
                    getDocs(collection(db, `equipos/${equipoId}/archivosVencimiento`)),
                    getDocs(collection(db, `equipos/${equipoId}/certificados`)),
                  ]);

                  folder.archivos = archivosSnap.docs.map((d) => ({
                    id: d.id,
                    nombre: d.data().nombre ?? "",
                    ruta: d.data().ruta ?? "",
                    tipo: (d.data().tipo as FileType) ?? "unknown",
                    extension: d.data().extension ?? "",
                    peso: d.data().peso ?? 0,
                    equipoId: d.data().equipoId ?? equipoId,
                    createAt: toDate(d.data().createdAt, createdAt),
                    updateAt: toDate(d.data().updatedAt, createdAt),
                  }));

                  folder.archivosVencimiento = vencimientoSnap.docs.map((d) => ({
                    id: d.id,
                    nombre: d.data().nombre ?? "",
                    ruta: d.data().ruta ?? "",
                    fecha: toDate(d.data().fecha, createdAt),
                    tipo: (d.data().tipo as FileType) ?? "unknown",
                    extension: d.data().extension ?? "",
                    peso: d.data().peso ?? 0,
                    equipoId: d.data().equipoId ?? equipoId,
                    createAt: toDate(d.data().createdAt, createdAt),
                  }));

                  folder.certificado = certificadoSnap.docs.map((d) => ({
                    id: d.id,
                    nombre: d.data().nombre ?? "",
                    ruta: d.data().ruta ?? "",
                    fecha: toDate(d.data().fecha, createdAt),
                    tipo: (d.data().tipo as FileType) ?? "unknown",
                    extension: d.data().extension ?? "",
                    peso: d.data().peso ?? 0,
                    equipoId: d.data().equipoId ?? equipoId,
                    createAt: toDate(d.data().createdAt, createdAt),
                  }));
                } catch (e) {
                  console.error("Error fetching subcollections:", e);
                }

                // Calcular updatedAt según el archivo más reciente
                const allFiles = [...folder.archivos, ...folder.archivosVencimiento, ...folder.certificado];
                if (allFiles.length) {
                  folder.updatedAt = allFiles.reduce(
                    (latest, f) => (f.createAt > latest ? f.createAt : latest),
                    folder.createdAt
                  );
                }

                return folder;
              })
            );

            setFolders(foldersData);
            setIsLoading(false);
          },
          (error) => {
            console.error("Error obteniendo los equipos:", error);
            setError(error);
            setIsLoading(false);
          }
        );
      } catch (error) {
        console.error("Error en la consulta de equipos:", error);
        setError(error as Error);
        setIsLoading(false);
      }
    };

    fetchEquipos();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return { folders, isLoading, error };
};