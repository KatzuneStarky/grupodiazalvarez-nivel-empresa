import { getEquipoById, listenArchivosByEquipoId, listenArchivosVencimientoByEquipoId, listenCertificadosByEquipoId } from "../actions/read";
import { ArchivosVencimiento } from "../../bdd/equipos/types/archivos-vencimiento";
import { EquipoConMantenimientos } from "../../bdd/equipos/types/mantenimiento";
import { Certificado } from "../../bdd/equipos/types/certificados";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Archivo } from "../../bdd/equipos/types/archivos";
import { fetchData } from "@/functions/fetch-data";

interface UseEquipoDataReturn {
    data: {
        equipo: EquipoConMantenimientos | null
        archivos: Archivo[]
        certificados: Certificado[]
        archivosVencimiento: ArchivosVencimiento[]
    }
    loading: boolean
    error: Error | null
}

const useEquipoDataById = (equipoId: string): UseEquipoDataReturn => {
    const [archivosVencimiento, setArchivosVencimiento] = useState<ArchivosVencimiento[]>([])
    const [equipo, setEquipo] = useState<EquipoConMantenimientos | null>(null)
    const [certificados, setCertificados] = useState<Certificado[]>([])
    const [archivos, setArchivos] = useState<Archivo[]>([])
    const [error, setError] = useState<Error | null>(null)
    const [loading, setLoading] = useState(true)

    const handleSetArchivos = useCallback((data: Archivo[]) => setArchivos(data), [])
    const handleSetCertificados = useCallback((data: Certificado[]) => setCertificados(data), [])
    const handleSetArchivosVencimiento = useCallback((data: ArchivosVencimiento[]) => setArchivosVencimiento(data), [])

    useEffect(() => {
        if (!equipoId) return

        let isMounted = true
        setLoading(true)
        setError(null)

        const fetchAllData = async () => {
            try {
                const result = await fetchData(getEquipoById, equipoId)
                if (isMounted && result) setEquipo(result)
            } catch (err) {
                if (isMounted) {
                    const errorObj = err instanceof Error ? err : new Error("Error desconocido al obtener el equipo")
                    console.error("❌ Error fetching equipo data:", errorObj)
                    setError(errorObj)
                }
            } finally {
                if (isMounted) setLoading(false)
            }
        }

        fetchAllData()

        const unsubArchivos = listenArchivosByEquipoId(equipoId, handleSetArchivos)
        const unsubCertificados = listenCertificadosByEquipoId(equipoId, handleSetCertificados)
        const unsubArchivosVenc = listenArchivosVencimientoByEquipoId(equipoId, handleSetArchivosVencimiento)

        return () => {
            isMounted = false
            unsubArchivos?.()
            unsubCertificados?.()
            unsubArchivosVenc?.()
        }
    }, [equipoId, handleSetArchivos, handleSetCertificados, handleSetArchivosVencimiento])

    const data = useMemo(
        () => ({
            equipo,
            archivos,
            certificados,
            archivosVencimiento,
        }),
        [equipo, archivos, certificados, archivosVencimiento]
    )

    return { data, loading, error }
};

export default useEquipoDataById;