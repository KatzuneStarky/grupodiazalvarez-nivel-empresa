import { cn } from "@/lib/utils"

interface PageTitleProps {
    icon: React.ReactNode
    title: string
    description: string
    hasActions?: boolean
    actions?: React.ReactNode
}

const PageTitle = ({
    icon,
    title,
    description,
    hasActions,
    actions
}: PageTitleProps) => {

    return (
        <div className={cn("flex items-center gap-3", hasActions ? "justify-between" : "")}>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                    {icon}
                </div>
                <div>
                    <h1 className="text-3xl font-bold">{title}</h1>
                    <p className="text-muted-foreground">
                        {description}
                    </p>
                </div>
            </div>

            {hasActions && (
                <div className="flex gap-2">
                    {actions}
                </div>
            )}
        </div>
    )
}

export default PageTitle