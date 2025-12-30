'use client';

import Toast from '@/components/toast/toast';
import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

type ToastContext = {
   showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContext | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
   const [toastMessage, setToastMessage] = useState<string | null>(null);
   const showToast = useCallback((message: string) => {
      setToastMessage(message);
      setTimeout(() => {
         setToastMessage(null);
      }, 2000);
   }, []);

   return (
      <ToastContext.Provider value={{ showToast }}>
         {children}
         {toastMessage && (
            <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[9999] animate-in fade-in slide-in-from-bottom-2">
               <Toast message={toastMessage} />
            </div>
         )}
      </ToastContext.Provider>
   );
}

export function useToast() {
   const context = useContext(ToastContext);
   if (!context) {
      throw new Error('useToast must be used within ToastProvider.');
   }
   return context;
}
