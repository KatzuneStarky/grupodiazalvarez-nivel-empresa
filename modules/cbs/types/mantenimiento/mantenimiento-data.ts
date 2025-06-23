import { Mantenimiento } from "./mantenimiento";

export interface MantenimientoData {
    id: string;
    descripcion: string;
    cantidad: string;
    Mantenimiento?: Mantenimiento;
    mantenimientoId?: string;
    createAt: Date;
    updateAt: Date;
}