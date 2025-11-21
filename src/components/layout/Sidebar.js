'use client';

import InstallButton from "@/components/ui/InstallButton";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Sidebar({ navItems, isOpen, onClose, portalName = 'Dashboard' }) {
    const pathname = usePathname();

    const renderNavItems = () => (
        <nav className="mt-6 space-y-1.5">
            {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname.startsWith(item.href);

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={classNames(
                            'group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                            active
                                ? 'text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'
                        )}
                    >
                        {active && (
                            <motion.div
                                layoutId="active-nav-item"
                                className="absolute inset-0 bg-gray-900 dark:bg-white rounded-xl"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}

                        <span className="relative z-10 flex items-center gap-3">
                            {Icon && (
                                <Icon
                                    size={18}
                                    className={classNames(
                                        active
                                            ? 'text-white dark:text-black'
                                            : 'text-gray-500 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-300'
                                    )}
                                />
                            )}
                            <span className={active ? 'text-white dark:text-black' : ''}>{item.label}</span>
                        </span>
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
                    'hidden md:flex fixed inset-y-0 left-0 w-72 flex-col border-r border-gray-200 dark:border-gray-800',
                    'bg-white/80 dark:bg-[#050816]/80 backdrop-blur-xl z-30'
                )}
            >
                {/* Logo & Portal */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <Sparkles className="text-white" size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                                SmartPresence
                            </p>
                            <p className="text-base font-bold text-gray-900 dark:text-white">
                                {portalName}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <div className="flex-1 overflow-y-auto px-4 py-6">
                    {renderNavItems()}
                </div>

                {/* Footer */}
                <div className="px-6 py-6 border-t border-gray-100 dark:border-gray-800/50">
                    <InstallButton fullWidth variant="outline" />

                    <p className="mt-4 text-[11px] text-gray-400 text-center font-medium">
                        v1.0 · Attendance reinvented
                    </p>
                </div>

            </aside>

            {/* Mobile sidebar (drawer) */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                            onClick={onClose}
                        />

                        {/* Drawer */}
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className={classNames(
                                'fixed inset-y-0 left-0 w-72 flex flex-col border-r border-gray-200 dark:border-gray-800',
                                'bg-white dark:bg-[#050816] z-50'
                            )}
                        >
                            <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
                                        <Sparkles className="text-white" size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                                            SmartPresence
                                        </p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                                            {portalName}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-4 py-6">
                                {renderNavItems()}
                            </div>
                            <div className="px-6 py-6 border-t border-gray-100 dark:border-gray-800">
                                <InstallButton fullWidth variant="outline" />
                                <p className="mt-4 text-[11px] text-gray-400 text-center font-medium">
                                    v1.0 · Attendance reinvented
                                </p>
                            </div>

                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
