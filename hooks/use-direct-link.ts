"use client"

import { useEmpresa } from "@/context/empresa-context"
import { useArea } from "@/context/area-context"
import { useEffect, useState } from "react"

export const useDirectLink = (ruta: string) => {
    const [directLink, setDirectLink] = useState<string>("")
    const { empresa } = useEmpresa()
    const { area } = useArea()

    useEffect(() => {
        const fullLink = `/${empresa?.nombre}/${area?.nombre}/${ruta}`
        setDirectLink(fullLink)
    }, [empresa, area, ruta])

    return { directLink }
}