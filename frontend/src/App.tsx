import { useDashboard } from './hooks/useDashboard';
import { ThemeProvider } from './context/ThemeContext';
import { MainLayout } from './components/layout/MainLayout';
import { PatientDashboard } from './features/patients/PatientDashboard';

export default function App() {
  const dashboard = useDashboard();

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-medicore-light flex flex-col transition-colors duration-300">
        <title>MediCore - Patient Registration Challenge</title>
        <meta name="description" content="Medical Patient Registration System - Full Stack Challenge" />
        <link rel="icon" href="/favicon.png" />

        <MainLayout
          headerProps={{
            onAddPatient: dashboard.handleAddPatient,
            searchQuery: dashboard.searchQuery,
            onSearchChange: dashboard.setSearchQuery,
            currentSort: dashboard.sortOption,
            onSortChange: dashboard.handleSortChange
          }}
          isPending={dashboard.isPending}
        >
          <PatientDashboard dashboard={dashboard} />
        </MainLayout>
      </div>
    </ThemeProvider>
  );
}
