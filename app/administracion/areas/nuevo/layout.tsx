"use client"

import { Suspense } from "react"

const NuevaAreaLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <Suspense>
            <div>
                {children}
            </div>
        </Suspense>
    )
}

export default NuevaAreaLayout