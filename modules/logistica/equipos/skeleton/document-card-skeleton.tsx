import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function FileCardSkeleton() {
    return (
        <CardContent className="px-4 py-6 animate-pulse border h-full rounded-2xl">
            <div className="flex items-start justify-between mb-4">
                <div className="relative">
                    <div className="p-4 rounded-xl bg-muted shadow-sm">
                        <Skeleton className="h-7 w-7 rounded-md" />
                    </div>
                    <div className="absolute -bottom-1 -right-1">
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 shadow-sm">
                            <Skeleton className="h-3 w-14" />
                        </Badge>
                    </div>
                </div>
                <Badge variant="outline" className="text-xs font-semibold px-2.5 py-1 bg-background/50 backdrop-blur-sm">
                    <Skeleton className="h-3 w-8" />
                </Badge>
            </div>

            <Skeleton className="h-5 w-3/4 mb-3 rounded-md" />

            <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-muted/50 border border-border/50">
                <Skeleton className="h-6 w-6 rounded-md" />
                <div className="flex-1 min-w-0">
                    <Skeleton className="h-3 w-24 mb-1" />
                    <Skeleton className="h-2 w-16" />
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs p-2 rounded-md bg-background/50">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Skeleton className="h-3 w-3 rounded-sm" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-3 w-10" />
                </div>

                <div className="flex items-center justify-between text-xs p-2 rounded-md bg-background/50">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Skeleton className="h-3 w-3 rounded-sm" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-3 w-16" />
                </div>
            </div>

            <Separator className="my-4" />

            <div className="flex items-center gap-1.5">
                <Button size="icon" variant="ghost" className="h-9 w-9">
                    <Skeleton className="h-4 w-4 rounded-sm" />
                </Button>
                <Button size="icon" variant="ghost" className="h-9 w-9">
                    <Skeleton className="h-4 w-4 rounded-sm" />
                </Button>
                <div className="flex-1" />
                <Button size="icon" variant="ghost" className="h-9 w-9">
                    <Skeleton className="h-4 w-4 rounded-sm" />
                </Button>
            </div>
        </CardContent>
    )
}
