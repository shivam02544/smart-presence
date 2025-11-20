"use client";

import { Loader2 } from "lucide-react";
import clsx from "clsx";

export default function Button({
  children,
  variant = "default",
  size = "md",
  fullWidth = false,
  isLoading = false,
  className,
  ...props
}) {
  const baseStyles = `
    inline-flex items-center justify-center font-medium rounded-xl
    transition-all duration-200 select-none active:scale-[0.97]
    focus-visible:ring-2 focus-visible:ring-purple-500/60 focus-visible:ring-offset-2
    disabled:opacity-60 disabled:cursor-not-allowed
  `;

  const variants = {
    default: `bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-black dark:hover:bg-gray-300`,
    gradient: `bg-gradient-to-r from-purple-600 to-indigo-500 text-white shadow-lg hover:shadow-purple-500/25`,
    outline: `border border-gray-400 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800`,
    subtle: `bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700`,
    ghost: `hover:bg-gray-100 dark:hover:bg-gray-800`,
  };

  const sizes = {
    sm: "text-sm px-3 py-1.5",
    md: "text-[15px] px-4 py-2",
    lg: "text-[16px] px-5 py-3",
  };

  return (
    <button
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
        <Loader2 className="animate-spin w-4 h-4 mr-2" />
      ) : null}
      {children}
    </button>
  );
}
