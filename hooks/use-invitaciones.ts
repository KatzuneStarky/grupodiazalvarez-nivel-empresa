import { collection, onSnapshot } from "firebase/firestore"
import { Invitacion } from "@/types/invitacion"
import { useEffect, useState } from "react"
import { db } from "@/firebase/client"

export const useInvitaciones = () => {
    const [invitaciones, setInvitaciones] = useState<Invitacion[]>()
    const [error, setError] = useState<Error | undefined>()
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        const invitacionesRef = collection(db, "invitaciones");

        const unsubscribe = onSnapshot(invitacionesRef, (querySnapshot) => {
            const invitacionData: Invitacion[] = [];
            querySnapshot.forEach((doc) => {
                invitacionData.push({ id: doc.id, ...doc.data() } as Invitacion);
            });
            setInvitaciones(invitacionData);
            setLoading(false);
        }, (error) => {
            console.error("Error obteniendo a las invitaciones:", error);
            setError(error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { invitaciones, error, loading }
}