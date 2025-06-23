"use client"

import { useEquipos } from "@/modules/cbs/hooks/equipos/use-equipos"
import { Shield, Gauge, Award, Truck } from "lucide-react"
import { fleetStats } from "../constants/flet-status"
import { useEffect, useRef, useState } from "react"
import { animate } from "animejs"

const RootFleet = () => {
    const [activeVehicle, setActiveVehicle] = useState(0)
    const fleetRef = useRef<HTMLElement>(null)
    const { equipos } = useEquipos()

    const updatedStats = [
        ...fleetStats.slice(0, 0),
        { icon: Truck, label: "Vehiculos activos", value: `${equipos.length}+` },
        ...fleetStats.slice(1)
    ];

    const hasEquipos = equipos && equipos.length > 0

    useEffect(() => {
        const vehicleCards = document.querySelectorAll(".vehicle-card")

        vehicleCards.forEach((card, index) => {
            card.addEventListener("mouseenter", () => {
                animate(card, {
                    scale: 1.02,
                    translateY: -5,
                    duration: 300,
                    easing: "easeOutQuart",
                })
            })

            card.addEventListener("mouseleave", () => {
                animate(card, {
                    scale: 1,
                    translateY: 0,
                    duration: 300,
                    easing: "easeOutQuart",
                })
            })

            card.addEventListener("click", () => {
                animate(card, {
                    scale: [1, 0.98, 1],
                    duration: 200,
                    easing: "easeOutQuart",
                })
            })
        })

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const statsElements = entry.target.querySelectorAll(".stat-item")

                        animate(statsElements, {
                            translateY: [30, 0],
                            opacity: [0, 1],
                            duration: 600,
                            delay: 100,
                            easing: "easeOutQuart",
                        })
                    }
                })
            },
            { threshold: 0.3 },
        )

        const statsSection = document.querySelector(".fleet-stats")
        if (statsSection) {
            observer.observe(statsSection)
        }

        return () => observer.disconnect()
    }, [])

    return (
        <section id="flete" ref={fleetRef} className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="animate-on-scroll text-4xl md:text-5xl font-bold text-gray-900 mb-6">Nuestra flota moderna</h2>
                    <p className="animate-on-scroll text-xl text-gray-600 max-w-3xl mx-auto">
                        Nuestra flota de vehículos modernos y eficientes está diseñada para satisfacer las necesidades de transporte de carga en todo el estado.
                    </p>
                </div>

                <div className="fleet-stats grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
                    {updatedStats.map((stat, index) => (
                        <div key={index} className="stat-item text-center opacity-0">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <stat.icon className="w-8 h-8 text-blue-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-600">{stat.label}</div>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <div className="space-y-4">
                        <h3 className="animate-on-scroll text-2xl font-bold text-gray-900 mb-6">Tipo de vehiculos</h3>
                        {hasEquipos && equipos.slice(0, 4).map((vehicle, index) => (
                            <div
                                key={vehicle.id}
                                onClick={() => setActiveVehicle(index)}
                                className={`vehicle-card p-6 rounded-lg cursor-pointer transition-all duration-300 ${activeVehicle === index
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "bg-white text-gray-900 hover:shadow-md"
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-lg font-bold">{vehicle.numEconomico}</h4>
                                    <span
                                        className={`text-sm px-3 py-1 rounded-full ${activeVehicle === index ? "bg-blue-500" : "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {vehicle.m3}
                                    </span>
                                </div>
                                <p className={`text-sm mb-3 ${activeVehicle === index ? "text-blue-100" : "text-gray-600"}`}>
                                    {vehicle.tipoTanque}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {/**
                                     * {vehicle.features.slice(0, 2).map((feature, featureIndex) => (
                                        <span
                                            key={featureIndex}
                                            className={`text-xs px-2 py-1 rounded ${activeVehicle === index ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            {feature}
                                        </span>
                                    ))}
                                    {vehicle.features.length > 2 && (
                                        <span
                                            className={`text-xs px-2 py-1 rounded ${activeVehicle === index ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            +{vehicle.features.length - 2} mas
                                        </span>
                                    )}
                                     */}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="animate-on-scroll">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="relative">
                                <img
                                    src={"/placeholder.svg"}
                                    className="w-full h-64 object-cover"
                                />
                                <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    {hasEquipos && equipos[activeVehicle].m3}

                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{hasEquipos && equipos[activeVehicle].numEconomico}</h3>
                                <p className="text-gray-600 mb-6">{hasEquipos && equipos[activeVehicle].tipoTanque}</p>

                                {/**
                                 * <div className="mb-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Caracteristicas</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {vehicles[activeVehicle].features.map((feature, index) => (
                                            <div key={index} className="flex items-center">
                                                <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                                                <span className="text-sm text-gray-700">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                 */}

                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Especificaciones</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">Serie:</span>
                                            <div className="font-medium text-gray-400">{hasEquipos && equipos[activeVehicle].serie}</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Placas:</span>
                                            <div className="font-medium text-gray-400">{hasEquipos && equipos[activeVehicle].placas}</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Año:</span>
                                            <div className="font-medium text-gray-400">{hasEquipos && equipos[activeVehicle].year}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 grid md:grid-cols-2 gap-12">
                    <div className="animate-on-scroll">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">
                            Seguridad y Calidad
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <Shield className="w-6 h-6 text-green-500 mr-3 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-gray-900">Certificado</h4>
                                    <p className="text-gray-600 text-sm">
                                        Todos los vehiculos son inspeccionados
                                        regularmente por un equipo de expertos
                                        en seguridad y cumplen con los estandares
                                        de seguridad.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <Award className="w-6 h-6 text-green-500 mr-3 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-gray-900">Certificacion ISO 9001</h4>
                                    <p className="text-gray-600 text-sm">
                                        Nuestra flota cumple con los estandares
                                        de calidad ISO 9001, lo que nos permite
                                        ofrecer un servicio de alta calidad.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <Gauge className="w-6 h-6 text-green-500 mr-3 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-gray-900">
                                        Inspecciones regulares
                                    </h4>
                                    <p className="text-gray-600 text-sm">
                                        Nuestros vehiculos son inspeccionados
                                        regularmente para garantizar su funcionamiento
                                        y seguridad.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="animate-on-scroll">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Tecnologia y sistema de seguimiento</h3>
                        <div className="bg-blue-50 p-6 rounded-lg">
                            <ul className="space-y-3">
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                                    <span className="text-gray-700">GPS en tiempo real monitoriando nuestros vehiculos</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                                    <span className="text-gray-700">Dispositivo Electrónico de Registro</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                                    <span className="text-gray-700">Monitoreo de temperatura y presion</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                                    <span className="text-gray-700">Confirmaciones de entrega automatizadas</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                                    <span className="text-gray-700">Sistemas de emergencia</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default RootFleet