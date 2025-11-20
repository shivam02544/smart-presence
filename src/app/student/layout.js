'use client';

import { LayoutDashboard, History, User, QrCode } from 'lucide-react';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';

export default function StudentLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { href: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/student/mark', icon: QrCode, label: 'Mark Attendance' },
        { href: '/student/history', icon: History, label: 'History' },
        { href: '/student/profile', icon: User, label: 'Profile' },
    ];

    // Mock user data - in real app, this would come from session
    const user = {
        name: 'Student User',
        email: 'student@example.com'
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Fixed Navbar */}
            <Navbar 
                user={user}
                showNavLinks={false}
                showUserMenu={true}
                onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            />

            {/* Sidebar */}
            <Sidebar 
                navItems={navItems}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                portalName="Student Portal"
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
