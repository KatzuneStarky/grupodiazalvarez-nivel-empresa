import { MunicipiosEstado } from "@/types/municipios-estado";

export const getMunicipiosEstados = async(estadoId: string): Promise<MunicipiosEstado[]> => {
    try {
        const response = await fetch(`https://sepomex.icalialabs.com/api/v1/states/${estadoId}/municipalities`)
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`)
        }

        const data = await response.json()
        return data.municipalities as MunicipiosEstado[]
    } catch (error) {
        console.error("Error al obtener estados:", error)
        return []
    }
}