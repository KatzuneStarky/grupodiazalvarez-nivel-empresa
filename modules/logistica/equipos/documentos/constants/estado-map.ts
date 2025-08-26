import { calcularEstadoVencimiento, esArchivoVencimiento, esCertificado } from "@/functions/tipo-archivo-equipo";
import { VencimientoEstado } from "../enum/estado-documento";
import { FileVariant } from "../components/document-card";

export const estadoMap: Record<VencimientoEstado, { icon: string; bg: string; texto: string }> = {
    [VencimientoEstado.VENCIDO]: { icon: 'text-red-600', bg: 'bg-red-600', texto: 'Vencido' },
    [VencimientoEstado.POR_VENCER]: { icon: 'text-yellow-600', bg: 'bg-yellow-600', texto: 'Por Vencer' },
    [VencimientoEstado.EN_TIEMPO]: { icon: 'text-green-600', bg: 'bg-green-600', texto: 'En Tiempo' }
};

export const getEstadoArchivo = (file: FileVariant) => {
    let estado: VencimientoEstado = VencimientoEstado.EN_TIEMPO;
    let iconName = "icon-park-outline:certificate";

    if (esCertificado(file) || esArchivoVencimiento(file)) {
        estado = calcularEstadoVencimiento(file);

        if (esCertificado(file)) {
            iconName = estado === VencimientoEstado.VENCIDO
                ? "tabler:certificate-off"
                : "icon-park-outline:certificate";
        } else if (esArchivoVencimiento(file)) {
            iconName = estado === VencimientoEstado.VENCIDO
                ? "lucide:calendar-x-2"
                : "mdi:calendar-warning";
        }
    }

    return { estado, iconName };
};