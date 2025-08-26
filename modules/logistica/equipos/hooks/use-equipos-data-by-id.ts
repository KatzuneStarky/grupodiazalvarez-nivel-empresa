import { getEquipoById, listenArchivosByEquipoId, listenArchivosVencimientoByEquipoId, listenCertificadosByEquipoId } from "../actions/read";
import { ArchivosVencimiento } from "../../bdd/equipos/types/archivos-vencimiento";
import { EquipoConMantenimientos } from "../../bdd/equipos/types/mantenimiento";
import { Certificado } from "../../bdd/equipos/types/certificados";
import { Archivo } from "../../bdd/equipos/types/archivos";
import { fetchData } from "@/functions/fetch-data";
import { useEffect, useState } from "react";

const useEquipoDataById = (equipoId: string) => {
    const [equipo, setEquipo] = useState<EquipoConMantenimientos | null>(null);
    const [archivosVencimiento, setArchivosVencimiento] = useState<ArchivosVencimiento[]>([]);
    const [certificados, setCertificados] = useState<Certificado[]>([]);
    const [archivos, setArchivos] = useState<Archivo[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            setError(null);

            try {
                const equipoData = await fetchData(getEquipoById, equipoId);
                if (equipoData) {
                    setEquipo(equipoData);
                }
            } catch (error) {
                setError('Error al obtener los datos del equipo.');
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();

        const unsubscribeArchivos = listenArchivosByEquipoId(equipoId, setArchivos);
        const unsubscribeCertificados = listenCertificadosByEquipoId(equipoId, setCertificados);
        const unsubscribeArchivosVencimiento = listenArchivosVencimientoByEquipoId(equipoId, setArchivosVencimiento);

        return () => {
            unsubscribeArchivos();
            unsubscribeCertificados();
            unsubscribeArchivosVencimiento();
        };
    }, [equipoId]);

    return {
        equipo,
        archivosVencimiento,
        certificados,
        archivos,
        loading,
        error,
    };
};

export default useEquipoDataById;