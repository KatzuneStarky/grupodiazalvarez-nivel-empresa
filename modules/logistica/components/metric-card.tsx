"use client"

import { Card, CardContent } from '@/components/ui/card'
import { MetricCardProps } from '../types/metric-card'
import React from 'react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

const MetricCard = ({
    title,
    value,
    change,
    changeType,
    icon: Icon,
    subtitle,
    progress,
    target,
    additional,
    className = "",
}: MetricCardProps) => {
    return (
        <Card
            className={`relative overflow-hidden border-0 shadow-sm ${className}`}
        >
            <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
                        <p className="text-2xl font-bold text-gray-900">{value}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-200/50">
                        <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                </div>

                {change && (
                    <div className="flex items-center gap-2 mb-2">
                        {changeType === "positive" ? (
                            <ArrowUpRight className="h-4 w-4 text-green-500" />
                        ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm font-semibold ${changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
                            {change}
                        </span>
                        <span className="text-xs text-muted-foreground">vs last period</span>
                    </div>
                )}

                {progress !== undefined && (
                    <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Progress to target</span>
                            <span className="font-medium">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        {target && <p className="text-xs text-muted-foreground">Target: {target}</p>}
                    </div>
                )}

                {subtitle && <p className="text-xs text-muted-foreground mb-2">{subtitle}</p>}

                {additional && (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                        {additional.map((item, index) => (
                            <div key={index} className="text-center">
                                <p className="text-xs text-muted-foreground">{item.label}</p>
                                <p className="text-sm font-semibold">{item.value}</p>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default MetricCard