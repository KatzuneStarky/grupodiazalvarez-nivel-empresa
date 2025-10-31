"use client"

import { Suspense } from "react"

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Suspense>
            <div>
                {children}
            </div>
        </Suspense>
    )
}

export default AuthLayout