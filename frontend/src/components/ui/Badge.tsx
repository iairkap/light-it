import * as React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'success' | 'warning' | 'info' | 'outline' | 'neutral';
}

export function Badge({ className, variant = 'neutral', ...props }: BadgeProps) {
    const variants = {
        success: 'bg-green-100 text-green-700',
        warning: 'bg-amber-100 text-amber-700',
        info: 'bg-medicore-brand/10 text-medicore-brand',
        outline: 'border border-gray-200 text-medicore-text-secondary',
        neutral: 'bg-gray-100 text-medicore-text-secondary',
    };

    return (
        <div
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
                variants[variant],
                className
            )}
            {...props}
        />
    );
}
