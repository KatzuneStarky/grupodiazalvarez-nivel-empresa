"use client"

import { ArrowDownRight, ArrowUpRight, Icon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { KpiCardProps } from '../types/metric-card'
import { Progress } from '@/components/ui/progress'
import CountUp from 'react-countup';
import { cn } from '@/lib/utils'
import React from 'react'

const MetricCard = ({
    icon: Icon,
    title,
    value,
    className,
    colorVariant = "blue",
    trend,
    textValue,
    initialTextVaule
}: KpiCardProps) => {
    const valueFormatted = typeof value === "number" ? value.toFixed(2) : value
    const colorClasses = {
        blue: "bg-kpi-blue-bg border-kpi-blue/30",
        emerald: "bg-kpi-emerald-bg border-kpi-emerald/30",
        amber: "bg-kpi-amber-bg border-kpi-amber/30",
        purple: "bg-kpi-purple-bg border-kpi-purple/30",
        rose: "bg-kpi-rose-bg border-kpi-rose/30",
        cyan: "bg-kpi-cyan-bg border-kpi-cyan/30",
        orange: "bg-kpi-orange-bg border-kpi-orange/30",
        teal: "bg-kpi-teal-bg border-kpi-teal/30",
        pink: "bg-kpi-pink-bg border-kpi-pink/30",
        lime: "bg-kpi-lime-bg border-kpi-lime/30",
    }

    const iconColorClasses = {
        blue: "bg-kpi-blue/20 text-kpi-blue",
        emerald: "bg-kpi-emerald/20 text-kpi-emerald",
        amber: "bg-kpi-amber/20 text-kpi-amber",
        purple: "bg-kpi-purple/20 text-kpi-purple",
        rose: "bg-kpi-rose/20 text-kpi-rose",
        cyan: "bg-kpi-cyan/20 text-kpi-cyan",
        orange: "bg-kpi-orange/20 text-kpi-orange",
        teal: "bg-kpi-teal/20 text-kpi-teal",
        pink: "bg-kpi-pink/20 text-kpi-pink",
        lime: "bg-kpi-lime/20 text-kpi-lime",
    }

    return (
        <Card className={cn("overflow-hidden border-2", colorClasses[colorVariant], className)}>
            <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-muted-foreground whitespace-normal break-words flex-1">
                        {title}
                    </p>
                    <div
                        className={cn(
                            "flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg",
                            iconColorClasses[colorVariant]
                        )}
                    >
                        <Icon className="h-6 w-6" />
                    </div>
                </div>

                <div className="flex-1 flex items-center">
                    <p className="text-4xl font-bold text-foreground text-center leading-tight">
                        {initialTextVaule !== "" && (
                            <span className="text-4xl font-semibold">{initialTextVaule}</span>
                        )}
                        {" "}<CountUp start={0} end={Number(valueFormatted)} duration={5} />{" "}
                        <span className="text-xl font-semibold">{textValue}</span>
                    </p>
                </div>

                {trend && (
                    <div className="mt-4 flex items-center justify-start">
                        <p
                            className={cn(
                                "text-sm font-medium",
                                trend.isPositive ? "text-primary" : "text-destructive"
                            )}
                        >
                            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default MetricCard