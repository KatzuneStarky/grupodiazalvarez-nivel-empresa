"use client"

import { Suspense } from "react"

const NuevoContactoLayout = ({
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

export default NuevoContactoLayout