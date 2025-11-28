"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAllEmpreas } from "@/modules/empresas/hooks/use-all-empresas"
import { useUsuarios } from "@/modules/usuarios/hooks/use-usuarios"
import { Building2, Users, Shield, Activity } from "lucide-react"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import PageTitle from "@/components/custom/page-title"
import { Separator } from "@/components/ui/separator"
import { RolUsuario } from "@/enum/user-roles"

const AdministracionPage = () => {
    const { empresas } = useAllEmpreas()
    const { usuarios } = useUsuarios()
    const allRoles = Object.values(RolUsuario).length

    const newEmpresasMonth
        = empresas?.filter((empresa) =>
            empresa.fechaCreacion
            >= new Date(new Date().setMonth(new Date().getMonth() - 1))
        )

    const newUsuariosMonth
        = usuarios?.filter((usuario) =>
            parseFirebaseDate(usuario.creadoEn)
            >= new Date(new Date().setMonth(new Date().getMonth() - 1))
        )

    const stats = [
        {
            title: "Empresas activas",
            value: `${empresas?.length?.toString() || "0"} empresa${empresas?.length === 1 ? "" : "s"}`,
            change: `+${newEmpresasMonth?.length?.toString() || "0"} empresa${newEmpresasMonth?.length === 1 ? "" : "s"} este mes`,
            icon: Building2,
        },
        {
            title: "Total Usuarios",
            value: `${usuarios?.length?.toString() || "0"} usuario${usuarios?.length === 1 ? "" : "s"}`,
            change: `+${newUsuariosMonth?.length?.toString() || "0"} usuario${newUsuariosMonth?.length === 1 ? "" : "s"} este mes`,
            icon: Users,
        },
        {
            title: "Roles personalizados",
            value: `${allRoles.toString()} rol${allRoles === 1 ? "" : "es"}`,
            change: "",
            icon: Shield,
        },
        {
            title: "Eventos del sistema",
            value: "8,329",
            change: "Last 24h",
            icon: Activity,
        },
    ]

    return (
        <div className="container mx-auto px-8 py-6">
            <PageTitle
                title="Administración"
                description="Administración del sistema"
                icon={
                    <Shield className="w-12 h-12 text-primary" />
                }
            />

            <Separator className="my-4" />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.change}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-2 mt-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                {
                                    tenant: "TransLogistics SA",
                                    action: "Created new maintenance task",
                                    time: "5 min ago",
                                },
                                {
                                    tenant: "FuelCorp MX",
                                    action: "Updated GPS integration settings",
                                    time: "12 min ago",
                                },
                                {
                                    tenant: "RoadMaster Ltd",
                                    action: "Added 3 new users to system",
                                    time: "1 hour ago",
                                },
                            ].map((activity, i) => (
                                <div key={i} className="flex items-start gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                        <Activity className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{activity.tenant}</p>
                                        <p className="text-sm text-muted-foreground">{activity.action}</p>
                                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>System Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { name: "API Response Time", value: "124ms", status: "good" },
                                { name: "Database Queries", value: "1.2K/min", status: "good" },
                                { name: "Error Rate", value: "0.02%", status: "good" },
                                { name: "Active Sessions", value: "342", status: "good" },
                            ].map((metric) => (
                                <div key={metric.name} className="flex items-center justify-between">
                                    <span className="text-sm">{metric.name}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">{metric.value}</span>
                                        <div className="h-2 w-2 rounded-full bg-green-500" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default AdministracionPage