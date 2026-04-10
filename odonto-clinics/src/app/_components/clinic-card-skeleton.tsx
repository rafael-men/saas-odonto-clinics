export function ClinicCardSkeleton() {
    return (
        <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
            <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-100" />
            <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 rounded-full w-3/4" />
                        <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                        <div className="h-3 bg-gray-100 rounded-full w-2/5" />
                    </div>
                    <div className="w-3 h-3 rounded-full bg-gray-200 mt-1" />
                </div>
                <div className="h-9 bg-gray-200 rounded-lg w-full mt-2" />
            </div>
        </div>
    );
}

export function ClinicGridSkeleton({ count = 4 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: count }).map((_, i) => (
                <ClinicCardSkeleton key={i} />
            ))}
        </div>
    );
}
