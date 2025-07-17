"use client"

import { Suspense } from "react"

const AccionesUsuarioLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <Suspense>
            {children}
        </Suspense>
    )
}

export default AccionesUsuarioLayout