import { Card } from './ui/Card';

export function SkeletonList() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <Card key={i} className="p-5 animate-pulse">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-1/4" />
                            <div className="h-3 bg-gray-100 rounded w-1/2" />
                            <div className="flex gap-2 mt-2">
                                <div className="h-4 bg-gray-100 rounded-full w-20" />
                                <div className="h-4 bg-gray-100 rounded-full w-16" />
                            </div>
                        </div>
                        <div className="w-5 h-5 bg-gray-100 rounded" />
                    </div>
                </Card>
            ))}
        </div>
    );
}
