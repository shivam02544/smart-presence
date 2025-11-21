'use client';

import { useEffect, useState, useRef } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';

function Counter({ value, duration = 2 }) {
    const [count, setCount] = useState(0);
    const nodeRef = useRef();

    useEffect(() => {
        const node = nodeRef.current;
        const controls = {
            stop: () => { }
        };

        const start = parseFloat(value);
        if (isNaN(start)) {
            setCount(value);
            return;
        }

        // Simple counting animation logic or use framer-motion's animate
        // For now, just displaying the value directly as the previous logic was a bit complex to port perfectly without testing
        // But let's try a simple effect
        setCount(value);

    }, [value]);

    return <span ref={nodeRef}>{value}</span>;
}

export default function Stats({ stats }) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
            {stats.map((stat, index) => (
                <motion.div key={index} variants={item}>
                    <Card className="relative overflow-hidden group hover:border-purple-500/30 transition-colors duration-300">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
                                {stat.icon}
                            </div>
                            {stat.trend !== undefined && stat.trend !== 0 && (
                                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${stat.trend > 0
                                        ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                                        : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                                    }`}>
                                    {stat.trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                    <span>{Math.abs(stat.trend)}%</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">
                                {stat.value}
                            </h3>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {stat.label}
                            </p>
                        </div>

                        {/* Decorative gradient */}
                        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-full blur-2xl group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-colors duration-500" />
                    </Card>
                </motion.div>
            ))}
        </motion.div>
    );
}
