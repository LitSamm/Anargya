'use client';

import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CircleCheck, Info, TriangleAlert, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 animate-in slide-in-from-right-5 ${
              isSuccess
                ? 'bg-secondary-dark/95 border-main-green/40 text-white shadow-neon-green-sm'
                : isWarning
                ? 'bg-secondary-dark/95 border-main-red/40 text-white shadow-neon-red'
                : 'bg-secondary-dark/95 border-white/20 text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              {isSuccess && <CircleCheck className="h-5 w-5 shrink-0 text-main-green" aria-hidden="true" />}
              {isWarning && <TriangleAlert className="h-5 w-5 shrink-0 text-main-red" aria-hidden="true" />}
              {!isSuccess && !isWarning && <Info className="h-5 w-5 shrink-0 text-electric-cyan" aria-hidden="true" />}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors ml-2"
              aria-label="Close notification"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
