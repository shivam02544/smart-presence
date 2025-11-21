'use client';

import { useState } from 'react';
import { LayoutDashboard, Users, FileText, Settings } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import LogoutButton from '@/components/LogoutButton';

export default function CRLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        {
            label: 'Dashboard',
            href: '/cr/dashboard',
            icon: LayoutDashboard
        },
        {
            label: 'Class Management',
            href: '/cr/class',
            icon: Users
        },
        {
            label: 'Reports',
            href: '/cr/reports',
            icon: FileText
        },
        {
            label: 'Settings',
            href: '/cr/settings',
            icon: Settings
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Fixed Navbar */}
            <Navbar
                showNavLinks={false}
                showUserMenu={true}
                user={{ name: 'CR User', email: 'cr@example.com' }}
                onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            />

            {/* Sidebar */}
            <Sidebar
                navItems={navItems}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                portalName="CR Portal"
            />

            {/* Main Content */}
            <main className="md:ml-72 pt-[60px] min-h-screen">
                <div className="min-h-full">
                    {children}
                </div>
            </main>

            {/* Logout Button - Fixed at bottom of sidebar on desktop */}
            <div className="hidden md:block fixed left-3 bottom-4 w-54">
                <LogoutButton />
            </div>
        </div>
    );
}
