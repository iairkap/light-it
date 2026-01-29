import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export function Card({ children, className }: CardProps) {
    return (
        <div className={cn('bg-white rounded-2xl border border-gray-100 shadow-medicore-card overflow-hidden', className)}>
            {children}
        </div>
    );
}

interface ExpandableCardProps {
    header: React.ReactNode;
    children: React.ReactNode;
    isExpanded?: boolean;
    onToggle?: () => void;
    className?: string;
}

export function ExpandableCard({
    header,
    children,
    isExpanded,
    onToggle,
    className,
}: ExpandableCardProps) {
    return (
        <Card className={cn('transition-all duration-300', className)}>
            <div
                className="p-5 cursor-pointer flex items-center justify-between"
                onClick={onToggle}
            >
                <div className="flex-1">{header}</div>
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="text-gray-400"
                >
                    <ChevronDown className="w-5 h-5" />
                </motion.div>
            </div>

            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <div className="px-5 pb-6 border-t border-gray-50 pt-4">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
}
