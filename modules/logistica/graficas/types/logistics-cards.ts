export interface ClientesCardProps {
    mes: string;
    setMes: (value: string) => void;
    clientes: string[];
    selectedClientes: string[];
    handleClienteChange: (clientes: string[]) => void;
    capitalizedMonthName: string;
    children?: React.ReactNode
}

export interface ProductosCardProps {
    mes: string;
    setMes: (value: string) => void;
    productos: string[];
    selectedProductos: string[];
    handleProductosChange: (cliente: string) => void;
    capitalizedMonthName: string;
    monthSelect?: boolean
    children?: React.ReactNode
}

export interface DescripcionesCardProps {
    mes: string;
    setMes: (value: string) => void;
    descripciones: string[];
    selectedDescripciones: string[];
    handleDescripcionesChange: (cliente: string) => void;
    capitalizedMonthName: string;
    monthSelect?: boolean
    children?: React.ReactNode
}

export interface EquiposCardProps {
    mes: string;
    setMes: (value: string) => void;
    equipos: string[];
    selectedEquipos: string[];
    handleEquiposChange: (cliente: string) => void;
    capitalizedMonthName: string;
    monthSelect?: boolean
    children?: React.ReactNode
}

export interface MunicipiosCardProps {
    mes: string;
    setMes: (value: string) => void;
    municipios: string[];
    selectedMunicipios: string[];
    handleMunicipiosChange: (cliente: string) => void;
    capitalizedMonthName: string;
    monthSelect?: boolean
    children?: React.ReactNode
}