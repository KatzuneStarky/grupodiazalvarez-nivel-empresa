"use client"

import { Card, CardContent } from "@/components/ui/card"
import CountUp from "react-countup"

interface StatusCardProps {
    icon: string | React.ElementType
    value: number
    title: string
    label: string
    color: string
}

const StatusCard = ({
    icon: Icon,
    label,
    title,
    value,
    color
}: StatusCardProps) => {
    return (
        <Card className={`border-0 shadow-sm bg-gradient-to-br from-${color}-50 to-${color}-100`}>
            <CardContent className="p-4 text-center">
                <Icon className={`h-8 w-8 text-${color}-600 mx-auto mb-2`} />
                <p className={`text-2xl font-bold text-${color}-700`}>
                    <CountUp startVal={0} end={value} duration={2} />
                </p>
                <p className={`text-xs text-${color}-600 font-medium`}>{title}</p>
                <p className={`text-xs text-${color}-500`}>{label}</p>
            </CardContent>
        </Card>
    )
}

export default StatusCard