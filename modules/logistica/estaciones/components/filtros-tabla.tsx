"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter, Search } from "lucide-react"

interface FiltrosTablaProps {
    searchTerm: string
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>
}

const FiltrosTabla = ({
    searchTerm,
    setSearchTerm
}: FiltrosTablaProps) => {
    const handleClearFilters = () => {
        setSearchTerm("")
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <div className="flex items-center justify-between gap-2">
                        <div className='flex items-center gap-2'>
                            <Search className="h-4 w-4" />
                            Búsqueda y Filtros
                        </div>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between w-full gap-4">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nombre, responsable, telefono, email, etc..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Button onClick={() => handleClearFilters()}>
                        <Filter />
                        Limpiar filtros
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default FiltrosTabla