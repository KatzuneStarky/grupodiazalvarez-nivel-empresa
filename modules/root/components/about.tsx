"use client"

import { useEstaciones } from "@/modules/cbs/hooks/bdd/use-estaciones"
import { useAboutFunctions } from "../hooks/use-about-functions"
import { Award, Clock, Shield, Users } from "lucide-react"

const RootAbout = () => {
    const { aboutRef, counters } = useAboutFunctions()
    const { estaciones } = useEstaciones()

    const years = counters.years = new Date().getFullYear() - 2000
    const liters = counters.liters = 1000
    const clients = counters.clients = 50
    const routes = counters.routes = estaciones.length

    return (
        <section id="acercade" ref={aboutRef} className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="animate-on-scroll text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Acerca de nuestra compañia
                    </h2>
                    <p className="animate-on-scroll text-xl text-gray-600 max-w-3xl mx-auto">
                        Con mas de {years} de experiencia en transporte de combustible en Baja California Sur, estamos comprometidos
                        a brindar servicios seguros, confiables y eficientes que mantengan su negocio funcionando sin problemas.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <div className="animate-on-scroll">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Nuestra mision</h3>
                        <p className="text-gray-600 mb-6">
                            Comercializar y distribuir combustibles en los sectores industriales y 
                            de servicios ofreciendo un servicio de calidad con personal altamente 
                            capacitado garantizando la satisfacción de las necesidades de nuestros 
                            clientes al mayoreo y menudeo.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center">
                                <Shield className="w-6 h-6 text-blue-600 mr-3" />
                                <span className="text-gray-700">Seguridad</span>
                            </div>
                            <div className="flex items-center">
                                <Clock className="w-6 h-6 text-blue-600 mr-3" />
                                <span className="text-gray-700">Servicio 24/7</span>
                            </div>
                            <div className="flex items-center">
                                <Award className="w-6 h-6 text-blue-600 mr-3" />
                                <span className="text-gray-700">Certificados</span>
                            </div>
                            <div className="flex items-center">
                                <Users className="w-6 h-6 text-blue-600 mr-3" />
                                <span className="text-gray-700">Equipo experto</span>
                            </div>
                        </div>
                    </div>

                    <div className="animate-on-scroll">
                        <img
                            src="https://combustiblesbajasur.com/images/img/header-tec3.jpg"
                            alt="Fuel transportation truck in Baja California Sur"
                            className="rounded-lg shadow-lg w-full"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div className="animate-on-scroll">
                        <div className="text-4xl font-bold text-blue-600 mb-2">{years}+</div>
                        <div className="text-gray-600">Años de servicio</div>
                    </div>
                    <div className="animate-on-scroll">
                        <div className="text-4xl font-bold text-blue-600 mb-2">{liters}+</div>
                        <div className="text-gray-600">Litros transportados</div>
                    </div>
                    <div className="animate-on-scroll">
                        <div className="text-4xl font-bold text-blue-600 mb-2">{clients}+</div>
                        <div className="text-gray-600">Clientes satisfechos</div>
                    </div>
                    <div className="animate-on-scroll">
                        <div className="text-4xl font-bold text-blue-600 mb-2">{routes}+</div>
                        <div className="text-gray-600">Rutas activas</div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default RootAbout