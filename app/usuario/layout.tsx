"use client"

import { TimeProvider } from "@/context/time-context"
import { Suspense } from "react"

const UserLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <Suspense>
            <TimeProvider>
                {children}
            </TimeProvider>
        </Suspense>
    )
}

export default UserLayout