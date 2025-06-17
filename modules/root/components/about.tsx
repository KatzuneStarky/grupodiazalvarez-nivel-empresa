"use client"

import { useAboutFunctions } from "../hooks/use-about-functions"
import { Award, Clock, Shield, Users } from "lucide-react"

const RootAbout = () => {
    const { aboutRef, counters } = useAboutFunctions()

    const years = counters.years = new Date().getFullYear() - 2000
    const liters = counters.liters = 1000
    const clients = counters.clients = 500
    const routes = counters.routes = 100

    return (
        <section id="about" ref={aboutRef} className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="animate-on-scroll text-4xl md:text-5xl font-bold text-gray-900 mb-6">About Our Company</h2>
                    <p className="animate-on-scroll text-xl text-gray-600 max-w-3xl mx-auto">
                        With over 15 years of experience in fuel transportation across Baja California Sur, we are committed to
                        providing safe, reliable, and efficient services that keep your business running smoothly.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <div className="animate-on-scroll">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h3>
                        <p className="text-gray-600 mb-6">
                            To be the leading fuel transportation company in Baja California Sur, providing exceptional service while
                            maintaining the highest safety standards and environmental responsibility.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center">
                                <Shield className="w-6 h-6 text-blue-600 mr-3" />
                                <span className="text-gray-700">Safety First</span>
                            </div>
                            <div className="flex items-center">
                                <Clock className="w-6 h-6 text-blue-600 mr-3" />
                                <span className="text-gray-700">24/7 Service</span>
                            </div>
                            <div className="flex items-center">
                                <Award className="w-6 h-6 text-blue-600 mr-3" />
                                <span className="text-gray-700">Certified</span>
                            </div>
                            <div className="flex items-center">
                                <Users className="w-6 h-6 text-blue-600 mr-3" />
                                <span className="text-gray-700">Expert Team</span>
                            </div>
                        </div>
                    </div>

                    <div className="animate-on-scroll">
                        <img
                            src="/placeholder.svg?height=400&width=600"
                            alt="Fuel transportation truck in Baja California Sur"
                            className="rounded-lg shadow-lg w-full"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div className="animate-on-scroll">
                        <div className="text-4xl font-bold text-blue-600 mb-2">{years}+</div>
                        <div className="text-gray-600">Years of Service</div>
                    </div>
                    <div className="animate-on-scroll">
                        <div className="text-4xl font-bold text-blue-600 mb-2">{liters}M³+</div>
                        <div className="text-gray-600">Liters Delivered</div>
                    </div>
                    <div className="animate-on-scroll">
                        <div className="text-4xl font-bold text-blue-600 mb-2">{clients}+</div>
                        <div className="text-gray-600">Happy Clients</div>
                    </div>
                    <div className="animate-on-scroll">
                        <div className="text-4xl font-bold text-blue-600 mb-2">{routes}+</div>
                        <div className="text-gray-600">Active Routes</div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default RootAbout