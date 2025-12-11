"use client"

import React, { useEffect, useRef, useState } from 'react'
import type { Map, Marker, LeafletMouseEvent } from 'leaflet'
import { cn } from "@/lib/utils"

interface MapPickerProps {
    lat?: number
    lng?: number
    onLocationSelect?: (lat: number, lng: number) => void
    className?: string
}

const MapPicker = ({ lat, lng, onLocationSelect, className }: MapPickerProps) => {
    const mapRef = useRef<HTMLDivElement | null>(null)
    const mapInstanceRef = useRef<Map | null>(null)
    const markerRef = useRef<Marker | null>(null)
    const [isMapReady, setIsMapReady] = useState(false)

    // Keep the latest callback in a ref to use inside event listeners without re-binding
    const onLocationSelectRef = useRef(onLocationSelect)
    useEffect(() => {
        onLocationSelectRef.current = onLocationSelect
    }, [onLocationSelect])

    useEffect(() => {
        let isMounted = true

        const loadMap = async () => {
            if (!mapRef.current || mapInstanceRef.current) return

            const L = await import("leaflet")

            // Fix Leaflet's default icon path issues
            delete (L.Icon.Default.prototype as any)._getIconUrl
            L.Icon.Default.mergeOptions({
                iconRetinaUrl:
                    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
                iconUrl:
                    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
                shadowUrl:
                    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
            })

            const initialPosition: [number, number] = lat && lng ? [lat, lng] : [24.155, -110.245]

            if (isMounted) {
                const map = L.map(mapRef.current).setView(initialPosition, 15)

                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    attribution: "© OpenStreetMap contributors",
                }).addTo(map)

                mapInstanceRef.current = map

                // Initialize marker if coordinates exist
                if (lat && lng) {
                    markerRef.current = L.marker([lat, lng]).addTo(map)
                }

                map.on("click", (e: LeafletMouseEvent) => {
                    const { lat, lng } = e.latlng

                    // Allow internal update for immediate feedback
                    if (markerRef.current) {
                        markerRef.current.setLatLng([lat, lng])
                    } else {
                        markerRef.current = L.marker([lat, lng]).addTo(map)
                    }

                    if (onLocationSelectRef.current) {
                        onLocationSelectRef.current(lat, lng)
                    }
                })

                setIsMapReady(true)
            }
        }

        loadMap()

        return () => {
            isMounted = false
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove()
                mapInstanceRef.current = null
                markerRef.current = null
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // Initialize once

    // React to prop changes
    useEffect(() => {
        const updateMap = async () => {
            if (!isMapReady || !mapInstanceRef.current || !lat || !lng) return

            const L = await import("leaflet")

            const map = mapInstanceRef.current

            // Fly to the new location to make it smooth, set view
            map.setView([lat, lng], 15)

            if (markerRef.current) {
                markerRef.current.setLatLng([lat, lng])
            } else {
                markerRef.current = L.marker([lat, lng]).addTo(map)
            }
        }

        updateMap()
    }, [lat, lng, isMapReady])

    return (
        <div className={cn("w-full h-[700px] rounded-lg overflow-hidden border", className)}>
            <div ref={mapRef} className="w-full h-full z-0" />
        </div>
    )
}

export default MapPicker