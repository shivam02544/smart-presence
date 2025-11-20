'use client'

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/providers/theme-provider';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 
            hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
}
