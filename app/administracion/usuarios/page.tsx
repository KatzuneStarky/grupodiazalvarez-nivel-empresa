"use client"

import { useUsuarios } from "@/modules/usuarios/hooks/use-usuarios"

const UsuariosPage = () => {
    const { usuarios, loading, error } = useUsuarios()

    return (
        <div>
            {JSON.stringify(usuarios)}
        </div>
    )
}

export default UsuariosPage