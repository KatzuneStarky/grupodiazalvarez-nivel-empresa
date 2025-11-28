"use client"

import { Activity, AlertCircle, CheckCircle, Clock, FileText, Info, Logs, User, XCircle, Globe, Monitor, Database, Shield } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogAction, SystemLog } from "@/types/system-logs"
import PageTitle from "@/components/custom/page-title"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useAllLogs } from "@/hooks/use-all-logs"
import { Badge } from "@/components/ui/badge"
import { es } from "date-fns/locale"
import { format } from "date-fns"

const LogsPage = () => {
    const { logs, loading } = useAllLogs()

    const getActionIcon = (action: LogAction) => {
        switch (action) {
            case 'create': return <CheckCircle className="h-4 w-4 text-green-500" />
            case 'update': return <Activity className="h-4 w-4 text-blue-500" />
            case 'delete': return <XCircle className="h-4 w-4 text-red-500" />
            case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />
            case 'login': return <User className="h-4 w-4 text-purple-500" />
            default: return <Info className="h-4 w-4 text-gray-500" />
        }
    }

    const getStatusBadge = (status: SystemLog['status']) => {
        switch (status) {
            case 'success': return <Badge variant="default" className="bg-green-500/15 text-green-700 hover:bg-green-500/25 border-green-200 text-[10px] px-1.5 py-0 h-5">Exitoso</Badge>
            case 'failure': return <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-5">Fallido</Badge>
            case 'warning': return <Badge variant="secondary" className="bg-yellow-500/15 text-yellow-700 hover:bg-yellow-500/25 border-yellow-200 text-[10px] px-1.5 py-0 h-5">Alert</Badge>
            default: return <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">Info</Badge>
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 md:px-8 py-6">
                <div className="flex items-center gap-4 mb-6">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                        <Card key={i} className="h-48">
                            <CardHeader>
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-20 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 md:px-8 py-6">
            <PageTitle
                title="Logs del Sistema"
                description="Historial de actividades"
                icon={
                    <Logs className="size-10 md:size-12 text-primary" />
                }
            />

            <Separator className="my-4" />

            {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="bg-muted/50 p-6 rounded-full mb-4">
                        <FileText className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">No hay registros</h3>
                    <p className="text-muted-foreground max-w-sm mt-2">
                        No se han encontrado registros de actividad en el sistema.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {logs.map((log) => (
                        <Card key={log.id} className="hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
                            <CardHeader className="p-4 pb-2 space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="mt-0.5 shrink-0">
                                            {getActionIcon(log.action)}
                                        </div>
                                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider truncate">
                                            {log.action}
                                        </span>
                                    </div>
                                    {getStatusBadge(log.status)}
                                </div>
                                <CardTitle className="text-sm font-semibold leading-tight line-clamp-2 min-h-[2.5rem]">
                                    {log.description}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="p-4 pt-0 flex-1 flex flex-col gap-3">
                                <div className="space-y-2 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <User className="h-3.5 w-3.5 shrink-0" />
                                        <span className="truncate" title={log.userEmail}>{log.userEmail}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-3.5 w-3.5 shrink-0" />
                                        <span className="truncate">
                                            {log.timestamp ? format(log.timestamp.toDate(), "PP p", { locale: es }) : '-'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Database className="h-3.5 w-3.5 shrink-0" />
                                        <span className="truncate capitalize">{log.resourceType}</span>
                                        {log.resourceId && (
                                            <span className="font-mono text-[10px] bg-muted px-1 rounded truncate max-w-[80px]">
                                                {log.resourceId}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {log.errorMessage && (
                                    <div className="p-2 bg-red-50 text-red-700 rounded text-[10px] leading-tight flex gap-1.5">
                                        <AlertCircle className="h-3 w-3 shrink-0 mt-0.5" />
                                        <p className="line-clamp-2">{log.errorMessage}</p>
                                    </div>
                                )}

                                <div className="mt-auto pt-2">
                                    <Accordion type="single" collapsible className="w-full border-t">
                                        <AccordionItem value="details" className="border-b-0">
                                            <AccordionTrigger className="text-[10px] text-muted-foreground py-2 hover:no-underline hover:text-primary justify-start gap-2">
                                                <span>Ver detalles técnicos</span>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="space-y-2 pt-1">
                                                    <div className="grid gap-1.5 text-[10px]">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-muted-foreground flex items-center gap-1">
                                                                <Globe className="h-3 w-3" /> IP
                                                            </span>
                                                            <span className="font-mono">{log.ip || '-'}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-muted-foreground flex items-center gap-1">
                                                                <Shield className="h-3 w-3" /> Rol
                                                            </span>
                                                            <span>{log.userRole}</span>
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-muted-foreground flex items-center gap-1">
                                                                <Monitor className="h-3 w-3" /> User Agent
                                                            </span>
                                                            <span className="truncate text-muted-foreground/70" title={log.userAgent}>
                                                                {log.userAgent || '-'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                                                        <div className="bg-muted/50 rounded p-1.5">
                                                            <pre className="text-[9px] font-mono whitespace-pre-wrap break-all">
                                                                {JSON.stringify(log.metadata, null, 2)}
                                                            </pre>
                                                        </div>
                                                    )}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

export default LogsPage