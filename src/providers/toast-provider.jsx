"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertTriangle, Info, XCircle } from "lucide-react";

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const icons = {
    success: <Check size={18} />,
    warning: <AlertTriangle size={18} />,
    error: <XCircle size={18} />,
    info: <Info size={18} />,
  };

  const colors = {
    success: "bg-emerald-100 border-emerald-200 text-emerald-800 dark:bg-emerald-900/50 dark:border-emerald-500 dark:text-emerald-200",
    warning: "bg-amber-100 border-amber-200 text-amber-800 dark:bg-amber-900/50 dark:border-amber-500 dark:text-amber-200",
    error: "bg-red-100 border-red-200 text-red-800 dark:bg-red-900/50 dark:border-red-500 dark:text-red-200",
    info: "bg-purple-100 border-purple-200 text-purple-800 dark:bg-purple-900/50 dark:border-purple-500 dark:text-purple-200",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast list */}
      <div className="fixed top-4 right-4 space-y-3 z-[9999] max-w-[280px] flex flex-col">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.25 }}
              className={`backdrop-blur-md border px-4 py-3 rounded-xl flex items-center gap-3 shadow-lg ${colors[toast.type]}`}
            >
              {icons[toast.type]}
              <span className="text-sm font-medium">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
