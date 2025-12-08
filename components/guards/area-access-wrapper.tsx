"use client"

import { AreaAccessGuard } from "./area-access-guard"
import { EmpresaAccessGuard } from "./empresa-access-guard"

interface AreaAccessWrapperProps {
    children: React.ReactNode
    empresaName: string
}

export const AreaAccessWrapper = ({ children, empresaName }: AreaAccessWrapperProps) => {
    return (
        <AreaAccessGuard empresaName={empresaName}>
            {children}
        </AreaAccessGuard>
    )
}

interface EmpresaAccessWrapperProps {
    children: React.ReactNode
}

export const EmpresaAccessWrapper = ({ children }: EmpresaAccessWrapperProps) => {
    return (
        <EmpresaAccessGuard>
            {children}
        </EmpresaAccessGuard>
    )
}
