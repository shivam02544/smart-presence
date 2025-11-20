'use client';

import { LayoutDashboard, Users, BookOpen } from 'lucide-react';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';

export default function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/admin/users', icon: Users, label: 'Users' },
        { href: '/admin/courses', icon: BookOpen, label: 'Courses' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Fixed Navbar */}
            <Navbar 
                showNavLinks={false} 
                showUserMenu={true}
                onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            />

            {/* Sidebar - 240px width */}
            <Sidebar 
                navItems={navItems}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                portalName="Admin Portal"
            />

            {/* Main Content - offset by navbar (60px) and sidebar (240px on desktop) */}
            <main className="pt-[60px] md:pl-60">
                <div className="min-h-[calc(100vh-60px)]">
                    {children}
                </div>
            </main>
        </div>
    );
}
