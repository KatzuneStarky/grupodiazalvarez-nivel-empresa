"use client"

import { useFormContext } from 'react-hook-form'
import React, { useEffect, useRef } from 'react'

const MapPicker = () => {
    const mapRef = useRef<HTMLDivElement | null>(null)
    const { setValue, watch } = useFormContext()
    const lat = watch("ubicacion.lat")
    const lng = watch("ubicacion.lng")

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
                const map = L.map(mapRef.current).setView([24.155, -110.245], 15)

                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    attribution: "© OpenStreetMap contributors",
                }).addTo(map)

                let marker: L.Marker | null = null

                map.on("click", (e: L.LeafletMouseEvent) => {
                    const { lat, lng } = e.latlng
                    setValue("ubicacion.lat", lat, { shouldValidate: true })
                    setValue("ubicacion.lng", lng, { shouldValidate: true })

                    if (marker) {
                        marker.setLatLng([lat, lng])
                    } else {
                        marker = L.marker([lat, lng]).addTo(map)
                    }
                })
            }
        }

        loadMap()
    }, [setValue])

    return (
        <div className="w-full h-[700px] rounded-lg overflow-hidden border">
            <div ref={mapRef} className="w-full h-full" />
        </div>
    )
}

export default MapPicker