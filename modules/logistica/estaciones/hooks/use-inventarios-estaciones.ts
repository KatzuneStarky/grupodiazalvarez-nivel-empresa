import { InventarioEstaciones } from "../types/inventarios";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/firebase/client";

export function useInventarioEstaciones() {
  const [data, setData] = useState<InventarioEstaciones[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const inventarioRef = collection(db, "inventarioEstaciones");

    const unsubscribe = onSnapshot(
      inventarioRef,
      (snapshot) => {
        const fetchedData: InventarioEstaciones[] = snapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            estacion: d.estacion,
            inventarioMagna: d.inventarioMagna ?? 0,
            pVentasDiarias: d.pVentasDiarias ?? 0,
            dInventariados1: d.dInventariados1,
            inventarioPremium: d.inventarioPremium ?? 0,
            pVentasDiarias2: d.pVentasDiarias2 ?? 0,
            dInventariados2: d.dInventariados2,
            inventarioDiesel: d.inventarioDiesel ?? 0,
            pVentasDiarias3: d.pVentasDiarias3 ?? 0,
            dInventariados3: d.dInventariados3,
          };
        });
        setData(fetchedData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching InventarioEstaciones:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { data, loading, error };
}