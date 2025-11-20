'use client';

import { useEffect, useState, useRef } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

function Counter({ value, duration = 2000 }) {
    const [count, setCount] = useState(0);
    const countRef = useRef(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    startCounting();
                }
            },
            { threshold: 0.1 }
        );

        if (countRef.current) {
            observer.observe(countRef.current);
        }

        return () => observer.disconnect();
    }, [hasAnimated]);

    const startCounting = () => {
        const end = parseFloat(value);
        if (isNaN(end)) {
            setCount(value);
            return;
        }

        const increment = end / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current * 10) / 10);
            }
        }, 16);
    };

    return <span ref={countRef}>{count}</span>;
}

export default function Stats({ stats }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="group relative bg-white border border-gray-200 rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    {/* Icon and Trend */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full text-purple-700 transition-transform duration-200 group-hover:scale-110">
                            {stat.icon}
                        </div>

                        {/* Trend Indicator */}
                        {stat.trend !== undefined && stat.trend !== 0 && (
                            <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ${
                                stat.trend > 0
                                    ? 'bg-success-50 text-success-600'
                                    : 'bg-error-50 text-error-600'
                            }`}>
                                {stat.trend > 0 ? (
                                    <TrendingUp size={14} />
                                ) : (
                                    <TrendingDown size={14} />
                                )}
                                <span>{Math.abs(stat.trend)}%</span>
                            </div>
                        )}
                    </div>

                    {/* Value */}
                    <div className="mb-2">
                        <div className="flex items-baseline gap-1">
                            {stat.prefix && (
                                <span className="text-xl font-bold text-gray-600">{stat.prefix}</span>
                            )}
                            <span className="text-3xl font-bold text-gray-900 tracking-tight">
                                <Counter value={stat.value} />
                            </span>
                            {stat.suffix && (
                                <span className="text-xl font-semibold text-purple-700">{stat.suffix}</span>
                            )}
                        </div>
                    </div>

                    {/* Label */}
                    <p className="text-sm font-medium text-gray-600">
                        {stat.label}
                    </p>

                    {/* Subtle Purple Gradient on Hover */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-50/0 to-purple-50/0 group-hover:from-purple-50/50 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
                </div>
            ))}
        </div>
    );
}
