import { EmpresaProvider } from '@/context/empresa-context';
import React from 'react'

type Params = {
  nombre: string | Promise<string>;
};

const EmpresaLayout = async({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Params;
}) => {
    const nombre = await params.nombre;
    const decodedName = decodeURIComponent(nombre || "");

    return (
        <EmpresaProvider empresaName={decodedName}>
            {children}
        </EmpresaProvider>
    );
};

export default EmpresaLayout;