import * as React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export function Input({ className, label, error, icon, type, ref, ...props }: InputProps & { ref?: React.Ref<HTMLInputElement> }) {
    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label className="text-sm font-medium text-medicore-text-secondary">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    className={cn(
                        'flex h-11 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm transition-all focus:border-medicore-brand focus:outline-none focus:ring-2 focus:ring-medicore-brand/10 disabled:cursor-not-allowed disabled:opacity-50',
                        icon && 'pl-10',
                        error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </div>
    );
}

Input.displayName = 'Input';
