"use client"

import { exportEstaciones } from '@/functions/excel-export/estaciones/export/export-estaciones';
import { useEstaciones } from '@/modules/logistica/estaciones/hooks/use-estaciones';
import { EstacionServicio } from '@/modules/logistica/estaciones/types/estacion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDirectLink } from '@/hooks/use-direct-link';
import PageTitle from '@/components/custom/page-title';
import { Separator } from '@/components/ui/separator';
import { IconFileExport } from '@tabler/icons-react';
import { MapPin, Plus, User } from 'lucide-react';
import { useArea } from '@/context/area-context';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Icon from '@/components/global/icon';
import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';

const EstacionesCoverageMap
    = dynamic(() => import('../../../../../../modules/logistica/estaciones/components/map/coverage-map'),
        {
            ssr: false,
            loading: () => (
                <div className="w-full h-[600px] rounded-lg shadow-lg bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-500">Cargando mapa...</p>
                </div>
            ),
        });

const EstacionesMap = () => {
    const [selectedStation, setSelectedStation] = useState<string | null>(null)
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markersRef = useRef<Map<string, L.Marker>>(new Map());
    const leafletLoadedRef = useRef(false);
    const { directLink } = useDirectLink("/estaciones")
    const { estaciones } = useEstaciones()
    const router = useRouter()
    const { area } = useArea()

    const handleStationClick = (station: EstacionServicio) => {
        if (!station.ubicacion || !mapInstanceRef.current) return;

        const { lat, lng } = station.ubicacion;
        const map = mapInstanceRef.current;
        map.setView([lat, lng], 15, { animate: true, duration: 0.7 });
        const marker = markersRef.current.get(station.id);
        if (marker) marker.openPopup();
        setSelectedStation(station.id);
    };

    const handleExportEstaciones = async () => {
        try {
            toast.promise(exportEstaciones(estaciones, area?.nombre || ""), {
                loading: "Exportando datos...",
                success: "Datos exportados con éxito",
                error: "Error al exportar datos"
            })
        } catch (error) {
            console.log(error);
            toast.error("Error al exportar datos")
        }
    }

    const validStations = estaciones.filter((station) => station.ubicacion?.lat && station.ubicacion?.lng);

    return (
        <div className="container mx-auto py-8 px-6">
            <PageTitle
                icon={<Icon iconName='tabler:map-2' className='w-12 h-12' />}
                title='Mapa de cobertura'
                description='Visualice el mapa de cobertura actual de sus estaciones'
                hasActions
                actions={
                    <>
                        <Button
                            className="sm:w-auto"
                            onClick={() => handleExportEstaciones()}
                        >
                            <IconFileExport className="w-4 h-4 mr-2" />
                            Exportar Datos
                        </Button>

                        <Button
                            className="sm:w-auto"
                            onClick={() => router.push(`${directLink}/nuevo`)}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Nueva estacion
                        </Button>
                    </>
                }
            />
            <Separator className='my-4' />

            <div className="flex gap-4 h-full pb-4">
                <aside className="w-96 overflow-y-auto space-y-4 pr-2">
                    <div className="sticky top-0 bg-background/95 backdrop-blur-sm py-3 z-10 border-b">
                        <h2 className="text-xl font-bold">Estaciones de Servicio</h2>
                        <p className="text-sm text-muted-foreground mt-1">{validStations.length} ubicaciones disponibles</p>
                    </div>
                    <div className='p-4 space-y-4'>
                        {validStations.map((station) => {
                            const mainContact = station.contacto[0]
                            const isSelected = selectedStation === station.id

                            return (
                                <Card
                                    key={station.id}
                                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-2 ${isSelected ? "ring-2 ring-primary border-primary shadow-lg" : "border-border hover:border-primary/50"
                                        }`}
                                    onClick={() => handleStationClick(station)}
                                >
                                    <CardHeader className="pb-3 space-y-2">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                <MapPin className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <CardTitle className="text-base leading-tight line-clamp-2">{station.nombre}</CardTitle>
                                                {station.rfc && (
                                                    <p className="text-xs text-muted-foreground mt-1 font-mono bg-muted px-2 py-0.5 rounded inline-block">
                                                        {station.rfc}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="space-y-1.5">
                                            <p className="text-sm font-medium text-foreground">
                                                {station.direccion.ciudad}, {station.direccion.estado}
                                            </p>
                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                {station.direccion.calle} {station.direccion.numeroExterior}
                                                {station.direccion.numeroInterior && ` Int. ${station.direccion.numeroInterior}`}
                                            </p>
                                        </div>

                                        {mainContact?.responsable && (
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                                                <User className="h-3.5 w-3.5 flex-shrink-0" />
                                                <span className="truncate">
                                                    {mainContact.responsable} • {mainContact.cargo}
                                                </span>
                                            </div>
                                        )}

                                        {station.productos && station.productos.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                {station.productos.slice(0, 3).map((producto, idx) => (
                                                    <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                                                        {producto}
                                                    </span>
                                                ))}
                                                {station.productos.length > 3 && (
                                                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                                                        +{station.productos.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </aside>

                <EstacionesCoverageMap
                    leafletLoadedRef={leafletLoadedRef}
                    mapInstanceRef={mapInstanceRef}
                    estaciones={validStations}
                    markersRef={markersRef}
                    mapRef={mapRef}
                />
            </div>
        </div>
    )
}

export default EstacionesMap