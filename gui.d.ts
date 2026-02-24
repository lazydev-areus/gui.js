interface GUIConfig {
  position: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center';
  duration: number;
  maxVisible: number;
  theme: 'light' | 'dark';
}

interface ToastOptions {
  duration?: number;
  closable?: boolean;
  pauseOnHover?: boolean;
  onClick?: () => void;
  progressType?: 'shrink' | 'grow';
  action?: { text: string; onClick: () => void };
  allowHTML?: boolean;
  copyOnClick?: boolean;
  progress?: number;
}

interface FormField {
  label: string;
  name: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'checkbox';
  defaultValue?: string;
  required?: boolean;
  maxLength?: number;
  options?: { label: string; value: string }[];
  checked?: boolean;
  validation?: (value: string) => string | null;
  requiredMessage?: string;
}

interface Button {
  text: string;
  action?: () => boolean | Promise<boolean>;
  primary?: boolean;
}

interface ModalOptions {
  title?: string | HTMLElement;
  content?: string | HTMLElement;
  form?: FormField[];
  buttons?: Button[];
  closable?: boolean;
  allowHTML?: boolean;
}

declare const GUI: {
  setTheme: (theme: string) => void;
  init: (opts: Partial<GUIConfig>) => void;
  toast: {
    (message: string, options?: ToastOptions): number;
    success: (message: string, options?: ToastOptions) => number;
    error: (message: string, options?: ToastOptions) => number;
    warning: (message: string, options?: ToastOptions) => number;
    info: (message: string, options?: ToastOptions) => number;
    promise: <T>(promise: Promise<T>, messages: { loading?: string; success?: string; error?: string }) => void;
    config: (opts?: Partial<GUIConfig>) => GUIConfig;
    dismissAll: () => void;
    update: (id: number, newOptions: Partial<ToastOptions & { message?: string; type?: string }>) => void;
  };
  modal: {
    alert: (message: string, title?: string) => Promise<void>;
    confirm: (message: string, title?: string) => Promise<boolean>;
    prompt: (message: string, defaultValue?: string, title?: string) => Promise<string | null>;
    show: (options: ModalOptions) => Promise<any>;
  };
};