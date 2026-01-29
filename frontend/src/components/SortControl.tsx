import { ArrowDownAZ, ArrowUpZA, CalendarArrowDown, CalendarArrowUp } from 'lucide-react';
import { cn } from '../utils/cn';

export type SortOption = 'newest' | 'oldest' | 'nameAsc' | 'nameDesc';

interface SortControlProps {
    currentSort: SortOption;
    onSortChange: (option: SortOption) => void;
}

export function SortControl({ currentSort, onSortChange }: SortControlProps) {
    const options: { id: SortOption; label: string; icon: React.ReactNode }[] = [
        { id: 'newest', label: 'Newest First', icon: <CalendarArrowDown className="w-4 h-4" /> },
        { id: 'oldest', label: 'Oldest First', icon: <CalendarArrowUp className="w-4 h-4" /> },
        { id: 'nameAsc', label: 'Name (A-Z)', icon: <ArrowDownAZ className="w-4 h-4" /> },
        { id: 'nameDesc', label: 'Name (Z-A)', icon: <ArrowUpZA className="w-4 h-4" /> },
    ];

    return (
        <div className="flex bg-white rounded-2xl shadow-sm border border-gray-100 p-1">
            {options.map((option) => (
                <button
                    key={option.id}
                    onClick={() => onSortChange(option.id)}
                    className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all",
                        currentSort === option.id
                            ? "bg-medicore-brand text-white shadow-md"
                            : "text-medicore-text-secondary hover:bg-gray-50 hover:text-medicore-text-primary"
                    )}
                    title={option.label}
                >
                    {option.icon}
                    <span className="hidden sm:inline">{option.label}</span>
                </button>
            ))}
        </div>
    );
}
