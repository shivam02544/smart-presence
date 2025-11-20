'use client';

import Link from 'next/link';
import { Menu, X, Sparkles, Bell, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import Button from '@/components/ui/Button';

export default function Navbar({ user, showNavLinks = true, showUserMenu = false, onMenuClick }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'How it Works', href: '#how-it-works' },
        { name: 'Pricing', href: '#pricing' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-[60px] bg-white border-b border-gray-200 shadow-sm">
            <div className="h-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-full">
                    {/* Logo - Left */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="relative">
                            <div className="w-9 h-9 bg-gradient-to-br from-purple-700 to-purple-500 rounded-xl flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-105">
                                <Sparkles className="text-white" size={18} />
                            </div>
                        </div>
                        <span className="text-lg font-bold text-gray-900 tracking-tight">
                            SmartPresence
                        </span>
                    </Link>

                    {/* Centered Navigation Links - Desktop */}
                    {showNavLinks && (
                        <div className="hidden md:flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-700 hover:bg-gray-50 transition-colors duration-200 rounded-lg"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Right Section */}
                    <div className="flex items-center gap-3">
                        {showUserMenu ? (
                            <>
                                {/* Notifications - Desktop */}
                                <button
                                    className="hidden md:flex p-2 text-gray-600 hover:text-purple-700 hover:bg-gray-100 rounded-full transition-colors relative"
                                    aria-label="Notifications"
                                >
                                    <Bell size={20} />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-purple-700 rounded-full"></span>
                                </button>

                                {/* User Profile Menu - Desktop */}
                                <div className="hidden md:block relative">
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="flex items-center gap-2 p-1.5 pr-3 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-700 to-purple-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm font-semibold">
                                                {user?.name?.[0] || 'U'}
                                            </span>
                                        </div>
                                        <ChevronDown size={16} className="text-gray-600" />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {userMenuOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setUserMenuOpen(false)}
                                            />
                                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                                                <div className="px-4 py-3 border-b border-gray-200">
                                                    <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                                                    <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                                                </div>
                                                <Link
                                                    href="/profile"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    Profile
                                                </Link>
                                                <Link
                                                    href="/settings"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    Settings
                                                </Link>
                                                <div className="border-t border-gray-200 mt-2 pt-2">
                                                    <button
                                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                                                        onClick={() => setUserMenuOpen(false)}
                                                    >
                                                        Sign Out
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="hidden md:flex items-center gap-3">
                                <Link href="/login">
                                    <Button variant="ghost" size="sm">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button variant="primary" size="sm">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => {
                                if (onMenuClick) {
                                    onMenuClick();
                                } else {
                                    setMobileMenuOpen(!mobileMenuOpen);
                                }
                            }}
                            className="md:hidden p-2 text-gray-600 hover:text-purple-700 hover:bg-gray-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
                    <div className="px-4 py-4 space-y-3">
                        {showNavLinks && navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-purple-700 hover:bg-gray-50 rounded-lg transition-colors min-h-[44px] flex items-center"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        
                        {showUserMenu ? (
                            <div className="pt-3 border-t border-gray-200">
                                <div className="flex items-center gap-3 px-4 py-3 mb-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-700 to-purple-500 rounded-full flex items-center justify-center">
                                        <span className="text-white font-semibold">
                                            {user?.name?.[0] || 'U'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                                        <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                                    </div>
                                </div>
                                <Link
                                    href="/profile"
                                    className="block px-4 py-3 text-base text-gray-700 hover:bg-gray-50 rounded-lg min-h-[44px] flex items-center"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                                <Link
                                    href="/settings"
                                    className="block px-4 py-3 text-base text-gray-700 hover:bg-gray-50 rounded-lg min-h-[44px] flex items-center"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Settings
                                </Link>
                                <button
                                    className="w-full text-left px-4 py-3 text-base text-red-600 hover:bg-gray-50 rounded-lg mt-2 min-h-[44px] flex items-center"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="pt-3 space-y-2 border-t border-gray-200">
                                <Link href="/login" className="block">
                                    <Button variant="ghost" fullWidth onClick={() => setMobileMenuOpen(false)}>
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/login" className="block">
                                    <Button variant="primary" fullWidth onClick={() => setMobileMenuOpen(false)}>
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
