import { Incidencia } from "@/modules/mantenimiento/incidencias/types/incidencias";

export interface OrdenMantenimiento {
    id: string;
    incidenciaId: string;
    equipoId: string;
    mecanicoId?: string;
    estado: 'Pendiente' | 'En Progreso' | 'Completada' | 'Cancelada';
    prioridad: 'Baja' | 'Media' | 'Alta' | 'Critica';
    descripcionProblema: string;
    fechaCreacion: Date;
    fechaInicio?: Date;
    fechaTerminacion?: Date;
    incidencia?: Incidencia;
    createAt: Date;
    updateAt: Date;
}
