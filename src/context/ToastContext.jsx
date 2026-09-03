import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, Sparkles, X } from 'lucide-react';

export const ToastContext = createContext({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
  success: () => {},
  error: () => {},
  warning: () => {},
  info: () => {},
  ai: () => {},
});

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type = 'info', title, message, duration = 4000, action }) => {
      const id = Date.now() + Math.random().toString(36).substr(2, 5);

      const newToast = { id, type, title, message, duration, action };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const success = useCallback((message, title = 'Sucesso', action) => {
    return addToast({ type: 'success', title, message, action });
  }, [addToast]);

  const error = useCallback((message, title = 'Erro', action) => {
    return addToast({ type: 'error', title, message, duration: 6000, action });
  }, [addToast]);

  const warning = useCallback((message, title = 'Atenção', action) => {
    return addToast({ type: 'warning', title, message, duration: 5000, action });
  }, [addToast]);

  const info = useCallback((message, title = 'Informação', action) => {
    return addToast({ type: 'info', title, message, action });
  }, [addToast]);

  const ai = useCallback((message, title = 'TattOS AI Insights', action) => {
    return addToast({ type: 'ai', title, message, duration: 6000, action });
  }, [addToast]);

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          border: 'border-emerald-700/80',
          bg: 'bg-neutral-950/95',
          glow: 'shadow-[0_4px_20px_rgba(16,185,129,0.2)]',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
          accent: 'bg-emerald-500',
        };
      case 'error':
        return {
          border: 'border-cyber-red/80',
          bg: 'bg-neutral-950/95',
          glow: 'shadow-[0_4px_20px_rgba(138,3,3,0.3)]',
          icon: <AlertCircle className="w-4 h-4 text-cyber-red shrink-0" />,
          accent: 'bg-cyber-red',
        };
      case 'warning':
        return {
          border: 'border-amber-700/80',
          bg: 'bg-neutral-950/95',
          glow: 'shadow-[0_4px_20px_rgba(245,158,11,0.2)]',
          icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
          accent: 'bg-amber-400',
        };
      case 'ai':
        return {
          border: 'border-chrome/70',
          bg: 'bg-neutral-950/95',
          glow: 'shadow-[0_4px_20px_rgba(192,192,192,0.25)]',
          icon: <Sparkles className="w-4 h-4 text-chrome shrink-0 animate-pulse" />,
          accent: 'bg-gradient-to-r from-chrome via-white to-chrome',
        };
      default:
        return {
          border: 'border-neutral-700',
          bg: 'bg-neutral-950/95',
          glow: 'shadow-lg',
          icon: <Info className="w-4 h-4 text-neutral-300 shrink-0" />,
          accent: 'bg-neutral-400',
        };
    }
  };

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info,
        ai,
      }}
    >
      {children}

      {/* Floating Toast Notification Container (Google M3 Snackbar Ergonomics) */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none sm:max-w-md"
      >
        {toasts.map((toast) => {
          const style = getToastStyles(toast.type);
          return (
            <div
              key={toast.id}
              role="alert"
              className={`pointer-events-auto relative overflow-hidden rounded-sm border ${style.border} ${style.bg} ${style.glow} p-4 backdrop-blur-md transition-all duration-300 animate-slide-in-right flex flex-col gap-1.5`}
            >
              {/* Linha de progresso / acento visual */}
              <div className={`absolute top-0 inset-x-0 h-[2px] ${style.accent}`} />

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5">{style.icon}</div>
                  <div>
                    {toast.title && (
                      <h4 className="text-xs font-mono font-bold tracking-wide text-white uppercase">
                        {toast.title}
                      </h4>
                    )}
                    <p className="text-xs font-sans text-neutral-300 mt-0.5 leading-relaxed">
                      {toast.message}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-neutral-500 hover:text-white p-1 rounded transition-colors shrink-0"
                  title="Fechar notificação"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Botão de Ação Opcional (Undo / View) */}
              {toast.action && (
                <div className="mt-1 flex justify-end">
                  <button
                    onClick={() => {
                      toast.action.onClick();
                      removeToast(toast.id);
                    }}
                    className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 text-chrome hover:text-white border border-neutral-700 transition-colors"
                  >
                    {toast.action.label}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
