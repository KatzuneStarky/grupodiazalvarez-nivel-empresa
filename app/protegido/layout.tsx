"use client"

import { AuthProvider } from "@/context/auth-context"

const ProtegidoLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    )
}

export default ProtegidoLayout