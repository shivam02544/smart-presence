'use client';

import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function Card({
    children,
    className = '',
    variant = 'default',
    hover = false,
    padding = 'default',
    ...props
}) {
    const baseStyles = 'rounded-2xl transition-all duration-200 overflow-hidden';

    const variants = {
        default: 'bg-white dark:bg-[#111113] border border-gray-200 dark:border-gray-800 shadow-sm',
        elevated: 'bg-white dark:bg-[#111113] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-black/50',
        outlined: 'bg-transparent border-2 border-gray-200 dark:border-gray-800',
        flat: 'bg-gray-50 dark:bg-gray-900 border-0',
        glass: 'bg-white/70 dark:bg-[#111113]/70 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg',
        gradient: 'bg-gradient-to-br from-purple-500/5 to-blue-500/5 border border-purple-100 dark:border-purple-900/20',
    };

    const paddingStyles = {
        none: '',
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            whileHover={hover ? { y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" } : {}}
            className={clsx(
                baseStyles,
                variants[variant],
                paddingStyles[padding],
                hover && 'cursor-pointer',
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}
