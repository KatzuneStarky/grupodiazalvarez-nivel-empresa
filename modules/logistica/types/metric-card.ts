import { LucideIcon } from "lucide-react"

export interface KpiCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    textValue?: string
    initialTextVaule?: string
    trend?: {
        value: number
        isPositive: boolean
    }
    className?: string
    colorVariant?: "blue" | "emerald" | "amber" | "purple" | "rose" | "cyan" | "orange" | "teal" | "pink" | "lime"
}