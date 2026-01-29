import { useState, useRef, useCallback, useActionState, useEffect } from 'react';

import type { Patient } from '../types/patient';

// Define the shape of our form state
interface FormState {
  errors?: {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    file?: string;
    submit?: string;
  };
  success?: boolean;
  patient?: Patient;
}

interface FormValues {
  fullName: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
}

import { api } from '../services/api';

const STORAGE_KEY = 'register_form_values';

// The Server Action (simulated for client-side fetch)
async function registerAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const phoneNumber = formData.get('phoneNumber') as string;
  // const phoneCountryCode = formData.get('phoneCountryCode') as string; // Unused
  const file = formData.get('documentPhoto') as File;

  // 1. Validation Logic (Server-side simulation)
  const errors: FormState['errors'] = {};
  
  if (!fullName || !fullName.trim()) {
    errors.fullName = 'Full Name is required';
  } else if (!/^[a-zA-Z\s]*$/.test(fullName)) {
    errors.fullName = 'Full Name should only accept letters';
  }

  if (!email || !email.trim()) {
    errors.email = 'Email is required';
  } else if (!email.endsWith('@gmail.com')) {
    errors.email = 'Only @gmail.com addresses are allowed';
  }

  if (!phoneNumber || !phoneNumber.trim()) errors.phoneNumber = 'Phone number is required';
  
  // File validation is tricky with FormData if empty, usually it's a File object of size 0 or name ""
  if (!file || file.size === 0 || file.name === '') {
    errors.file = 'Document photo is required';
  } else if (file.type !== 'image/jpeg') {
    errors.file = 'Only JPEG images are allowed';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, success: false };
  }

  // 2. Network Request
  try {
    const patient = await api.post<any>('/patients', formData);
    return { success: true, patient };
  } catch (error: any) {
    return { 
      errors: { submit: error.message || 'Network error occurred' }, 
      success: false 
    };
  }
}

export function useRegisterForm() {
  const initialState: FormState = { errors: {}, success: false };
  const [state, originalFormAction, isPending] = useActionState(registerAction, initialState);
  
  const [formValues, setFormValues] = useState<FormValues>(() => {
    // Lazy initialization to prevent overwriting storage on initial render
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return {
      fullName: '',
      email: '',
      phoneCountryCode: '+54',
      phoneNumber: ''
    };
  });

  // State to hold the file object for persistence
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formValues));
  }, [formValues]);

  // Clear localStorage and file state on success
  useEffect(() => {
    if (state.success) {
      localStorage.removeItem(STORAGE_KEY);
      setFormValues({
        fullName: '',
        email: '',
        phoneCountryCode: '+54',
        phoneNumber: ''
      });
      setFile(null);
      setPreview(null);
    }
  }, [state.success]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };
  
  // We still need some client-side logic for the file preview
  // because that's purely a UI concern, not data submission.
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (state.success) {
     // We Let the component handle success side effects (like closing modal)
  }

  const handleFileChange = useCallback((selectedFile: File) => {
    // Only for preview purposes now. Validation happens in the action.
    if (selectedFile.type === 'image/jpeg') {
      setFile(selectedFile); // Store file in memory
      setPreview(URL.createObjectURL(selectedFile));
    }
  }, []);

  const formAction = (payload: FormData) => {
    const submittedFile = payload.get('documentPhoto');
    const isFileMissing = !submittedFile || (submittedFile instanceof File && submittedFile.size === 0);
    
    if (isFileMissing && file) {
        payload.set('documentPhoto', file);
    }
    
    originalFormAction(payload);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    
    // We need to manually set the file input value for FormData to pick it up?
    // standard file inputs are read-only for security. Creates a DataTransfer to set it.
    if (droppedFile && fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(droppedFile);
        fileInputRef.current.files = dataTransfer.files;
        handleFileChange(droppedFile);
    }
  }, [handleFileChange]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return {
    state,
    formAction, // Now returns the wrapped smart action
    isPending,
    preview,
    isDragging,
    fileInputRef,
    formValues,     // Export controlled values
    handleChange,   // Export change handler
    handleFileChange,
    onDrop,
    onDragOver,
    onDragLeave,
    setPreview
  };
}

