import { EmpresaProvider } from '@/context/empresa-context';
import React from 'react'

const EmpresaLayout = async({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { nombre: string };
}) => {
    const decodedName = decodeURIComponent(params.nombre || "");

    return (
        <EmpresaProvider empresaName={decodedName}>
            {children}
        </EmpresaProvider>
    );
};

export default EmpresaLayout;