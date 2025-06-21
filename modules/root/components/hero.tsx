"use client"

import { useHeroFunctions } from "../hooks/use-hero-functions"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { slides } from "../constants/slides"

const RootHero = () => {
    const {
        currentSlide,
        currentSlideData,
        heroRef,
        goToSlide,
        nextSlide,
        prevSlide,
        handleCTAClick,
    } = useHeroFunctions()

    return (
        <section
            id="inicio"
            ref={heroRef}
            className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-all duration-1000 ${currentSlideData.background}`}
        >
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-20"></div>
            </div>

            <div className="absolute top-20 right-20 slide-icon opacity-0">
                <currentSlideData.icon className="w-16 h-16 text-white opacity-30" />
            </div>

            <div className="container mx-auto px-4 text-center text-white relative z-10">
                <h1 className="slide-title text-5xl md:text-7xl font-bold mb-6 opacity-0">
                    {currentSlideData.title}
                    <span className="block text-orange-400 mt-2">{currentSlideData.subtitle}</span>
                </h1>

                <p className="slide-description text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-0 text-gray-200">
                    {currentSlideData.description}
                </p>

                <button
                    onClick={handleCTAClick}
                    className="slide-cta inline-flex items-center px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg text-lg transition-colors duration-300 opacity-0"
                >
                    {currentSlideData.cta}
                    <ChevronRight className="ml-2 w-5 h-5" />
                </button>
            </div>

            <button
                onClick={prevSlide}
                className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-200 backdrop-blur-sm"
            >
                <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-200 backdrop-blur-sm"
            >
                <ChevronRight className="w-6 h-6 text-white" />
            </button>

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? "bg-orange-500 w-8" : "bg-white/50 hover:bg-white/70"
                            }`}
                    />
                ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                <div
                    className="h-full bg-orange-500 transition-all duration-300 ease-linear"
                    style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                />
            </div>

            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
                <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce"></div>
                </div>
            </div>
        </section>
    )
}

export default RootHero