"use client";

import clsx from "clsx";

export default function Input({
  label,
  icon,
  className,
  error,
  ...props
}) {
  return (
    <div className="w-full">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
        {label}
      </label>

      <div className={clsx(
        `flex items-center gap-2 rounded-xl border bg-white
         dark:bg-[#111113] dark:border-gray-700
         px-3 py-2.5 transition-all duration-200
         focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/40`,
        error && "border-red-500 ring-red-500/40",
        className
      )}>
        {icon && <div className="text-gray-500 dark:text-gray-400">{icon}</div>}
        <input
          {...props}
          className="w-full bg-transparent outline-none text-sm text-gray-900 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-600"
        />
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
