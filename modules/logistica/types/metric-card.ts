export interface MetricCardProps {
    title: string
    value: string
    change?: string
    changeType?: "positive" | "negative"
    icon: React.ElementType
    subtitle?: string
    progress?: number
    target?: string
    additional?: { label: string; value: string }[]
    className?: string
}