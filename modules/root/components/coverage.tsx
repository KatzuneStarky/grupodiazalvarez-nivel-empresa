"use client"

import { CheckCircle, MapPin } from "lucide-react"

const RootCoverage = () => {
    const municipios = [
        "La Paz",
        "Los Cabos",
        "Mulegé",
        "Comondú"
    ]

    return (
        <section id="coverage" className="py-20 bg-blue-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="animate-on-scroll text-4xl md:text-5xl font-bold text-gray-900 mb-6">Service Coverage</h2>
                    <p className="animate-on-scroll text-xl text-gray-600 max-w-3xl mx-auto">
                        We provide comprehensive fuel transportation services throughout Baja California Sur, reaching every major
                        city and municipality.
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
                            <h4 className="font-bold text-gray-900 mb-2">Headquartered in La Paz</h4>
                            <p className="text-gray-600">
                                Strategically located in La Paz, Baja California Sur, we ensure efficient distribution and quick
                                response times across the entire peninsula.
                            </p>
                        </div>
                    </div>

                    <div className="animate-on-scroll">
                        <div className="bg-white p-8 rounded-lg shadow-lg">
                            <img
                                src="/placeholder.svg?height=400&width=500"
                                alt="Baja California Sur coverage map"
                                className="w-full rounded-lg mb-6"
                            />
                            <div className="text-center">
                                <h4 className="text-lg font-bold text-gray-900 mb-2">Complete Peninsula Coverage</h4>
                                <p className="text-gray-600">
                                    From Tijuana to Los Cabos, we ensure reliable fuel delivery across the entire Baja California Sur
                                    region.
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