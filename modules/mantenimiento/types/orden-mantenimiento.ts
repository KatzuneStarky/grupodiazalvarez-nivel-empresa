import { Incidencia } from "@/modules/mantenimiento/incidencias/types/incidencias";

export interface OrdenMantenimiento {
    id: string;
    incidenciaId: string;
    equipoId: string;
    mecanicoId?: string;

    // Status can track the lifecycle separate from incidence and maintenance
    estado: 'Pendiente' | 'En Progreso' | 'Completada' | 'Cancelada';

    prioridad: 'Baja' | 'Media' | 'Alta' | 'Critica';

    // Snapshot or reference data
    descripcionProblema: string;
    fechaCreacion: Date;
    fechaInicio?: Date;
    fechaTerminacion?: Date;

    // Relations
    incidencia?: Incidencia;

    createAt: Date;
    updateAt: Date;
}
