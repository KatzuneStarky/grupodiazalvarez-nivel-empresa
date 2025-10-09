"use client"

import { EstacionServicio } from "../../types/estacion"
import { useEffect } from "react";

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const CENTER: [number, number] = [24.1426, -110.3128];
const ZOOM_LEVEL = 2;

interface MapProps {
    estaciones: EstacionServicio[]
    mapRef: React.RefObject<HTMLDivElement | null>
    mapInstanceRef: React.RefObject<any>
    markersRef: React.RefObject<Map<string, any>>
    leafletLoadedRef: React.RefObject<boolean>
}

const EstacionesCoverageMap = ({ estaciones, mapRef, mapInstanceRef, leafletLoadedRef, markersRef }: MapProps) => {

    useEffect(() => {
        if (!mapRef.current || leafletLoadedRef.current) return
        if (!markersRef.current) markersRef.current = new Map<string, L.Marker>();

        const initMap = async () => {
            const L = await import("leaflet")

            if (mapInstanceRef.current || !mapRef.current) return

            leafletLoadedRef.current = true

            const icon = L.icon({
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
            })

            const map = L.map(mapRef.current).setView([CENTER[0], CENTER[1]], 7)
            mapInstanceRef.current = map

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(map)

            const bounds: [number, number][] = [];
            const validStations = estaciones.filter((station) => station.ubicacion?.lat && station.ubicacion?.lng)

            validStations.forEach(station => {
                if (!station.ubicacion) return;

                const { lat, lng } = station.ubicacion;
                bounds.push([lat, lng]);

                const mainContact = station.contacto[0];
                const fullAddress = `${station.direccion.calle} ${station.direccion.numeroExterior}${station.direccion.numeroInterior ? ` Int. ${station.direccion.numeroInterior}` : ""}, ${station.direccion.colonia}, ${station.direccion.ciudad}, ${station.direccion.estado} ${station.direccion.codigoPostal}`;

                // Crear un popup seguro usando HTMLElement para evitar inyección
                const popupDiv = document.createElement("div");
                popupDiv.className = "p-2";

                const nameEl = document.createElement("h3");
                nameEl.className = "font-bold text-lg mb-2";
                nameEl.textContent = station.nombre;
                popupDiv.appendChild(nameEl);

                if (station.rfc) {
                    const rfcEl = document.createElement("p");
                    rfcEl.className = "text-sm text-gray-600 mb-1";
                    rfcEl.innerHTML = `<strong>RFC:</strong> ${station.rfc}`;
                    popupDiv.appendChild(rfcEl);
                }

                const addressEl = document.createElement("p");
                addressEl.className = "text-sm mb-2";
                addressEl.innerHTML = `<strong>Dirección:</strong><br/>${fullAddress}`;
                popupDiv.appendChild(addressEl);

                if (mainContact?.responsable) {
                    const contactEl = document.createElement("p");
                    contactEl.className = "text-sm mb-2";
                    contactEl.innerHTML = `<strong>Contacto:</strong> ${mainContact.responsable} (${mainContact.cargo})`;
                    popupDiv.appendChild(contactEl);
                }

                if (station.productos && station.productos.length > 0) {
                    const productsEl = document.createElement("p");
                    productsEl.className = "text-sm";
                    productsEl.innerHTML = `<strong>Productos:</strong> ${station.productos.join(", ")}`;
                    popupDiv.appendChild(productsEl);
                }

                const marker = L.marker([lat, lng], { icon }).addTo(map).bindPopup(popupDiv, { maxWidth: 300 });
                markersRef.current?.set(station.id, marker);
            });

            if (bounds.length > 0) {
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }

        if (!estaciones || estaciones.length === 0) return
        else initMap()

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
            markersRef.current?.clear();
            leafletLoadedRef.current = false;
        };
    }, [estaciones, mapRef, mapInstanceRef, markersRef, leafletLoadedRef])

    return <div
        ref={mapRef}
        className="flex-1 rounded-lg shadow-lg"
        aria-label="Mapa de estaciones de servicio"
    />
}

export default EstacionesCoverageMap