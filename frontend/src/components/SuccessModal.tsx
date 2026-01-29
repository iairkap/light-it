import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Button } from './ui/Button';

interface SuccessModalProps {
    onClose: () => void;
}

export function SuccessModal({ onClose }: SuccessModalProps) {
    return (
        <div className="flex flex-col items-center text-center py-8">
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.1
                }}
                className="mb-6 rounded-full bg-green-50 p-6"
            >
                <CheckCircle2 className="h-16 w-16 text-green-500" />
            </motion.div>

            <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-2 text-2xl font-bold text-medicore-text-primary"
            >
                Registration Successful!
            </motion.h3>

            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8 text-medicore-text-secondary"
            >
                The patient has been registered successfully. A confirmation email has been sent to their inbox.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full"
            >
                <Button onClick={onClose} className="w-full py-6">
                    Back to Dashboard
                </Button>
            </motion.div>
        </div>
    );
}
