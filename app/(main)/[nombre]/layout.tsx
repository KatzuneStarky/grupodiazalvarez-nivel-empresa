"use client"

import { EmpresaProvider } from '@/context/empresa-context';
import React, { use } from 'react'

const EmpresaLayout = ({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ nombre: string }>;
}) => {
    const { nombre } = use(params);
    const decodedName = nombre ? decodeURIComponent(nombre) : '';

    return (
        <EmpresaProvider empresaName={decodedName}>
            {children}
        </EmpresaProvider>
    );
};

export default EmpresaLayout;