"use client"

import { TimeProvider } from "@/context/time-context"

const UserLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <TimeProvider>
            {children}
        </TimeProvider>
    )
}

export default UserLayout