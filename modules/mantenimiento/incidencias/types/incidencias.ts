import { Evidencia } from "@/modules/logistica/bdd/equipos/types/mantenimiento";
import {
    FileText,
    ArrowDown,
    Minus,
    ArrowUp,
    TriangleAlert,
    Inbox,
    Eye,
    Settings,
    CheckCircle,
    XCircle,
    Tag,
} from 'lucide-react';

export interface Incidencia {
    id: string
    operadorId: string
    equipoId: string
    fecha: Date
    tipo:
    | 'Mecanica'
    | 'Electrica'
    | 'Frenos'
    | 'Motor'
    | 'Neumaticos'
    | 'Transmision'
    | 'Fuga'
    | 'Tanque'
    | 'GPS'
    | 'Documentacion'
    | 'Accidente'
    | 'Otro';
    severidad: 'Baja' | 'Media' | 'Alta' | 'Critica';
    descripcion: string;
    ubicacion?: {
        latitud: number;
        longitud: number;
        direccionAproximada?: string;
    };
    estado:
    | 'Reportada'
    | 'En Revisión'
    | 'En Proceso'
    | 'Resuelta'
    | 'Cancelada';
    kmActual?: number;
    nivelCombustible?: number;
    velocidadAprox?: number;
    operable: boolean;
    categoria?:
    | 'Seguridad'
    | 'Mantenimiento'
    | 'Operativa'
    | 'Medio Ambiente'
    | 'Documentos'
    | 'Combustible';

    mantenimientoId?: string;
    evidencias?: Evidencia[];
    creadtedAt: Date
    updatedAt: Date
}

const incidenciaTipo = [
    'Mecanica',
    'Electrica',
    'Frenos',
    'Motor',
    'Neumaticos',
    'Transmision',
    'Fuga',
    'Tanque',
    'GPS',
    'Documentacion',
    'Accidente',
    'Otro'
]

const incidenciaSeveridad = [
    'Baja',
    'Media',
    'Alta',
    'Critica'
]

const incidenciaEstado = [
    'Reportada',
    'En Revisión',
    'En Proceso',
    'Resuelta',
    'Cancelada'
]

const incidenciaCategoria = [
    'Seguridad',
    'Mantenimiento',
    'Operativa',
    'Medio Ambiente',
    'Documentos',
    'Combustible'
]

export const incidenciaTipoMap = incidenciaTipo.map((tipo) => {
    let color = 'gray';
    let icon: React.ElementType = Tag;
    switch (tipo) {
        case 'Mecanica':
            color = 'sky-400'; // Lighter blue for dark themes
            break;
        case 'Electrica':
            color = 'amber-300'; // Lighter yellow/amber
            break;
        case 'Frenos':
            color = 'orange-400'; // Lighter orange
            break;
        case 'Motor':
            color = 'rose-500'; // Softer red
            break;
        case 'Neumaticos':
            color = 'emerald-400'; // Lighter green
            break;
        case 'Transmision':
            color = 'violet-400'; // Lighter purple
            break;
        case 'Fuga':
            color = 'orange-600'; // A distinct, slightly darker orange/brown
            break;
        case 'Tanque':
            color = 'cyan-400'; // Lighter teal/cyan
            break;
        case 'GPS':
            color = 'indigo-400'; // Lighter indigo
            break;
        case 'Documentacion':
            color = 'slate-400'; // Lighter gray for visibility
            break;
        case 'Accidente':
            color = 'red-600'; // A strong, visible red for accidents
            break;
        case 'Otro':
            color = 'fuchsia-400'; // Lighter pink/fuchsia
            break;
    }
    return {
        value: tipo,
        label: tipo,
        icon,
        color,
    };
});

export const incidenciaCategoriaMap = incidenciaCategoria.map((categoria) => {
    let color = 'gray-500'; // Dark-theme compatible gray
    let icon: React.ElementType = FileText;
    switch (categoria) {
        case 'Seguridad':
            color = 'red-500'; // Tailwind red
            icon = TriangleAlert;
            break;
        case 'Mantenimiento':
            color = 'blue-500'; // Tailwind blue
            icon = Settings;
            break;
        case 'Operativa':
            color = 'emerald-500'; // Tailwind emerald (greenish)
            icon = CheckCircle;
            break;
        case 'Medio Ambiente':
            color = 'teal-500'; // Tailwind teal
            break;
        case 'Documentos':
            color = 'indigo-500'; // Tailwind indigo
            break;
        case 'Combustible':
            color = 'amber-500'; // Tailwind amber (orange-yellow)
            break;
    }
    return {
        value: categoria,
        label: categoria,
        icon,
        color,
    };
});

export const incidenciaSeveridadMap = incidenciaSeveridad.map((severidad) => {
    let color = 'gray';
    let icon: React.ElementType = FileText;
    switch (severidad) {
        case 'Baja':
            color = 'green-400';
            icon = ArrowDown;
            break;
        case 'Media':
            color = 'yellow-400';
            icon = Minus;
            break;
        case 'Alta':
            color = 'orange-400';
            icon = ArrowUp;
            break;
        case 'Critica':
            color = 'red-500';
            icon = TriangleAlert;
            break;
    }
    return {
        value: severidad,
        label: severidad,
        icon,
        color,
    };
});

export const incidenciaEstadoMap = incidenciaEstado.map((estado) => {
    let color = 'gray';
    let icon: React.ElementType = FileText;
    switch (estado) {
        case 'Reportada':
            color = 'gray';
            icon = Inbox;
            break;
        case 'En Revisión':
            color = 'blue';
            icon = Eye;
            break;
        case 'En Proceso':
            color = 'yellow';
            icon = Settings;
            break;
        case 'Resuelta':
            color = 'green';
            icon = CheckCircle;
            break;
        case 'Cancelada':
            color = 'red';
            icon = XCircle;
            break;
    }
    return {
        value: estado,
        label: estado,
        icon,
        color,
    };
});