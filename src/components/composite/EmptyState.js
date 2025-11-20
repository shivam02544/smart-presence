'use client';

import React from 'react';
import Button from '../ui/Button';

export default function EmptyState({
    icon,
    heading,
    description,
    actionLabel,
    onAction,
    actionHref,
    className = '',
}) {
    return (
        <div className={`flex flex-col items-center justify-center text-center py-12 px-4 ${className}`}>
            {icon && (
                <div className="w-16 h-16 flex items-center justify-center text-gray-300 mb-4">
                    {React.cloneElement(icon, { size: 64, strokeWidth: 1.5 })}
                </div>
            )}
            
            {heading && (
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {heading}
                </h3>
            )}
            
            {description && (
                <p className="text-sm text-gray-500 max-w-md mb-6">
                    {description}
                </p>
            )}
            
            {(actionLabel && (onAction || actionHref)) && (
                <Button
                    variant="primary"
                    onClick={onAction}
                    {...(actionHref && { as: 'a', href: actionHref })}
                >
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
