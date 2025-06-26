import { toast } from '@/hooks/use-toast';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

/**
 * Show a toast notification with consistent styling
 */
export const showToast = (type: ToastType, message: string, options: ToastOptions = {}) => {
  const { title, description, variant } = options;
  
  const defaultTitles = {
    success: 'Success!',
    error: 'Error',
    warning: 'Warning',
    info: 'Info'
  };

  const defaultVariants = {
    success: 'default' as const,
    error: 'destructive' as const,
    warning: 'default' as const,
    info: 'default' as const
  };

  toast({
    title: title || defaultTitles[type],
    description: description || message,
    variant: variant || defaultVariants[type],
  });
};

/**
 * Show success toast
 */
export const showSuccessToast = (message: string, options?: ToastOptions) => {
  showToast('success', message, options);
};

/**
 * Show error toast
 */
export const showErrorToast = (message: string, options?: ToastOptions) => {
  showToast('error', message, options);
};

/**
 * Show warning toast
 */
export const showWarningToast = (message: string, options?: ToastOptions) => {
  showToast('warning', message, options);
};

/**
 * Show info toast
 */
export const showInfoToast = (message: string, options?: ToastOptions) => {
  showToast('info', message, options);
};

/**
 * Show API error toast with consistent error handling
 */
export const showApiErrorToast = (error: unknown, fallbackMessage = 'An error occurred') => {
  const errorMessage = error instanceof Error ? error.message : fallbackMessage;
  showErrorToast(errorMessage);
};

/**
 * Show loading toast (for operations that take time)
 */
export const showLoadingToast = (message: string) => {
  toast({
    title: 'Loading...',
    description: message,
  });
}; 