import { toast, ToastOptions } from 'react-toastify';

type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

interface UseToast {
  successToast: (message: string, position?: ToastPosition) => void;
  errorToast: (message: string, position?: ToastPosition) => void;
  infoToast: (message: string, position?: ToastPosition) => void;
  warningToast: (message: string, position?: ToastPosition) => void;
}

export const useToast = (): UseToast => {
  const showToast = (type: 'success' | 'error' | 'info' | 'warning', message: string, position: ToastPosition = 'top-center') => {
    const options: ToastOptions = {
      position,
      autoClose: 2000, // Auto close after 2 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    };

    toast[type](message, options);
  };

  return {
    successToast: (message, position) => showToast('success', message, position),
    errorToast: (message, position) => showToast('error', message, position),
    infoToast: (message, position) => showToast('info', message, position),
    warningToast: (message, position) => showToast('warning', message, position),
  };
};