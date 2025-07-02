export interface ContactInfo {
    id: string
    nombre: string
    cargo: string
    email: string
    telefono: string
    principal: boolean
    empresaId?: string
}

export type ContactInfoInput = Omit<ContactInfo, "id" | "empresaId">;