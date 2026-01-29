import { Search, Plus } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { ThemeToggle } from './ThemeToggle';
import { SortControl, type SortOption } from './SortControl';

interface DashboardHeaderProps {
    onAddPatient: () => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    currentSort: SortOption;
    onSortChange: (option: SortOption) => void;
}

export function DashboardHeader({
    onAddPatient,
    searchQuery,
    onSearchChange,
    currentSort,
    onSortChange,
}: DashboardHeaderProps) {
    return (
        <div className="w-full bg-white border-b border-gray-100 shadow-sm transition-all duration-300">
            <div className="max-w-6xl mx-auto px-4">
                <header className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-10">
                        <div className="flex items-center gap-2 group cursor-pointer">
                            <div className="w-8 h-8 bg-medicore-details rounded-lg flex items-center justify-center text-white shadow-lg shadow-medicore-details/20 group-hover:scale-110 transition-transform">
                                <Plus className="w-5 h-5 rotate-45" />
                            </div>
                            <span className="text-xl font-black text-medicore-text-primary tracking-tight">
                                MediCore<span className="text-medicore-details">.</span>
                            </span>
                        </div>

                        <nav className="hidden lg:flex items-center gap-8 text-sm font-bold">
                            <a href="#" className="text-medicore-text-primary border-b-2 border-medicore-brand pb-1">Patients</a>
                            <div className="flex items-center gap-1.5 opacity-40 cursor-not-allowed group relative">
                                <span className="text-medicore-text-secondary">Appointments</span>
                                <span className="text-[8px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md uppercase tracking-tighter">Soon</span>
                            </div>
                            <div className="flex items-center gap-1.5 opacity-40 cursor-not-allowed group relative">
                                <span className="text-medicore-text-secondary">Staff</span>
                                <span className="text-[8px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md uppercase tracking-tighter">Soon</span>
                            </div>
                            <div className="flex items-center gap-1.5 opacity-40 cursor-not-allowed group relative">
                                <span className="text-medicore-text-secondary">Analytics</span>
                                <span className="text-[8px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md uppercase tracking-tighter">Soon</span>
                            </div>
                        </nav>
                    </div>


                    <div className="flex items-center gap-3 sm:gap-4">
                        <ThemeToggle />
                        <Button
                            onClick={onAddPatient}
                            className="rounded-2xl shadow-lg shadow-medicore-brand/20 px-3 sm:px-6 h-11"
                        >
                            <Plus className="w-5 h-5 sm:mr-2" />
                            <span className="hidden sm:inline font-black text-xs uppercase tracking-wider">Add Patient</span>
                        </Button>
                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-medicore-brand to-medicore-blue rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm border-2 border-white shadow-md">
                            DR
                        </div>
                    </div>
                </header>

                <div className="py-8 sm:py-10">
                    <h1 className="text-3xl sm:text-5xl font-black text-medicore-text-primary tracking-tighter">
                        Patient <span className="text-medicore-brand">Dashboard</span>
                    </h1>
                    <p className="text-sm sm:text-lg text-medicore-text-secondary mt-2 font-medium max-w-2xl">
                        A centralized HUB for managing patient records, clinical history, and administrative clinical workflows with real-time scaling.
                    </p>
                </div>

                <div className="flex flex-col sm:grid sm:grid-cols-[1fr,auto] gap-4 items-stretch sm:items-center pb-8">
                    <div className="relative group">
                        <Input
                            placeholder="Find records by name, email or ID..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            icon={<Search className="w-5 h-5 group-focus-within:text-medicore-brand transition-colors" />}
                            className="rounded-2xl border-none bg-medicore-light shadow-inner-sm focus:bg-white focus:ring-4 transition-all h-14"
                        />
                    </div>
                    <SortControl currentSort={currentSort} onSortChange={onSortChange} />
                </div>
            </div>
        </div>
    );
}
