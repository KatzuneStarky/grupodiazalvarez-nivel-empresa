import { IconExclamationCircle, IconTool } from "@tabler/icons-react"
import { Ban, CheckCircle, Truck } from "lucide-react";
import { EstadoEquipos } from "../../bdd/equipos/enum/estado-equipos";

export const getStatusConfig = (status: EstadoEquipos) => {
    const configs = {
        DISPONIBLE: {
            bgColor: "bg-green-100",
            textColor: "text-green-800",
            icon: CheckCircle,
            label: "DISPONIBLE"
        },
        DISPONIBLE_CON_DETALLES: {
            bgColor: "bg-yellow-100",
            textColor: "text-yellow-800",
            icon: IconExclamationCircle,
            label: "DISPONIBLE CON DETALLES"
        },
        EN_TALLER: {
            bgColor: "bg-orange-100",
            textColor: "text-orange-800",
            icon: IconTool,
            label: "EN TALLER"
        },
        EN_VIAJE: {
            bgColor: "bg-blue-100",
            textColor: "text-blue-800",
            icon: Truck,
            label: "EN VIAJE"
        },
        FUERA_DE_SERVICIO: {
            bgColor: "bg-red-100",
            textColor: "text-red-800",
            icon: Ban,
            label: "FUERA DE SERVICIO"
        }
    };
    return configs[status] || configs.DISPONIBLE;
};

export const getStateDetails = (state: EstadoEquipos) => {
    const stateConfig = {
        DISPONIBLE: {
            bgColor: "bg-green-500",
            icon: CheckCircle,
            textColor: "text-green-100"
        },
        EN_TALLER: {
            bgColor: "bg-yellow-500",
            icon: IconTool,
            textColor: "text-yellow-100"
        },
        EN_VIAJE: {
            bgColor: "bg-blue-500",
            icon: Truck,
            textColor: "text-blue-100"
        },
        FUERA_DE_SERVICIO: {
            bgColor: "bg-red-500",
            icon: Ban,
            textColor: "text-red-100"
        },
        DISPONIBLE_CON_DETALLES: {
            bgColor: "bg-orange-500",
            icon: IconExclamationCircle,
            textColor: "text-orange-100"
        }
    };

    return stateConfig[state] || {
        bgColor: "bg-gray-500",
        icon: CheckCircle,
        textColor: "text-gray-100"
    };
};