export enum TipoEmpresa {
    Matriz = "matriz",
    Sucursal = "sucursal"
};

export type TipoEmpresaType = keyof typeof TipoEmpresa;

export const TipoEmpresaArray = Object.values(TipoEmpresa);