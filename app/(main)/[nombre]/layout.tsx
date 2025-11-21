import { EmpresaProvider } from '@/context/empresa-context';
import React from 'react'

export async function generateMetadata({ params }: { params: Promise<{ nombre: string }> }) {
    const { nombre } = await params;
    return {
        title: decodeURIComponent(nombre),
    }
}

const EmpresaLayout = async ({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ nombre: string }>;
}) => {
    const { nombre } = await params;
    const decodedName = nombre ? decodeURIComponent(nombre) : '';

    return (
        <EmpresaProvider empresaName={decodedName}>
            {children}
        </EmpresaProvider>
    );
};

export default EmpresaLayout;