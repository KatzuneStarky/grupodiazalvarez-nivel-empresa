"use client"

import { locations } from "../constants/locations";
import { CheckCircle, MapPin } from "lucide-react"
import { useEffect } from 'react';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const CENTER: [number, number] = [24.1426, -110.3128];
const ZOOM_LEVEL = 7;

const customIcon = new L.Icon({
    iconUrl: '/estacion.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});

const RootCoverage = () => {
    const municipios = [
        "La Paz",
        "Los Cabos",
        "Mulegé",
        "Comondú"
    ]

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
    }, []);

    return (
        <section id="cobertura" className="py-20 bg-blue-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="animate-on-scroll text-4xl md:text-5xl font-bold text-gray-900 mb-6">Cobertura de servicio</h2>
                    <p className="animate-on-scroll text-xl text-gray-600 max-w-3xl mx-auto">
                        Cubrimos el territorio de Baja California Sur, brindando servicio de entrega de combustible a los municipios del estado
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="animate-on-scroll">
                        <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                            <MapPin className="w-6 h-6 text-blue-600 mr-3" />
                            Cities We Serve
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {municipios.map((city, index) => (
                                <div key={index} className="flex items-center">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                                    <span className="text-gray-700">{city}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 p-6 bg-orange-100 rounded-lg">
                            <h4 className="font-bold text-gray-900 mb-2">Con sede en La Paz</h4>
                            <p className="text-gray-600">
                                Estrategicamente ubicada en la ciudad de La Paz, nuestra sede en La Paz cubre todo el territorio de Baja California Sur,
                                brindando servicio de entrega de combustible a todos los municipios del estado.
                            </p>
                        </div>
                    </div>

                    <div className="animate-on-scroll">
                        <div className="bg-white p-8 rounded-lg shadow-lg h-[700px]">
                            <div id="map" style={{ width: '100%', height: '70%' }} className="rounded-lg mb-6" />
                            <div className="text-center">
                                <h4 className="text-lg font-bold text-gray-900 mb-2">Cobertura completa en la peninsula</h4>
                                <p className="text-gray-600">
                                    Desde <b>Mulegé</b> hasta <b>Los cabos</b>, 
                                    nuestra cobertura abarca todo el territorio 
                                    de Baja California Sur.
                                    <br />
                                    Nuestro equipo de profesionales se asegurará 
                                    de entregar el combustible a todas las partes 
                                    del estado.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default RootCoverage