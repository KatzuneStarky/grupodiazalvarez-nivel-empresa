"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { BddCard } from "../types/bdd-card"
import Icon from "@/components/global/icon"

const BddCard = ({
    description,
    itemCount,
    category,
    title,
    icon,
    id,
}: BddCard) => {
    return (
        <Card
            key={id}
            className="cursor-pointer overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:bg-card/80"
        >
            <div className="p-6 h-full flex flex-col">
                <div className="flex items-start justify-between">
                    <div
                        className={`p-3 rounded-2xl bg-primary`}
                    >
                        <Icon iconName={icon} className="h-6 w-6 text-white" />
                    </div>
                    <Badge className="bg-muted/60 text-muted-foreground">
                        {category}
                    </Badge>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-muted-foreground mb-2 flex-grow">{description}</p>

                <div className="pt-4 border-t border-border/30 flex items-center justify-between">
                    <div className="flex flex-col items-start gap-1">
                        <span className="text-2xl font-bold text-foreground">
                            {itemCount.toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                            Registros
                        </span>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <span className="text-primary font-semibold text-lg">→</span>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default BddCard