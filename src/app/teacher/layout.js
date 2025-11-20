'use client';

import { useState } from 'react';
import { LayoutDashboard, ListVideo, Settings } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import LogoutButton from '@/components/LogoutButton';

export default function TeacherLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { href: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/teacher/reports', icon: ListVideo, label: 'Reports' },
        { href: '/teacher/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar 
                showNavLinks={false}
                showUserMenu={true}
                user={{ name: 'Teacher', email: 'teacher@example.com' }}
                onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            />

            {/* Sidebar */}
            <Sidebar 
                navItems={navItems}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                portalName="Teacher Portal"
            />

            {/* Main Content */}
            <main className="pt-[60px] md:pl-60 min-h-screen">
                <div className="bg-gray-50">
                    {children}
                </div>
            </main>
        </div>
    );
}
