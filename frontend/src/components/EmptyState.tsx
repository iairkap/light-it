import { Button } from './ui/Button';
import { UserMinus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
    onAddPatient: () => void;
}

export function EmptyState({ onAddPatient }: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100 shadow-sm"
        >
            <div className="w-20 h-20 bg-medicore-light rounded-full flex items-center justify-center mb-6">
                <UserMinus className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-medicore-text-primary mb-2">No patients found</h3>
            <p className="text-medicore-text-secondary max-w-sm mb-8">
                Get started by creating a new patient record or adjusting your search filters.
            </p>
            <Button onClick={onAddPatient} className="rounded-2xl px-8 py-3">
                <Plus className="w-5 h-5 mr-2" />
                New Patient
            </Button>
        </motion.div>
    );
}
