"use client"

import { locations } from "../../constants/locations";
import { useEffect } from "react";

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const CENTER: [number, number] = [24.1426, -110.3128];
const ZOOM_LEVEL = 7;

const customIcon = new L.Icon({
    iconUrl: '/estacion.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});

export default function CoverageMap() {

    useEffect(() => {
        const map = L.map('map').setView(CENTER, ZOOM_LEVEL);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap',
        }).addTo(map);

        locations.forEach(({ lat, lng, estacion }) => {
            L.marker([lng, lat], { icon: customIcon })
                .addTo(map)
                .bindPopup(`<b>${estacion.nombre}</b>`);
        });

        return () => {
            map.remove();
        };
    }, [CENTER, ZOOM_LEVEL, L, locations]);

    return <div id="map" style={{ width: '100%', height: '70%' }} className="rounded-lg mb-6" />
}