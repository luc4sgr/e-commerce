import { toast,ToasterProps  } from 'sonner';

type SonnerToastOptions = ToasterProps & {
  duration?: number;
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
  className?: string;
  descriptionClassName?: string;
};

const defaultOptions: SonnerToastOptions = {
  duration: 5000,
  position: 'top-right',
  className: 'toast-custom',
};

export const notificationService = {
  
  success(message: string, description?: string, options?: SonnerToastOptions) {
    return toast.success(message, {
      ...defaultOptions,
      ...options,
      description,
    });
  },
  
  error(message: string, description?: string, options?: SonnerToastOptions) {
    return toast.error(message, {
      ...defaultOptions,
      ...options,
      description,
    });
  },
  

  warning(message: string, description?: string, options?: SonnerToastOptions) {
    return toast.warning(message, {
      ...defaultOptions,
      ...options,
      description,
    });
  },

  info(message: string, description?: string, options?: SonnerToastOptions) {
    return toast.info(message, {
      ...defaultOptions,
      ...options,
      description,
    });
  },

  default(message: string, description?: string, options?: SonnerToastOptions) {
    return toast(message, {
      ...defaultOptions,
      ...options,
      description,
    });
  },
  
  action(message: string, description: string, actionText: string, action: () => void, options?: SonnerToastOptions) {
    return toast(message, {
      ...defaultOptions,
      ...options,
      description,
      action: {
        label: actionText,
        onClick: action,
      },
    });
  },
  
  promise<T>(
    promise: Promise<T>, 
    options?: {
      loading?: string;
      success?: string | ((data: T) => string);
      error?: string | ((error: unknown) => string);
      duration?: number;
      position?: SonnerToastOptions['position'];
    }
  ) {
    return toast.promise(promise, {
      loading: options?.loading || 'Processando...',
      success: options?.success || 'Operação concluída com sucesso',
      error: options?.error || 'Ocorreu um erro ao processar a solicitação',
      duration: options?.duration || defaultOptions.duration,
      position: options?.position || defaultOptions.position,
    });
  },

  dismiss() {
    toast.dismiss();
  },
  
  dismissToast(id: string | number) {
    toast.dismiss(id);
  }
};