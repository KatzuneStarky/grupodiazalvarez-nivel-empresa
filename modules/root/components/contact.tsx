"use client"

import { Mail, MapPin, Phone, Send } from "lucide-react"
import { useState } from "react"

const RootContact = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)

    return (
        <section id="contacto" className="py-20 bg-gray-900 text-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="animate-on-scroll text-4xl md:text-5xl font-bold mb-6">Contacta con nosotros</h2>
                    <p className="animate-on-scroll text-xl text-gray-300 max-w-3xl mx-auto">
                        Estamos aquí para ayudarte con cualquier pregunta o consulta que tengas.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    <div className="animate-on-scroll">
                        <h3 className="text-2xl font-bold mb-8">Informacion de contacto</h3>

                        <div className="space-y-6">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">Numero telefonico</h4>
                                    <p className="text-gray-300">+52 612 123 4567</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">Correo electronico</h4>
                                    <p className="text-gray-300">info@grupodiazalvarez.com</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">Direccion</h4>
                                    <p className="text-gray-300">La Paz, Baja California Sur, Mexico</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-6 bg-blue-900 rounded-lg">
                            <h4 className="font-bold mb-2">Serivcio 24/7</h4>
                            <p className="text-gray-300">
                                Necesita ayuda con cualquier tipo de servicio?
                                <br />
                                Estamos disponibles para atenderte 24/7.
                            </p>
                        </div>
                    </div>

                    <div className="animate-on-scroll">
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-2">
                                    Nombre completo *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent `}
                                    placeholder="Ingrese su nombre completo"
                                />                                
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-2">
                                    Correo electronico *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent `}
                                    placeholder="Ingrese su correo electronico"
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                                    Numero telefonico *
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent `}
                                    placeholder="Ingrese su numero telefonico"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium mb-2">
                                    Mensaje *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                    placeholder="Cuentanos sobre su necesidad"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        Enviar mensaje
                                        <Send className="ml-2 w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="form-success mt-6 p-4 bg-green-600 rounded-lg opacity-0 scale-0">
                            <p className="text-center font-semibold">Thank you! We'll get back to you soon.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default RootContact