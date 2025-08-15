"use client"

import { useOperadores } from "@/modules/logistica/bdd/operadores/hooks/use-estaciones"

const OperadoresPage = () => {
    const { operadores, isLoading, error } = useOperadores()

    return (
        <div>OperadoresPage</div>
    )
}

export default OperadoresPage