"use client";

import { Loader2 } from "lucide-react";
import clsx from "clsx";
import { motion } from "framer-motion";

export default function Button({
  children,
  variant = "default",
  size = "md",
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  ...props
}) {
  const baseStyles = `
    inline-flex items-center justify-center font-semibold rounded-xl
    transition-colors duration-200 select-none cursor-pointer
    focus-visible:ring-2 focus-visible:ring-purple-500/60 focus-visible:ring-offset-2
    disabled:opacity-60 disabled:cursor-not-allowed
  `;

  const variants = {
    default: `bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 shadow-sm`,
    gradient: `bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 border border-transparent`,
    outline: `border-2 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10`,
    subtle: `bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700`,
    ghost: `hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white`,
    white: `bg-white text-gray-900 hover:bg-gray-50 shadow-lg border border-gray-100`,
    danger: `bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50`,
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-5 py-2.5 gap-2",
    lg: "text-base px-6 py-3 gap-2.5",
    xl: "text-lg px-8 py-4 gap-3",
  };

  return (
    <motion.button
      whileHover={{ scale: isLoading ? 1 : 1.02 }}
      whileTap={{ scale: isLoading ? 1 : 0.98 }}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin w-4 h-4" />
      ) : (
        <>
          {leftIcon && <span className="flex items-center">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex items-center">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
}
