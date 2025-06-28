export const TipoEmpresa = {
    Matriz: "matriz",
    Sucursal: "sucursal"
} as const;

export type TipoEmpresaType = keyof typeof TipoEmpresa;

export const TipoEmpresaArray = Object.values(TipoEmpresa);