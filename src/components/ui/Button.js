'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
    children,
    variant = 'primary',
    size = 'medium',
    className = '',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    ...props
}) {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] relative overflow-hidden';

    const variants = {
        primary: 'bg-purple-700 text-white hover:bg-purple-800 active:bg-purple-900 shadow-sm hover:shadow-md',
        secondary: 'bg-white text-purple-700 border border-purple-700 hover:bg-purple-50 active:bg-purple-100',
        ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200',
        outline: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100',
    };

    const sizes = {
        small: 'h-9 px-4 text-sm rounded-md gap-1.5 min-h-[44px] sm:min-h-[36px]',
        medium: 'h-10 px-5 text-sm rounded-md gap-2 min-h-[44px]',
        large: 'h-12 px-6 text-base rounded-md gap-2.5 min-h-[44px]',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {/* Content */}
            <span className="relative flex items-center gap-[inherit]">
                {isLoading && <Loader2 className="animate-spin" size={size === 'small' ? 14 : size === 'large' ? 20 : 16} />}
                {!isLoading && leftIcon && <span className="shrink-0 flex items-center">{leftIcon}</span>}
                <span className="truncate">{children}</span>
                {!isLoading && rightIcon && (
                    <span className="shrink-0 flex items-center transition-transform duration-200">
                        {rightIcon}
                    </span>
                )}
            </span>
        </button>
    );
}
