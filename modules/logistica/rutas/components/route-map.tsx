"use client"

import { PuntoGeografico } from "../../equipos/types/rutas"
import { useEffect, useRef, useState } from "react"
import { RouteMapProps } from "../types/rutas"
import { Badge } from "@/components/ui/badge"

const RouteMapPage = ({
    origen,
    destino,
    onOriginSelect,
    onDestinationSelect,
    selectionMode = "none",
    editable = false,
    className = "h-[400px] w-full",
}: RouteMapProps) => {
    const mapRef = useRef<HTMLDivElement>(null)
    const [map, setMap] = useState<any>(null)
    const [L, setL] = useState<any>(null)
    const [markers, setMarkers] = useState<any[]>([])
    const [polyline, setPolyline] = useState<any>(null)

    useEffect(() => {
        const loadLeaflet = async () => {
            const leaflet = await import("leaflet")

            delete (leaflet.Icon.Default.prototype as any)._getIconUrl
            leaflet.Icon.Default.mergeOptions({
                iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
                iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
                shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
            })

            setL(leaflet)
            return leaflet
        }

        loadLeaflet()
    }, [])

    useEffect(() => {
        if (!L || !mapRef.current) return

        const mapInstance = L.map(mapRef.current).setView([24.155, -110.245], 15)

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
        }).addTo(mapInstance)

        setMap(mapInstance)

        return () => {
            mapInstance.remove()
        }
    }, [L])

    useEffect(() => {
        if (!map || !L) return

        markers.forEach((marker) => map.removeLayer(marker))
        if (polyline) map.removeLayer(polyline)

        const newMarkers: any[] = []

        const originIcon = L.divIcon({
            html: '<div style="background-color: #22c55e; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
            className: "custom-marker",
            iconSize: [20, 20],
            iconAnchor: [10, 10],
        })

        const destinationIcon = L.divIcon({
            html: '<div style="background-color: #ef4444; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
            className: "custom-marker",
            iconSize: [20, 20],
            iconAnchor: [10, 10],
        })

        if (
            origen &&
            typeof origen.latitud === "number" &&
            typeof origen.longitud === "number" &&
            (origen.latitud !== 0 || origen.longitud !== 0)
        ) {
            const originMarker = L.marker([origen.latitud, origen.longitud], { icon: originIcon })
                .addTo(map)
                .bindPopup(`<b>🟢 Origen</b><br>${origen.nombre}`)
            newMarkers.push(originMarker)
        }

        if (
            destino &&
            typeof destino.latitud === "number" &&
            typeof destino.longitud === "number" &&
            (destino.latitud !== 0 || destino.longitud !== 0)
        ) {
            const destMarker = L.marker([destino.latitud, destino.longitud], { icon: destinationIcon })
                .addTo(map)
                .bindPopup(`<b>🔴 Destino</b><br>${destino.nombre}`)
            newMarkers.push(destMarker)
        }

        if (
            origen &&
            destino &&
            (origen.latitud !== 0 || origen.longitud !== 0) &&
            (destino.latitud !== 0 || destino.longitud !== 0)
        ) {
            const line = L.polyline(
                [
                    [origen.latitud, origen.longitud],
                    [destino.latitud, destino.longitud],
                ],
                { color: "#3b82f6", weight: 4, opacity: 0.8, dashArray: "10, 5" }
            ).addTo(map)
            setPolyline(line)

            const group = L.featureGroup(newMarkers)
            map.fitBounds(group.getBounds().pad(0.2))
        }

        setMarkers(newMarkers)
    }, [map, origen, destino, L])

    useEffect(() => {
        if (!map || !editable || selectionMode === "none") return

        const handleMapClick = (e: any) => {
            const { lat, lng } = e.latlng
            const pointName = `${selectionMode === "origin" ? "Origen" : "Destino"} (${lat.toFixed(4)}, ${lng.toFixed(4)})`

            const newPoint: PuntoGeografico = {
                nombre: pointName,
                latitud: lat,
                longitud: lng,
            }

            if (selectionMode === "origin" && onOriginSelect) {
                onOriginSelect(newPoint)
            } else if (selectionMode === "destination" && onDestinationSelect) {
                onDestinationSelect(newPoint)
            }
        }

        map.on("click", handleMapClick)

        const mapContainer = map.getContainer()
        if (selectionMode === "origin" || selectionMode === "destination") {
            mapContainer.style.cursor = "crosshair"
        } else {
            mapContainer.style.cursor = ""
        }

        return () => {
            map.off("click", handleMapClick)
            mapContainer.style.cursor = ""
        }
    }, [map, editable, selectionMode, onOriginSelect, onDestinationSelect])

    return (
        <div className={className}>
            <link
                rel="stylesheet"
                href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
                integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
                crossOrigin=""
            />
            {editable && selectionMode !== "none" && (
                <div className="mb-3 flex items-center justify-center bg-muted/50 p-3 rounded-lg">
                    <Badge variant="default" className="flex items-center gap-2">
                        {selectionMode === "origin" ? "🟢" : "🔴"}
                        Seleccionando: {selectionMode === "origin" ? "Origen" : "Destino"}
                    </Badge>
                </div>
            )}
            <div ref={mapRef} className="h-full w-full rounded-lg border shadow-sm" />
            {origen && destino && !editable && (
                <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>{origen.nombre}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>{destino.nombre}</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RouteMapPage