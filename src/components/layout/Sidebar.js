'use client';

import InstallButton from "@/components/ui/InstallButton";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Sidebar({ navItems, isOpen, onClose, portalName = 'Dashboard' }) {
    const pathname = usePathname();

    const renderNavItems = () => (
        <nav className="mt-6 space-y-1">
            {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname.startsWith(item.href);

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={classNames(
                            'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                            active
                                ? 'bg-gray-900 text-white dark:bg-white dark:text-black shadow-sm'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        )}
                    >
                        {Icon && (
                            <Icon
                                size={18}
                                className={classNames(
                                    active
                                        ? 'text-white dark:text-black'
                                        : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100'
                                )}
                            />
                        )}
                        <span>{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );

    // Desktop sidebar (always visible)
    return (
        <>
            <aside
                className={classNames(
                    'hidden md:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-gray-200 dark:border-gray-800',
                    'bg-white/90 dark:bg-[#050816]/95 backdrop-blur-md z-30'
                )}
            >
                {/* Logo & Portal */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
                            <span className="text-xs font-bold text-white">SP</span>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.16em] text-gray-400">
                                SmartPresence
                            </p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                {portalName}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <div className="flex-1 overflow-y-auto px-3 py-4">
                    {renderNavItems()}
                </div>

                {/* Footer placeholder (could be version, small text, etc.) */}
                {/* Install Button */}
                <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800">
                    <InstallButton fullWidth variant="outline" />

                    <p className="mt-3 text-[11px] text-gray-400 text-center">
                        v1.0 · Attendance reinvented
                    </p>
                </div>

            </aside>

            {/* Mobile sidebar (drawer) */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <aside
                        className={classNames(
                            'fixed inset-y-0 left-0 w-64 flex flex-col border-r border-gray-200 dark:border-gray-800',
                            'bg-white dark:bg-[#050816] z-50 transform transition-transform duration-200',
                            isOpen ? 'translate-x-0' : '-translate-x-full'
                        )}
                    >
                        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
                                    <span className="text-xs font-bold text-white">SP</span>
                                </div>
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.16em] text-gray-400">
                                        SmartPresence
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        {portalName}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <X size={18} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-3 py-4">
                            {renderNavItems()}
                        </div>
                        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800">
                            <InstallButton fullWidth variant="outline" />
                            <p className="mt-3 text-[11px] text-gray-400 text-center">
                                v1.0 · Attendance reinvented
                            </p>
                        </div>

                    </aside>
                </>
            )}
        </>
    );
}
