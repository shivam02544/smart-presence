'use client';

import { useState } from 'react';
import { LayoutDashboard, Users, BookOpen } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import ThemeToggle from '@/components/ui/ThemeToggle';
import LogoutButton from '@/components/LogoutButton';
import { Menu } from 'lucide-react';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/admin/courses', icon: BookOpen, label: 'Courses' },
    { href: '/admin/batches', icon: Users, label: 'Batches' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <Sidebar
        navItems={navItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        portalName="Admin Portal"
      />

      {/* Main area (shifted right on desktop) */}
      <div className="md:pl-72 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sm:px-6 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={18} />
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                Admin
              </p>
              <h1 className="text-sm sm:text-base font-semibold">
                SmartPresence Control Center
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {/* You can wrap LogoutButton in a dropdown later */}
            <div className="hidden sm:block">
              <LogoutButton />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
