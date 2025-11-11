"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Wrench } from "lucide-react"

interface MaintenanceStatusCardProps {
    total: number
    proximos: number
    prontosAvencer: number
    vencidos: number
}

const MaintenanceStatusCard = ({
    total,
    proximos,
    prontosAvencer,
    vencidos
}: MaintenanceStatusCardProps) => {
    const overduePercent = (vencidos / total) * 100
    const dueSoonPercent = (prontosAvencer / total) * 100
    const scheduledPercent = (proximos / total) * 100

    return (
        <Card className="border-border bg-card">
            <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-chart-1" />
                    Estatus de mantenimientos
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-card-foreground">Vencidos</span>
                            <Badge variant="destructive" className="text-xs">
                                {vencidos}
                            </Badge>
                        </div>
                        {
                            overduePercent
                                ? <span className="text-xs text-muted-foreground">{overduePercent.toFixed(0)}%</span>
                                : null
                        }
                    </div>
                    <Progress value={overduePercent} className="h-2 [&>div]:bg-destructive" />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-card-foreground">Proximos a vencer</span>
                            <Badge variant="secondary" className="text-xs bg-chart-4/20 text-chart-4 border-chart-4/30">
                                {prontosAvencer}
                            </Badge>
                        </div>
                        {
                            dueSoonPercent
                                ? <span className="text-xs text-muted-foreground">{dueSoonPercent.toFixed(0)}%</span>
                                : null
                        }
                    </div>
                    <Progress value={dueSoonPercent} className="h-2 [&>div]:bg-chart-4" />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-card-foreground">Proximos</span>
                            <Badge variant="secondary" className="text-xs bg-chart-2/20 text-chart-2 border-chart-2/30">
                                {proximos}
                            </Badge>
                        </div>
                        {
                            scheduledPercent
                                ? <span className="text-xs text-muted-foreground">{scheduledPercent.toFixed(0)}%</span>
                                : null
                        }
                    </div>
                    <Progress value={scheduledPercent} className="h-2 [&>div]:bg-chart-2" />
                </div>

                <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Mantenimientos totales</span>
                        <span className="text-lg font-semibold text-card-foreground">{total}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default MaintenanceStatusCard