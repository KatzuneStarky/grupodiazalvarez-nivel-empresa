export enum EstadoEmpresa {
    Activa = "activa",
    Cerrada = "cerrada",
    Suspendida = "suspendida"
}

export type EstadoEmpresaType = keyof typeof EstadoEmpresa;

export const EstadoEmpresaArray = Object.values(EstadoEmpresa);