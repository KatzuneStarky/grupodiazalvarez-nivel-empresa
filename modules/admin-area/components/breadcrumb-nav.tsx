"use client"

import { ChevronRight, Home } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface BreadcrumbNavProps {
    companyName: string
    areaName: string
}

export function BreadcrumbNav({ companyName, areaName }: BreadcrumbNavProps) {
    return (
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            <Home className="h-4 w-4" />
            <span>Panel de administracion</span>
            <ChevronRight className="h-4 w-4" />
            <span>{companyName}</span>
            <ChevronRight className="h-4 w-4" />
            <Badge variant="outline" className="text-xs">
                {areaName}
            </Badge>
        </nav>
    )
}