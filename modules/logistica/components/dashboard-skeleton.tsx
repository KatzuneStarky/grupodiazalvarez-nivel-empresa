import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
    return (
        <div className="flex-1 space-y-6 p-6">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-[250px]" />
                    <Skeleton className="h-4 w-[350px]" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-[120px]" />
                </div>
            </div>
            <Separator className="my-4" />

            <div className="space-y-6">
                {/* Metric Cards Grid Skeleton */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <Card key={i}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <Skeleton className="h-4 w-[100px]" />
                                <Skeleton className="h-4 w-4 rounded-full" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-[60px] mb-1" />
                                <Skeleton className="h-3 w-[80px]" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Charts Grid Skeleton */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="col-span-1">
                        <CardHeader>
                            <Skeleton className="h-6 w-[150px] mb-2" />
                            <Skeleton className="h-4 w-[200px]" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-[300px] w-full" />
                        </CardContent>
                    </Card>
                    <Card className="col-span-1">
                        <CardHeader>
                            <Skeleton className="h-6 w-[150px] mb-2" />
                            <Skeleton className="h-4 w-[200px]" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-[300px] w-full" />
                        </CardContent>
                    </Card>
                </div>

                {/* Map Card Skeleton */}
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-[150px] mb-2" />
                        <Skeleton className="h-4 w-[250px]" />
                    </CardHeader>
                    <CardContent className="p-0 sm:p-6">
                        <Skeleton className="h-[400px] w-full rounded-md" />
                    </CardContent>
                </Card>

                {/* Recent Trips Table Skeleton */}
                <div className="space-y-4">
                    <Skeleton className="h-8 w-[200px]" />
                    <div className="rounded-md border">
                        <div className="h-12 border-b px-4 flex items-center gap-4">
                            <Skeleton className="h-4 w-full" />
                        </div>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-16 border-b px-4 flex items-center gap-4">
                                <Skeleton className="h-4 w-full" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Tables Grid Skeleton */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-[150px]" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-[300px] w-full" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-[150px]" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-[300px] w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
