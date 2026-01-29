import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 py-4">
            {/* Previous Button */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-9 w-9 p-0"
                aria-label="Previous Page"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Desktop View: Page Numbers */}
            <div className="hidden sm:flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                        key={page}
                        variant={currentPage === page ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => onPageChange(page)}
                        className={`h-9 w-9 p-0 font-medium ${currentPage === page
                                ? 'bg-medicore-brand text-white hover:bg-medicore-brand/90'
                                : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        {page}
                    </Button>
                ))}
            </div>

            {/* Mobile View: Page X of Y */}
            <div className="flex sm:hidden items-center px-2 text-sm font-medium text-gray-600">
                Page {currentPage} of {totalPages}
            </div>

            {/* Next Button */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-9 w-9 p-0"
                aria-label="Next Page"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
