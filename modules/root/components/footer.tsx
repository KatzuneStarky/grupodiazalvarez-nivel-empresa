"use client"

import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

const RootFooter = () => {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">Grupo Diaz Alvarez</h3>
                        <p className="text-gray-300 mb-4">
                            Ofrecer a nuestros clientes un servicio de calidad en el suministro y abastecimiento de petrolíferos..
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Servicios</h4>
                        <ul className="space-y-2 text-gray-300">
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    Transporte de combustibles
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    Transporte industrial
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    Transporte comercial
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    Transporte de carga
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Municipios con cobertura</h4>
                        <ul className="space-y-2 text-gray-300">
                            <li>La Paz</li>
                            <li>Los Cabos</li>
                            <li>Comondú</li>
                            <li>Mulegé</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Informacion de contacto</h4>
                        <div className="space-y-3 text-gray-300">
                            <div className="flex items-center">
                                <Phone className="w-4 h-4 mr-2" />
                                <span>+52 612 123 4567</span>
                            </div>
                            <div className="flex items-center">
                                <Mail className="w-4 h-4 mr-2" />
                                <span>info@grupodiazalvarez.com</span>
                            </div>
                            <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2" />
                                <span>La Paz, BCS, Mexico</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Grupo Diaz Alvarez. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    )
}

export default RootFooter