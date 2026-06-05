import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useToastStore, type ToastType } from '@stores/toast-store';

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={16} />,
  error:   <XCircle size={16} />,
  info:    <Info size={16} />,
  warning: <AlertTriangle size={16} />,
};

export function Toaster() {
  const { toasts, dismiss } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="nx-toaster" role="region" aria-label="Notifications">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`nx-toast nx-toast-${t.type}${t.exiting ? ' exiting' : ''}`}
          role="alert"
        >
          <span className="nx-toast-icon">{ICONS[t.type]}</span>
          <div className="nx-toast-body">
            <div className="nx-toast-title">{t.title}</div>
            {t.message && <div className="nx-toast-message">{t.message}</div>}
          </div>
          <button
            type="button"
            className="nx-toast-close"
            onClick={() => dismiss(t.id)}
            aria-label="Fermer"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
