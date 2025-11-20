'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavigationMenu({ items = [], className = '' }) {
    const pathname = usePathname();

    return (
        <nav className={`space-y-1 ${className}`}>
            {items.map((item, index) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                const isDisabled = item.disabled;

                const baseStyles = 'flex items-center h-11 px-4 rounded-lg text-sm font-medium transition-all duration-200';
                const activeStyles = isActive
                    ? 'bg-purple-50 text-purple-700'
                    : 'text-gray-700 hover:bg-gray-100';
                const disabledStyles = isDisabled
                    ? 'opacity-50 cursor-not-allowed pointer-events-none text-gray-400'
                    : '';

                const content = (
                    <>
                        {item.icon && (
                            <span className={`shrink-0 w-5 h-5 mr-3 ${isActive ? 'text-purple-700' : 'text-gray-500'}`}>
                                {item.icon}
                            </span>
                        )}
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                            <span className="ml-auto bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                                {item.badge}
                            </span>
                        )}
                    </>
                );

                if (item.onClick) {
                    return (
                        <button
                            key={index}
                            onClick={item.onClick}
                            disabled={isDisabled}
                            className={`${baseStyles} ${activeStyles} ${disabledStyles} w-full`}
                        >
                            {content}
                        </button>
                    );
                }

                return (
                    <Link
                        key={index}
                        href={item.href || '#'}
                        className={`${baseStyles} ${activeStyles} ${disabledStyles}`}
                    >
                        {content}
                    </Link>
                );
            })}
        </nav>
    );
}
