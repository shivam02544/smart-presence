'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';

export default function Sidebar({ navItems, isOpen, onClose, portalName = 'Dashboard' }) {
    const pathname = usePathname();

    const SidebarContent = () => (
        <>
            {/* Logo Section */}
            <div className="h-[60px] flex items-center justify-between px-6 border-b border-gray-200">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-700 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">SP</span>
                    </div>
                    <div>
                        <div className="text-sm font-bold text-gray-900">SmartPresence</div>
                        <div className="text-xs text-gray-500">{portalName}</div>
                    </div>
                </div>
                {/* Close button for mobile */}
                <button
                    onClick={onClose}
                    className="md:hidden p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Close menu"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={`
                                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium
                                ${isActive
                                    ? 'bg-purple-50 text-purple-700'
                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                }
                            `}
                        >
                            <Icon size={20} className={isActive ? 'text-purple-700' : 'text-gray-600'} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </>
    );

    return (
        <>
            {/* Desktop Sidebar - Fixed */}
            <aside className="hidden md:flex flex-col w-60 border-r border-gray-200 bg-white fixed left-0 top-[60px] bottom-0 z-30">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar - Drawer */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 top-[60px]"
                        onClick={onClose}
                    />
                    {/* Drawer */}
                    <aside className="md:hidden fixed left-0 top-[60px] bottom-0 w-60 bg-white border-r border-gray-200 z-50 flex flex-col shadow-xl animate-in slide-in-from-left duration-300">
                        <SidebarContent />
                    </aside>
                </>
            )}
        </>
    );
}
