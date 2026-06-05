import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  exiting?: boolean;
}

interface ToastState {
  toasts: Toast[];
  show: (toast: Omit<Toast, 'id'>) => string;
  dismiss: (id: string) => void;
  _startExit: (id: string) => void;
}

let counter = 0;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  show: (toast) => {
    const id = `toast-${++counter}`;
    const duration = toast.duration ?? 4000;
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));

    if (duration > 0) {
      setTimeout(() => get()._startExit(id), duration);
    }
    return id;
  },

  _startExit: (id) => {
    set((s) => ({
      toasts: s.toasts.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
    }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 220);
  },

  dismiss: (id) => get()._startExit(id),
}));

/** Convenience helpers */
export const toast = {
  success: (title: string, message?: string) =>
    useToastStore.getState().show({ type: 'success', title, message }),
  error: (title: string, message?: string) =>
    useToastStore.getState().show({ type: 'error', title, message }),
  info: (title: string, message?: string) =>
    useToastStore.getState().show({ type: 'info', title, message }),
  warning: (title: string, message?: string) =>
    useToastStore.getState().show({ type: 'warning', title, message }),
};
