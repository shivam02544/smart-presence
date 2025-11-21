'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Table({
    columns = [],
    data = [],
    className = '',
    responsive = 'scroll',
    onRowClick,
    ...props
}) {
    if (responsive === 'card' && typeof window !== 'undefined' && window.innerWidth < 768) {
        return (
            <div className={`space-y-4 ${className}`}>
                {data.map((row, rowIndex) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: rowIndex * 0.05 }}
                        key={rowIndex}
                        className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:border-purple-500/30 transition-colors duration-200 shadow-sm"
                        onClick={() => onRowClick?.(row)}
                    >
                        {columns.map((column, colIndex) => (
                            <div key={colIndex} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                                <span className="font-medium text-gray-500 dark:text-gray-400 text-sm">{column.header}</span>
                                <span className="text-gray-900 dark:text-gray-200 text-sm font-medium">
                                    {column.render ? column.render(row[column.accessor], row, rowIndex) : row[column.accessor]}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                ))}
            </div>
        );
    }

    return (
        <div className={`overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 ${className}`} {...props}>
            <table className="w-full bg-white dark:bg-[#0D0D0E] border-collapse">
                <thead className="bg-gray-50/50 dark:bg-[#111113]">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800"
                                style={{ width: column.width }}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {data.map((row, rowIndex) => (
                        <motion.tr
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: rowIndex * 0.03 }}
                            key={rowIndex}
                            className={`
                                group transition-colors duration-200
                                ${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-[#111113]' : 'hover:bg-gray-50/50 dark:hover:bg-[#111113]/50'}
                            `}
                            onClick={() => onRowClick?.(row)}
                        >
                            {columns.map((column, colIndex) => (
                                <td
                                    key={colIndex}
                                    className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200 whitespace-nowrap"
                                >
                                    {column.render ? column.render(row[column.accessor], row, rowIndex) : row[column.accessor]}
                                </td>
                            ))}
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
