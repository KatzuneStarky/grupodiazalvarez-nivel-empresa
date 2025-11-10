"use client"

import { ChartSection } from "../../types/chart-section"
import { useRouter } from "next/navigation"
import Icon from "@/components/global/icon"

interface ChartCardProps {
  section: ChartSection
}

const GraficasCard = ({
    section
}: ChartCardProps) => {
    const router = useRouter()

    return (
        <div
            className="relative h-full rounded-xl bg-card border border-border p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer overflow-hidden"
            onClick={() => router.push(section.href)}
        >
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent pointer-events-none" />

            <div className="relative z-10">
                <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors duration-300">
                    <Icon iconName={section.icon} className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>

                <h3 className="text-xl font-semibold text-card-foreground mb-2 text-balance">{section.title}</h3>

                <p className="text-sm text-muted-foreground leading-relaxed text-pretty">{section.description}</p>

                <div className="mt-4 flex items-center text-sm font-medium text-primary">
                    <span>Explorar</span>
                    <svg
                        className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default GraficasCard