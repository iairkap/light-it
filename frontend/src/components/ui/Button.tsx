import * as React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface ButtonProps extends HTMLMotionProps<'button'> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

export function Button({
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    children,
    ref,
    ...props
}: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
    const variants = {
        primary: 'bg-medicore-brand text-white hover:bg-medicore-brand/90',
        secondary: 'bg-medicore-light text-medicore-text-secondary hover:bg-gray-200',
        outline: 'border border-gray-200 bg-transparent hover:bg-gray-50 text-medicore-text-primary',
        ghost: 'bg-transparent hover:bg-gray-100 text-medicore-text-secondary',
        danger: 'bg-red-500 text-white hover:bg-red-600',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs font-medium',
        md: 'px-4 py-2 text-sm font-semibold',
        lg: 'px-6 py-3 text-base font-bold',
        icon: 'p-2',
    };

    return (
        <motion.button
            ref={ref}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                'inline-flex items-center justify-center rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medicore-brand disabled:pointer-events-none disabled:opacity-50',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {isLoading ? (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : null}
            {children as React.ReactNode}
        </motion.button>
    );
}

Button.displayName = 'Button';
