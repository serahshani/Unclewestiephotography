'use client';

import { useCallback, useEffect, useState } from 'react';
import { X } from 'lucide-react';

type ToastType = 'error' | 'success';

type ToastState = {
  message: string;
  type: ToastType;
} | null;

export function useToast(durationMs = 5000) {
  const [toast, setToast] = useState<ToastState>(null);

  const dismiss = useCallback(() => setToast(null), []);

  const showToast = useCallback((message: string, type: ToastType = 'error') => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(dismiss, durationMs);
    return () => window.clearTimeout(timer);
  }, [toast, durationMs, dismiss]);

  const Toast = toast ? (
    <div
      role="alert"
      aria-live="assertive"
      className={`fixed top-4 right-4 z-[100] flex max-w-sm items-start gap-3 rounded-lg px-4 py-3 text-sm text-white shadow-lg ${
        toast.type === 'error' ? 'bg-red-600' : 'bg-green-700'
      }`}
    >
      <p className="flex-1">{toast.message}</p>
      <button
        type="button"
        onClick={dismiss}
        className="shrink-0 rounded p-0.5 hover:bg-white/20"
        aria-label="Dismiss notification"
      >
        <X size={16} />
      </button>
    </div>
  ) : null;

  return { showToast, dismiss, Toast };
}
