"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Menu, Shield, Activity } from "lucide-react"

interface StatsCardsProps {
  menuCount: number
  menuVisibleCount: number
  userCount: number
  activeUsers: number
  userTrend: number
  adminCount: number
}

export function StatsCards({
  menuCount,
  menuVisibleCount,
  userCount,
  activeUsers,
  userTrend,
  adminCount
}: StatsCardsProps) {
  const activeUserPercentage = userCount > 0 ? Math.round((activeUsers / userCount) * 100) : 0;

  const stats = [
    {
      title: "Total de menus",
      value: menuCount,
      icon: Menu,
      description: "Menus configurados",
      trend: `${menuVisibleCount} visibles / ${menuCount} total`,
      trendColor: "text-muted-foreground"
    },
    {
      title: "Total de usuarios",
      value: userCount,
      icon: Users,
      description: "Usuarios en esta area",
      trend: userTrend > 0 ? `+${userTrend} nuevos esta semana` : "Sin nuevos usuarios esta semana",
      trendColor: userTrend > 0 ? "text-green-600" : "text-muted-foreground"
    },
    {
      title: "Total de usuarios activos",
      value: activeUsers,
      icon: Activity,
      description: "Usuarios con estado activo",
      trend: `${activeUserPercentage}% de usuarios activos`,
      trendColor: activeUserPercentage > 80 ? "text-green-600" : (activeUserPercentage > 50 ? "text-yellow-600" : "text-red-600")
    },
    {
      title: "Administradores",
      value: adminCount,
      icon: Shield,
      description: "Usuarios con rol admin",
      trend: "Total en esta área",
      trendColor: "text-muted-foreground"
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            <p className={`text-xs mt-1 ${stat.trendColor}`}>{stat.trend}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
