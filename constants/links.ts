"use client"

import { useEmpresa } from "@/context/empresa-context"
import { useArea } from "@/context/area-context"

export const directLink = (ruta: string) => {
    const { empresa } = useEmpresa()
    const { area } = useArea()

    const fullLink = `${empresa?.nombre}/${area?.nombre}/${ruta}`
    return fullLink
}