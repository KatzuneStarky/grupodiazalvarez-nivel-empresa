"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import Icon from "@/components/global/icon"

interface MetricCardProps {
    title: string
    value: string | number
    icon: string
    trend?: {
        percentage: number
        isPositive: boolean
    }
    format?: "number" | "currency" | "decimal"
    valueType?: string
}

const MetricCard = ({
    title,
    value,
    icon,
    trend,
    format,
    valueType = ""
}: MetricCardProps) => {
    const formatValue = (val: string | number): string => {
        const numVal = typeof val === "string" ? Number.parseFloat(val) : val

        if (isNaN(numVal)) return "0"

        switch (format) {
            case "currency":
                return `$${numVal.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            case "decimal":
                return `${numVal.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${valueType}`
            default:
                return `${numVal.toLocaleString("es-MX")} ${valueType}`
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <Icon iconName={icon} className="h-8 w-8 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatValue(value)}</div>
                {trend && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        {trend.isPositive ? (
                            <ArrowUpIcon className="h-3 w-3 text-green-500" />
                        ) : (
                            <ArrowDownIcon className="h-3 w-3 text-red-500" />
                        )}
                        <span className={trend.isPositive ? "text-green-500" : "text-red-500"}>
                            {trend.percentage.toFixed(1)}%
                        </span>
                        <span>vs el mes anterior</span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default MetricCard