"use client"

import { Suspense } from "react"

const EquipoProtegidoLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Suspense>
            <div>
                {children}
            </div>
        </Suspense>
    )
}

export default EquipoProtegidoLayout