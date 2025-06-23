"use client"

import { CheckCircle, MapPin } from "lucide-react"
import dynamic from "next/dynamic";

const Map = dynamic(() => import('../components/coverage/map'), { ssr: false });

const RootCoverage = () => {
    const municipios = [
        "La Paz",
        "Los Cabos",
        "Mulegé",
        "Comondú"
    ]

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
                            Ciudades que ofrecemos servicio
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
                            <Map />
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