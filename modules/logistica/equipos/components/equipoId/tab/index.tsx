"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Fuel, Truck, Wrench } from "lucide-react"

interface TabsIndexProps {
    children?: React.ReactNode
}

const TabsIndex = ({
    children
}: TabsIndexProps) => {
    return (
        <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-auto p-1">
                <TabsTrigger value="general" className="gap-2 py-3">
                    <Truck className="w-4 h-4" />
                    <span className="hidden sm:inline">General</span>
                </TabsTrigger>
                <TabsTrigger value="tanks" className="gap-2 py-3">
                    <Fuel className="w-4 h-4" />
                    <span className="hidden sm:inline">Tanques</span>
                </TabsTrigger>
                <TabsTrigger value="maintenance" className="gap-2 py-3">
                    <Wrench className="w-4 h-4" />
                    <span className="hidden sm:inline">Mantenimiento</span>
                </TabsTrigger>
                <TabsTrigger value="documents" className="gap-2 py-3">
                    <FileText className="w-4 h-4" />
                    <span className="hidden sm:inline">Documentos</span>
                </TabsTrigger>
            </TabsList>

            {children}
        </Tabs>
    )
}

export default TabsIndex