'use client';

import { useState } from 'react';
import { LayoutDashboard, History, User, QrCode } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import ThemeToggle from '@/components/ui/ThemeToggle';
import LogoutButton from '@/components/LogoutButton';
import { Menu } from 'lucide-react';

export default function StudentLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { href: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/student/mark', icon: QrCode, label: 'Mark Attendance' },
    { href: '/student/history', icon: History, label: 'History' },
    { href: '/student/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] text-gray-900 dark:text-gray-100">
      <Sidebar
        navItems={navItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        portalName="Student Portal"
      />

      <div className="md:pl-72 flex flex-col min-h-screen">
        <header className="h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sm:px-6 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={18} />
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                Student
              </p>
              <h1 className="text-sm sm:text-base font-semibold">
                Attendance & Profile
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden sm:block">
              <LogoutButton />
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
