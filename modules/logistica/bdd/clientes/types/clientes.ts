export interface ContactosCliente {
    nombre: string
    email: string
    telefono: string
}

export interface Clientes {
    id: string
    nombreFiscal: string
    nombreCorto?: string
    rfc: string
    curp: string
    tipoCliente: "nacional"
    grupo?: string
    activo: boolean

    domicilio: {
        pais: string
        cp: string
        estado: string
        municipio: string
        colonia?: string
        localidad: string
        calle: string
        exterior?: string
        interior?: string
        telefono?: string
        celular?: string
    }
    correo?: string

    contactos: ContactosCliente[]

    createdAt: Date
    updatedAt: Date
}