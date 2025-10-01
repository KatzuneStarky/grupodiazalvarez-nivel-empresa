import { getMunicipiosEstados } from "@/utils/get-municipios-estados"
import { MunicipiosEstado } from "@/types/municipios-estado"
import { getEstadosApi } from "@/utils/get-estados-api"
import { EstadoPais } from "@/types/estado-pais"
import { useEffect, useState } from "react"

export const useRegionData = () => {
    const [selectedEstadoId, setSelectedEstadoId] = useState<string>("1")
    const [municipios, setMunicipios] = useState<MunicipiosEstado[]>([])
    const [estados, setEstados] = useState<EstadoPais[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const estadosData = await getEstadosApi()
            setEstados(estadosData)
        }

        fetchData()
    }, [])

    useEffect(() => {
        const fetchMunicipios = async () => {
            const data = await getMunicipiosEstados(selectedEstadoId)
            setMunicipios(data)
        }

        fetchMunicipios()
    }, [estados, selectedEstadoId])

    return {
        setSelectedEstadoId,
        municipios,
        estados
    }
}