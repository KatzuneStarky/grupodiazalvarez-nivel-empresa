export interface TableStats {
    total: number
    recent: number
    growth: number
}

export interface TableInfo {
    name: string
    icon: string
    description: string
    stats: TableStats
    route: string
}