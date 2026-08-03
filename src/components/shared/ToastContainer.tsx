import React from 'react';
import { useToast } from '../../contexts/ToastContext';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((toast) => {
        let Icon = Info;
        let bgColor = 'bg-white';
        let iconColor = 'text-blue-500';
        let borderColor = 'border-blue-100';

        if (toast.type === 'success') {
          Icon = CheckCircle;
          iconColor = 'text-green-500';
          borderColor = 'border-green-100';
        } else if (toast.type === 'error') {
          Icon = XCircle;
          iconColor = 'text-red-500';
          borderColor = 'border-red-100';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          iconColor = 'text-yellow-500';
          borderColor = 'border-yellow-100';
        }

        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-xl shadow-lg border ${bgColor} ${borderColor} transform transition-all duration-300 translate-y-0 opacity-100`}
          >
            <Icon className={`w-5 h-5 shrink-0 ${iconColor}`} />
            <div className="flex-1 text-sm font-medium text-slate-800">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
