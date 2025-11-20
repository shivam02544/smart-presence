'use client';

import React from 'react';

export default function Table({
    columns = [],
    data = [],
    className = '',
    responsive = 'scroll',
    onRowClick,
    ...props
}) {
    const [hoveredRow, setHoveredRow] = React.useState(null);

    if (responsive === 'card' && typeof window !== 'undefined' && window.innerWidth < 768) {
        return (
            <div className={`space-y-4 ${className}`}>
                {data.map((row, rowIndex) => (
                    <div
                        key={rowIndex}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-purple-50 transition-colors duration-200"
                        onClick={() => onRowClick?.(row)}
                    >
                        {columns.map((column, colIndex) => (
                            <div key={colIndex} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                                <span className="font-medium text-gray-700 text-sm">{column.header}</span>
                                <span className="text-gray-900 text-sm">
                                    {column.render ? column.render(row[column.accessor], row, rowIndex) : row[column.accessor]}
                                </span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className={`overflow-x-auto ${className}`} {...props}>
            <table className="w-full bg-white border-collapse">
                <thead className="bg-gray-50 sticky top-0">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200"
                                style={{ width: column.width }}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className={`
                                ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                hover:bg-purple-50 transition-colors duration-200
                                ${onRowClick ? 'cursor-pointer' : ''}
                            `}
                            onMouseEnter={() => setHoveredRow(rowIndex)}
                            onMouseLeave={() => setHoveredRow(null)}
                            onClick={() => onRowClick?.(row)}
                        >
                            {columns.map((column, colIndex) => (
                                <td
                                    key={colIndex}
                                    className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200"
                                >
                                    {column.render ? column.render(row[column.accessor], row, rowIndex) : row[column.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
