"use client";

import clsx from "clsx";
import { motion } from "framer-motion";

export default function Input({
  label,
  icon,
  className,
  error,
  ...props
}) {
  return (
    <div className="w-full group">
      {label && (
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block ml-1">
          {label}
        </label>
      )}

      <motion.div
        whileTap={{ scale: 0.995 }}
        className={clsx(
          `flex items-center gap-3 rounded-xl border bg-gray-50/50 
           dark:bg-[#111113] dark:border-gray-800
           px-4 py-3 transition-all duration-200
           focus-within:bg-white dark:focus-within:bg-black
           focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/10
           hover:border-gray-300 dark:hover:border-gray-700`,
          error && "border-red-500 ring-4 ring-red-500/10",
          className
        )}
      >
        {icon && <div className="text-gray-400 dark:text-gray-500 group-focus-within:text-purple-500 transition-colors">{icon}</div>}
        <input
          {...props}
          className="w-full bg-transparent outline-none text-[15px] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 font-medium"
        />
      </motion.div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-medium text-red-500 mt-1.5 ml-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
