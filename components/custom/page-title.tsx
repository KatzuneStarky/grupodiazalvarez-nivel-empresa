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
        <div className={cn(
            "flex flex-col gap-4",
            hasActions ? "sm:flex-row sm:items-center sm:justify-between" : "sm:flex-row sm:items-center"
        )}>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                    <div className="[&>svg]:size-5 sm:[&>svg]:size-6">
                        {icon}
                    </div>
                </div>
                <div className="min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold truncate">{title}</h1>
                    <p className="text-sm sm:text-base text-muted-foreground line-clamp-2">
                        {description}
                    </p>
                </div>
            </div>

            {hasActions && (
                <div className="flex flex-wrap gap-2 sm:shrink-0">
                    {actions}
                </div>
            )}
        </div>
    )
}

export default PageTitle