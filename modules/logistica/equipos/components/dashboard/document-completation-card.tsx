"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { FileCheck } from "lucide-react"

interface DocumentCompletationCardProps {
    porcentajeDeCumplimiento: number
    expiraPronto: number
    expirado: number
    critico: number
    total: number
}

const DocumentCompletationCard = ({
    porcentajeDeCumplimiento,
    expiraPronto,
    expirado,
    critico,
    total,
}: DocumentCompletationCardProps) => {
    const expiredPercent = (expirado / total) * 100
    const expiringSoonPercent = (expiraPronto / total) * 100
    const criticoPercent = (critico / total) * 100

    return (
        <Card className="border-border bg-card">
            <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-chart-2" />
                    Complementacion de documentos
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-card-foreground">Porcentaje de cumplimiento</span>
                        <span className="text-2xl font-bold text-card-foreground">{porcentajeDeCumplimiento}%</span>
                    </div>
                    <Progress value={porcentajeDeCumplimiento} className="h-3 [&>div]:bg-chart-2" />
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-card-foreground">Expired</span>
                                <Badge variant="destructive" className="text-xs">
                                    {expirado}
                                </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">{expiredPercent.toFixed(0)}%</span>
                        </div>
                        <Progress value={expiredPercent} className="h-2 [&>div]:bg-destructive" />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-card-foreground">Expiring Soon</span>
                                <Badge variant="secondary" className="text-xs bg-chart-4/20 text-chart-4 border-chart-4/30">
                                    {expiraPronto}
                                </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">{expiringSoonPercent.toFixed(0)}%</span>
                        </div>
                        <Progress value={expiringSoonPercent} className="h-2 [&>div]:bg-chart-4" />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-card-foreground">Valid</span>
                                <Badge variant="secondary" className="text-xs bg-chart-2/20 text-chart-2 border-chart-2/30">
                                    {critico}
                                </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">{criticoPercent.toFixed(0)}%</span>
                        </div>
                        <Progress value={criticoPercent} className="h-2 [&>div]:bg-chart-2" />
                    </div>
                </div>

                <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Documentos totales</span>
                        <span className="text-lg font-semibold text-card-foreground">{total}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default DocumentCompletationCard