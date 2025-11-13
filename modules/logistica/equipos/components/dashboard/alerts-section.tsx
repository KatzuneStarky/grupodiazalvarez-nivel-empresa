"use client"

import { AlertTriangle, Wrench, FileX, MapPinOff, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const alerts = [
    {
        id: 1,
        type: "expired-insurance",
        severity: "critical",
        icon: FileX,
        title: "Expired Insurance",
        description: "Units FDA-2845, FDA-3901 - Insurance policies expired",
        count: 2,
    },
    {
        id: 2,
        type: "overdue-maintenance",
        severity: "high",
        icon: Wrench,
        title: "Overdue Maintenance",
        description: "3 vehicles have exceeded scheduled maintenance intervals",
        count: 3,
    },
    {
        id: 3,
        type: "gps-inactive",
        severity: "medium",
        icon: MapPinOff,
        title: "GPS Inactive",
        description: "2 units not transmitting location data",
        count: 2,
    },
]

const AlertsSection = () => {
    return (
        <Card className="border-border bg-card mb-8">
            <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Critical Alerts
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {alerts.map((alert) => {
                        const Icon = alert.icon
                        return (
                            <div
                                key={alert.id}
                                className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4 transition-colors hover:bg-muted"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${alert.severity === "critical"
                                                ? "bg-destructive/10"
                                                : alert.severity === "high"
                                                    ? "bg-chart-4/10"
                                                    : "bg-chart-1/10"
                                            }`}
                                    >
                                        <Icon
                                            className={`h-5 w-5 ${alert.severity === "critical"
                                                    ? "text-destructive"
                                                    : alert.severity === "high"
                                                        ? "text-chart-4"
                                                        : "text-chart-1"
                                                }`}
                                        />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="text-sm font-semibold text-card-foreground">{alert.title}</h4>
                                            <Badge variant={alert.severity === "critical" ? "destructive" : "secondary"} className="text-xs">
                                                {alert.count}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{alert.description}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm">
                                    View Details
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </Button>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}

export default AlertsSection