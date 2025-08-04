export interface Operador {
    id: string;
    image?: string;
    apellidos: string;
    nombres: string;
    telefono: string;
    email: string;
    nss: string;
    curp: string;
    ine: string;
    colonia: string;
    calle: string;
    externo: number;
    cp: number;
    tipoSangre: string;
    numLicencia: string;
    tipoLicencia: string;
    emisor: string;
    createdAt: Date;
    updatedAt: Date;
}