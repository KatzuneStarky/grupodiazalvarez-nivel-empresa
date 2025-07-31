import { Spinner } from "../global/spinner"
import { Skeleton } from "../ui/skeleton"

interface LoadingStateProps {
    message?: string
}

export function LoadingState({ message = 'Cargando...' }: LoadingStateProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md mx-auto flex flex-col items-center">
                <Spinner className="mb-4" />

                <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-8">
                    {message}
                </p>

                <div className="w-full space-y-4">
                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mt-4">
                        <Skeleton className="h-8 w-3/4 mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                    <Skeleton className="h-10 w-full rounded-md mt-4" />
                </div>
            </div>
        </div>
    )
}