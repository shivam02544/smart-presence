'use client';

import React from 'react';

export default function Card({
    children,
    className = '',
    variant = 'default',
    hover = false,
    padding = 'default',
    ...props
}) {
    const baseStyles = 'bg-white rounded-lg transition-all duration-200';

    const variants = {
        default: 'border border-gray-200 shadow-sm',
        elevated: 'border border-gray-200 shadow-md',
        outlined: 'border-2 border-gray-300',
        flat: 'border-0 shadow-none',
    };

    const paddingStyles = {
        none: '',
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
    };

    const hoverStyles = hover
        ? 'hover:border-gray-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer'
        : '';

    return (
        <div
            className={`${baseStyles} ${variants[variant]} ${paddingStyles[padding]} ${hoverStyles} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
