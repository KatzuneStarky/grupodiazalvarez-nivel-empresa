"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Menu, Shield, Activity } from "lucide-react"

interface StatsCardsProps {
  menuCount: number
  userCount: number
  activeUsers: number
}

export function StatsCards({ menuCount, userCount, activeUsers }: StatsCardsProps) {
  const stats = [
    {
      title: "Total de menus",
      value: menuCount,
      icon: Menu,
      description: "Menus activos",
      trend: "+2 nuevos esta semana",
    },
    {
      title: "Total de usuarios",
      value: userCount,
      icon: Users,
      description: "Usuarios en esta area",
      trend: "+1 nuevo usuario",
    },
    {
      title: "Total de usuarios activos",
      value: activeUsers,
      icon: Activity,
      description: "Usuarios activos en esta area",
      trend: `${Math.round((activeUsers / userCount) * 100)}% de usuarios activos`,
    },
    {
      title: "Total de roles de administrador",
      value: 4,
      icon: Shield,
      description: "Roles disponibles",
      trend: "Sin cambios",
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
            <p className="text-xs text-green-600 mt-1">{stat.trend}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
