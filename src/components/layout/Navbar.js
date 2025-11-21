'use client';

import InstallButton from "@/components/ui/InstallButton";
import Link from 'next/link';
import { Menu, X, Sparkles, Bell, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ user, showNavLinks = true, showUserMenu = false, onMenuClick }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'How it Works', href: '#how-it-works' },
        { name: 'Pricing', href: '#pricing' },
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 h-[64px] bg-white/80 dark:bg-[#0D0D0E]/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50"
        >
            <div className="h-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-full">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="relative">
                            <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 transition-transform duration-200 group-hover:scale-105">
                                <Sparkles className="text-white" size={18} />
                            </div>
                        </div>
                        <span className="text-lg font-bold text-gray-900 tracking-tight dark:text-white">
                            SmartPresence
                        </span>
                    </Link>

                    {/* Navigation Links (Desktop) */}
                    {showNavLinks && (
                        <div className="hidden md:flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50/50 dark:text-gray-300 dark:hover:text-purple-400 dark:hover:bg-purple-900/10 transition-all duration-200 rounded-lg"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Right Controls */}
                    <div className="flex items-center gap-3">

                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* ---- Desktop Install Button ---- */}
                        {showUserMenu && (
                            <div className="hidden md:block">
                                <InstallButton />
                            </div>
                        )}

                        {/* Authenticated User Section */}
                        {showUserMenu ? (
                            <>
                                {/* Notifications (Desktop) */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="hidden md:flex p-2 text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:bg-gray-800 hover:bg-gray-100 rounded-full transition-colors relative"
                                >
                                    <Bell size={20} />
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white dark:border-[#0D0D0E] rounded-full"></span>
                                </motion.button>

                                {/* User Dropdown */}
                                <div className="hidden md:block relative">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="flex items-center gap-2 p-1 pr-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                                            {user?.name?.[0] || 'U'}
                                        </div>
                                        <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
                                    </motion.button>

                                    <AnimatePresence>
                                        {userMenuOpen && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute right-0 mt-2 w-60 bg-white dark:bg-[#111113] rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 py-2 z-20 overflow-hidden"
                                                >
                                                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                                                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                                    </div>
                                                    <div className="p-1">
                                                        <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                                            Profile
                                                        </Link>
                                                        <Link href="/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                                            Settings
                                                        </Link>
                                                    </div>
                                                    <div className="border-t border-gray-100 dark:border-gray-800 mt-1 pt-1 p-1">
                                                        <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                                            Sign Out
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        ) : (
                            <div className="hidden md:flex items-center gap-3">
                                <Link href="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
                                <Link href="/login"><Button variant="primary" size="sm">Get Started</Button></Link>
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-gray-600 hover:text-purple-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* ---- MOBILE MENU ---- */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0D0D0E] shadow-lg overflow-hidden"
                    >
                        <div className="px-4 py-4 space-y-4">

                            {/* Install Button Mobile */}
                            {showUserMenu && <InstallButton fullWidth variant="outline" />}

                            {showNavLinks && navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 dark:text-gray-300 dark:hover:bg-gray-800 rounded-xl transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            {/* Auth / Profile Actions */}
                            {showUserMenu ? (
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
                                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                                            {user?.name?.[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user?.name}</p>
                                            <p className="text-xs text-gray-500">{user?.email}</p>
                                        </div>
                                    </div>
                                    <Link href="/profile" className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors">Profile</Link>
                                    <Link href="/settings" className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors">Settings</Link>
                                </div>
                            ) : (
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
                                    <Link href="/login"><Button fullWidth variant="ghost">Sign In</Button></Link>
                                    <Link href="/login"><Button fullWidth variant="primary">Get Started</Button></Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
