import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function EquipoCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
                        <div className="space-y-2">
                            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-6 w-11 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                </div>

                <div className="flex gap-2">
                    <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
                    <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded animate-pulse" />
                </div>

                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                </div>

                <div className="flex gap-2">
                    <div className="h-10 flex-1 bg-gray-200 rounded animate-pulse" />
                    <div className="h-10 w-10 bg-gray-200 rounded animate-pulse" />
                </div>
            </CardContent>
        </Card>
    )
}