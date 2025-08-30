import { EstadoPais } from "@/types/estado-pais"

export const getEstadosApi = async (): Promise<EstadoPais[]> => {
    try {
        const response = await fetch("https://sepomex.icalialabs.com/api/v1/states?per_page=32")
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`)
        }

        const data = await response.json()
        return data.states as EstadoPais[]
    } catch (error) {
        console.error("Error al obtener estados:", error)
        return []
    }
}