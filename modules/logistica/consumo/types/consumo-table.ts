export interface ConsumoTable {
    destino: string
    kilometros: number
    pemex: {
        full1: number
        full2: number
        sencillo: number
        autotanque: number
    }
    libramiento: {
        full1: number
        full2: number
        sencillo: number
        autotanque: number
    }
    centenario: {
        full1: number
        full2: number
        sencillo: number
        autotanque: number
    }
}