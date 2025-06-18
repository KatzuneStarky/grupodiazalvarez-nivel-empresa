"use client"

import { Truck, Shield, Gauge, Users, Calendar, Award } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { animate } from "animejs"
import { fleetStats } from "../constants/flet-status"
import { vehicles } from "../constants/vehicles"

const RootFleet = () => {
    const [activeVehicle, setActiveVehicle] = useState(0)
    const fleetRef = useRef<HTMLElement>(null)

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
                setActiveVehicle(index)

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
        <section id="fleet" ref={fleetRef} className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="animate-on-scroll text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Modern Fleet</h2>
                    <p className="animate-on-scroll text-xl text-gray-600 max-w-3xl mx-auto">
                        State-of-the-art vehicles and equipment designed for safe, efficient, and reliable fuel transportation
                        across Baja California Sur.
                    </p>
                </div>

                <div className="fleet-stats grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
                    {fleetStats.map((stat, index) => (
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
                        <h3 className="animate-on-scroll text-2xl font-bold text-gray-900 mb-6">Vehicle Types</h3>
                        {vehicles.map((vehicle, index) => (
                            <div
                                key={vehicle.id}
                                className={`vehicle-card p-6 rounded-lg cursor-pointer transition-all duration-300 ${activeVehicle === index
                                        ? "bg-blue-600 text-white shadow-lg"
                                        : "bg-white text-gray-900 hover:shadow-md"
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-lg font-bold">{vehicle.name}</h4>
                                    <span
                                        className={`text-sm px-3 py-1 rounded-full ${activeVehicle === index ? "bg-blue-500" : "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {vehicle.capacity}
                                    </span>
                                </div>
                                <p className={`text-sm mb-3 ${activeVehicle === index ? "text-blue-100" : "text-gray-600"}`}>
                                    {vehicle.type}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {vehicle.features.slice(0, 2).map((feature, featureIndex) => (
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
                                            +{vehicle.features.length - 2} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Vehicle Details */}
                    <div className="animate-on-scroll">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="relative">
                                <img
                                    src={vehicles[activeVehicle].image || "/placeholder.svg"}
                                    alt={vehicles[activeVehicle].name}
                                    className="w-full h-64 object-cover"
                                />
                                <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    {vehicles[activeVehicle].capacity}
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{vehicles[activeVehicle].name}</h3>
                                <p className="text-gray-600 mb-6">{vehicles[activeVehicle].type}</p>

                                {/* Features */}
                                <div className="mb-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {vehicles[activeVehicle].features.map((feature, index) => (
                                            <div key={index} className="flex items-center">
                                                <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                                                <span className="text-sm text-gray-700">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Specifications */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">Engine:</span>
                                            <div className="font-medium">{vehicles[activeVehicle].specs.engine}</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Transmission:</span>
                                            <div className="font-medium">{vehicles[activeVehicle].specs.transmission}</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Safety:</span>
                                            <div className="font-medium">{vehicles[activeVehicle].specs.safety}</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Model Year:</span>
                                            <div className="font-medium">{vehicles[activeVehicle].specs.year}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Safety & Maintenance Section */}
                <div className="mt-16 grid md:grid-cols-2 gap-12">
                    <div className="animate-on-scroll">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Safety & Compliance</h3>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <Shield className="w-6 h-6 text-green-500 mr-3 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-gray-900">DOT Certified</h4>
                                    <p className="text-gray-600 text-sm">
                                        All vehicles meet Department of Transportation safety standards
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <Award className="w-6 h-6 text-green-500 mr-3 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-gray-900">ISO 9001 Certified</h4>
                                    <p className="text-gray-600 text-sm">
                                        Quality management system certification for consistent service
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <Gauge className="w-6 h-6 text-green-500 mr-3 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-gray-900">Regular Inspections</h4>
                                    <p className="text-gray-600 text-sm">Monthly safety inspections and preventive maintenance</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="animate-on-scroll">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Technology & Tracking</h3>
                        <div className="bg-blue-50 p-6 rounded-lg">
                            <ul className="space-y-3">
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                                    <span className="text-gray-700">Real-time GPS tracking on all vehicles</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                                    <span className="text-gray-700">Electronic logging devices (ELD)</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                                    <span className="text-gray-700">Temperature and pressure monitoring</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                                    <span className="text-gray-700">Automated delivery confirmations</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                                    <span className="text-gray-700">Emergency alert systems</span>
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