import { Suspense, use, useOptimistic, useRef } from 'react';
import { PatientCard } from '../../components/PatientCard';
import { SkeletonList } from '../../components/SkeletonList';
import { EmptyState } from '../../components/EmptyState';
import { Modal } from '../../components/ui/Modal';
import { Pagination } from '../../components/ui/Pagination';
import { RegisterForm } from '../../components/RegisterForm';
import { SuccessModal } from '../../components/SuccessModal';
import { useDashboard } from '../../hooks/useDashboard';
import type { Patient, PaginatedResponse } from '../../types/patient';
import type { SortOption } from '../../components/SortControl';

// Inner component to consume the promise with use()
function PatientList({
    patientsPromise,
    expandedId,
    togglePatientExpansion,
    onAddPatient,
    onPageChange,
    setOptimisticUpdater,
    sortOption,
}: {
    patientsPromise: Promise<PaginatedResponse<Patient>>;
    expandedId: string | null;
    togglePatientExpansion: (id: string) => void;
    onAddPatient: () => void;
    onPageChange: (page: number) => void;
    setOptimisticUpdater: (updater: (patient: Patient) => void) => void;
    sortOption: SortOption;
}) {
    const { data, meta } = use(patientsPromise);

    const [optimisticPatients, addOptimisticPatient] = useOptimistic(
        data,
        (state: Patient[], newPatient: Patient) => {
            const newList = [...state, newPatient];

            return newList.sort((a, b) => {
                switch (sortOption) {
                    case 'nameAsc':
                        return a.fullName.toLowerCase().localeCompare(b.fullName.toLowerCase());
                    case 'nameDesc':
                        return b.fullName.toLowerCase().localeCompare(a.fullName.toLowerCase());
                    case 'oldest':
                        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                    case 'newest':
                    default:
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                }
            });
        }
    );

    setOptimisticUpdater(addOptimisticPatient);

    if (optimisticPatients.length === 0) {
        return (
            <div className="space-y-4">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">No patients found</h2>
                <EmptyState onAddPatient={onAddPatient} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                    Active Patients ({meta.totalItems})
                </h2>
                <span className="text-xs font-bold text-medicore-text-primary bg-medicore-details/80 px-2 py-0.5 rounded-full">
                    Showing {optimisticPatients.length} of {meta.totalItems}
                </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {optimisticPatients.map(patient => (
                    <PatientCard
                        key={patient.id}
                        patient={patient}
                        isExpanded={expandedId === patient.id}
                        onToggle={() => togglePatientExpansion(patient.id)}
                    />
                ))}
            </div>

            <Pagination
                currentPage={meta.currentPage}
                totalPages={meta.totalPages}
                onPageChange={onPageChange}
            />
        </div>
    );
}

export function PatientDashboard({
    dashboard
}: {
    dashboard: ReturnType<typeof useDashboard>;
}) {
    const {
        patientsPromise,
        expandedId,
        togglePatientExpansion,
        handleAddPatient,
        handlePageChange,
        isRegisterModalOpen,
        setIsRegisterModalOpen,
        showSuccess,
        setShowSuccess,
        handleRegisterSuccess,
        sortOption
    } = dashboard;

    const addOptimisticPatientRef = useRef<((patient: Patient) => void) | null>(null);

    const handleOptimisticAdd = (patient: Patient) => {
        if (addOptimisticPatientRef.current) {
            addOptimisticPatientRef.current(patient);
        }
    };

    return (
        <>
            <Suspense fallback={
                <div className="space-y-4">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Loading Records...</h2>
                    <SkeletonList />
                </div>
            }>
                <PatientList
                    patientsPromise={patientsPromise}
                    expandedId={expandedId}
                    togglePatientExpansion={togglePatientExpansion}
                    onAddPatient={handleAddPatient}
                    onPageChange={handlePageChange}
                    setOptimisticUpdater={(updater) => { addOptimisticPatientRef.current = updater; }}
                    sortOption={sortOption}
                />
            </Suspense>

            <Modal
                isOpen={isRegisterModalOpen}
                onClose={() => setIsRegisterModalOpen(false)}
                title="Register New Patient"
            >
                <RegisterForm
                    onSuccess={handleRegisterSuccess}
                    onOptimisticUpdate={handleOptimisticAdd}
                    onCancel={() => setIsRegisterModalOpen(false)}
                />
            </Modal>

            <Modal
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
            >
                <SuccessModal onClose={() => setShowSuccess(false)} />
            </Modal>
        </>
    );
}
