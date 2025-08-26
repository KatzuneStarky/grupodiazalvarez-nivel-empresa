import { EstadoEquipos } from "../../bdd/equipos/enum/estado-equipos";

export const estadoColores: { [key in EstadoEquipos]: string } = {
    [EstadoEquipos.DISPONIBLE]: '#28a745',
    [EstadoEquipos.EN_TALLER]: '#ffc107',
    [EstadoEquipos.EN_VIAJE]: '#6f42c1',
    [EstadoEquipos.FUERA_DE_SERVICIO]: '#dc3545',
    [EstadoEquipos.DISPONIBLE_CON_DETALLES]: '#F06307'
};