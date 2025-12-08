import { Evidencia } from "@/modules/logistica/bdd/equipos/types/mantenimiento";

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


export const incidenciaTipoMap = incidenciaTipo.map((tipo) => ({
    value: tipo,
    label: tipo,
}))

export const incidenciaSeveridadMap = incidenciaSeveridad.map((severidad) => ({
    value: severidad,
    label: severidad,
}))

export const incidenciaEstadoMap = incidenciaEstado.map((estado) => ({
    value: estado,
    label: estado,
}))

export const incidenciaCategoriaMap = incidenciaCategoria.map((categoria) => ({
    value: categoria,
    label: categoria,
}))
