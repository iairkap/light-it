import { useEffect } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Upload, X } from 'lucide-react';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { useRegisterForm } from '../hooks/useRegisterForm';
import type { Patient } from '../types/patient';
import { SubmitButton } from './ui/SubmitButton';

interface RegisterFormProps {
    onSuccess: (patient?: Patient) => void;
    onCancel: () => void;
    onOptimisticUpdate?: (patient: Patient) => void;
}

export function RegisterForm({ onSuccess, onCancel, onOptimisticUpdate }: RegisterFormProps) {
    const {
        state,
        formAction,
        isPending,
        preview,
        isDragging,
        fileInputRef,
        onDrop,
        onDragOver,
        onDragLeave,
        setPreview,
        handleFileChange,
        formValues,
        handleChange
    } = useRegisterForm();

    // React 19 Action outcome
    useEffect(() => {
        if (state.success) {
            onSuccess(state.patient);
        }
    }, [state.success, onSuccess, state.patient]);

    const handleSubmit = (formData: FormData) => {
        if (onOptimisticUpdate) {
            const optimisticPatient = {
                id: Math.random().toString(),
                fullName: formValues.fullName,
                email: formValues.email,
                phoneCountryCode: formValues.phoneCountryCode,
                phoneNumber: formValues.phoneNumber,
                documentPhotoUrl: preview || '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            onOptimisticUpdate(optimisticPatient);
        }

        formAction(formData);
    };

    return (
        <form action={handleSubmit} className="space-y-6">
            <fieldset disabled={isPending} className="contents group">
                <div className="grid gap-6 sm:grid-cols-2">
                    <Input
                        name="fullName"
                        label="Full Name"
                        placeholder="e.g. John Doe"
                        value={formValues.fullName}
                        onChange={handleChange}
                        error={state.errors?.fullName}
                    // disabled={isPending} // Handled by fieldset
                    />
                    <Input
                        name="email"
                        label="Email Address"
                        placeholder="e.g. john@gmail.com"
                        type="email"
                        value={formValues.email}
                        onChange={handleChange}
                        error={state.errors?.email}
                    // disabled={isPending}
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-medicore-text-secondary">
                        Phone Number
                    </label>
                    <div className="flex gap-2">
                        <select
                            name="phoneCountryCode"
                            className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm focus:border-medicore-brand focus:outline-none focus:ring-2 focus:ring-medicore-brand/10 disabled:opacity-50"
                            value={formValues.phoneCountryCode}
                            onChange={handleChange}
                        // disabled={isPending}
                        >
                            <option value="+54">+54</option>
                            <option value="+1">+1</option>
                            <option value="+34">+34</option>
                            <option value="+52">+52</option>
                        </select>
                        <Input
                            name="phoneNumber"
                            placeholder="11 1234-5678"
                            className="flex-1"
                            value={formValues.phoneNumber}
                            onChange={handleChange}
                            error={state.errors?.phoneNumber}
                        // disabled={isPending}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-medicore-text-secondary">
                        Document Photo (.jpg)
                    </label>
                    <div
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onClick={() => !isPending && fileInputRef.current?.click()}
                        className={cn(
                            'relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-8 transition-all hover:bg-gray-50 cursor-pointer',
                            isDragging && 'border-medicore-brand bg-medicore-brand/5 scale-[1.01]',
                            state.errors?.file && 'border-red-500 bg-red-50',
                            isPending && 'opacity-50 cursor-not-allowed pointer-events-none'
                        )}
                    >
                        <input
                            name="documentPhoto"
                            type="file"
                            className="hidden"
                            accept="image/jpeg"
                            ref={fileInputRef}
                            onChange={e => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                        />
                        {preview ? (
                            <div className="relative group">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="h-32 w-48 rounded-lg object-cover shadow-md"
                                />
                                <button
                                    type="button"
                                    onClick={e => {
                                        e.stopPropagation();
                                        // Manually clear input
                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                        setPreview(null);
                                    }}
                                    disabled={isPending}
                                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-lg transition-transform group-hover:scale-110 disabled:opacity-50"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="mb-3 rounded-full bg-white p-3 shadow-sm">
                                    <Upload className="h-6 w-6 text-medicore-brand" />
                                </div>
                                <p className="text-sm font-medium text-medicore-text-primary">
                                    {isDragging ? 'Drop to upload' : 'Click or drag to upload'}
                                </p>
                                <p className="mt-1 text-xs text-medicore-text-secondary">
                                    JPEG images only, max 5MB
                                </p>
                            </>
                        )}
                    </div>
                    {state.errors?.file && (
                        <p className="text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
                            {state.errors.file}
                        </p>
                    )}
                </div>

                <AnimatePresence>
                    {state.errors?.submit && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600"
                        >
                            {state.errors.submit}
                        </motion.div>
                    )}
                </AnimatePresence>
            </fieldset>

            <div className="flex gap-3 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={onCancel}
                    disabled={isPending}
                >
                    Cancel
                </Button>
                <SubmitButton className="flex-1">
                    Complete Registration
                </SubmitButton>
            </div>
        </form>
    );
}
