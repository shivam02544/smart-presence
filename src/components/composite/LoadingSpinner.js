'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({
    size = 'inline',
    className = '',
    text,
    fullPage = false,
}) {
    const sizeClasses = {
        inline: 'w-6 h-6',
        large: 'w-12 h-12',
    };

    const spinner = (
        <Loader2
            className={`animate-spin text-purple-700 ${sizeClasses[size]} ${className}`}
            strokeWidth={2.5}
        />
    );

    if (fullPage) {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-50">
                <Loader2
                    className="animate-spin text-purple-700 w-12 h-12 mb-4"
                    strokeWidth={2.5}
                />
                {text && (
                    <p className="text-sm text-gray-600 font-medium">{text}</p>
                )}
            </div>
        );
    }

    if (text) {
        return (
            <div className="flex flex-col items-center justify-center gap-3">
                {spinner}
                <p className="text-sm text-gray-600 font-medium">{text}</p>
            </div>
        );
    }

    return spinner;
}
