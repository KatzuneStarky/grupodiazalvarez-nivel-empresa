"use client"

import React, { useEffect, useRef } from 'react'

interface MapPickerProps {
    lat?: number
    lng?: number
    onLocationSelect?: (lat: number, lng: number) => void
}

const MapPicker = ({ lat, lng, onLocationSelect }: MapPickerProps) => {
    const mapRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const loadMap = async () => {
            const L = await import("leaflet")

            delete (L.Icon.Default.prototype as any)._getIconUrl
            L.Icon.Default.mergeOptions({
                iconRetinaUrl:
                    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
                iconUrl:
                    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
                shadowUrl:
                    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
            })

            if (mapRef.current && !mapRef.current.hasChildNodes()) {
                const initialPosition: [number, number] = lat && lng ? [lat, lng] : [24.155, -110.245]
                const map = L.map(mapRef.current).setView(initialPosition, 15)

                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    attribution: "© OpenStreetMap contributors",
                }).addTo(map)

                let marker: L.Marker | null = null

                // Si ya hay coordenadas iniciales, muestra el marcador
                if (lat && lng) {
                    marker = L.marker([lat, lng]).addTo(map)
                }

                map.on("click", (e: L.LeafletMouseEvent) => {
                    const { lat, lng } = e.latlng
                    if (marker) {
                        marker.setLatLng([lat, lng])
                    } else {
                        marker = L.marker([lat, lng]).addTo(map)
                    }

                    onLocationSelect?.(lat, lng)
                })
            }
        }

        loadMap()
    }, [lat, lng, onLocationSelect])

    return (
        <div className="w-full h-[700px] rounded-lg overflow-hidden border">
            <div ref={mapRef} className="w-full h-full" />
        </div>
    )
}

export default MapPicker