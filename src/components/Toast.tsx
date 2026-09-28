import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 3200);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-[#fdf0d5] shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-[#fca5a5] shrink-0" />,
    info: <Info className="w-4 h-4 text-[#fdf0d5] shrink-0" />,
  };

  const bgStyles = {
    success: 'bg-[#0c1836] border-[#1f3e6d] text-[#fdf0d5] shadow-xl',
    error: 'bg-[#221018] border-[#6b1e32] text-[#fca5a5] shadow-xl',
    info: 'bg-[#0c1836] border-[#162c54] text-[#fdf0d5] shadow-xl',
  };

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-sm transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${bgStyles[toast.type]}`}
      role="alert"
    >
      <div className="flex items-center gap-2.5">
        {icons[toast.type]}
        <span className="font-semibold text-xs md:text-sm">{toast.message}</span>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-[#fdf0d5] p-0.5 rounded transition-colors cursor-pointer"
        aria-label="Close notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
