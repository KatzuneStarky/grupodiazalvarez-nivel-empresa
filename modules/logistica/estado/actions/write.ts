import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/client";

export const updateEquipoEstado = async (id: string, estado: string) => {
    const equipoRef = doc(db, "equipos", id);
    await updateDoc(equipoRef, {
        estado,
        updateAt: new Date(),
    });
};