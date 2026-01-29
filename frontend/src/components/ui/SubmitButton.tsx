import { useFormStatus } from 'react-dom';
import { Button, type ButtonProps } from './Button';

type SubmitButtonProps = Omit<ButtonProps, 'isLoading' | 'type'> & {
    loadingText?: string;
};

export function SubmitButton({ children, loadingText = 'Submitting...', ...props }: SubmitButtonProps) {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            isLoading={pending}
            disabled={pending}
            {...props}
        >
            {pending ? loadingText : children}
        </Button>
    );
}
