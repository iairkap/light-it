import type { ReactNode } from 'react';
import type { SortOption } from '../../components/SortControl';
import { DashboardHeader } from '../DashboardHeader';

interface MainLayoutProps {
    children: ReactNode;
    headerProps: {
        onAddPatient: () => void;
        searchQuery: string;
        onSearchChange: (query: string) => void;
        currentSort: SortOption;
        onSortChange: (option: SortOption) => void;
    };
    isPending?: boolean;
}

export function MainLayout({ children, headerProps, isPending }: MainLayoutProps) {
    return (
        <>
            <DashboardHeader
                onAddPatient={headerProps.onAddPatient}
                searchQuery={headerProps.searchQuery}
                onSearchChange={headerProps.onSearchChange}
                currentSort={headerProps.currentSort}
                onSortChange={headerProps.onSortChange}
            />
            {/* Show a small indicator if a search transition is happening */}
            {isPending && (
                <div className="fixed top-0 left-0 w-full h-1 bg-medicore-brand animate-pulse z-50" />
            )}

            <div className="max-w-6xl mx-auto w-full px-4 pb-20">
                <main className="mt-8">
                    {children}
                </main>
            </div>

            <footer className="mt-auto py-10 border-t border-gray-200/50 text-center">
                <div className="max-w-6xl mx-auto px-4 flex justify-between items-center text-xs text-gray-400 font-medium">
                    <p>© 2026 HealthTech Solutions. All rights reserved.</p>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-medicore-brand">Help Center</a>
                        <a href="#" className="hover:text-medicore-brand">Privacy Policy</a>
                    </div>
                </div>
            </footer>
        </>
    );
}
