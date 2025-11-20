'use client';

import Link from 'next/link';
import {
  Users,
  BookOpen,
  BarChart3,
  Settings,
  Plus,
  FileText,
  Activity,
  ShieldCheck,
} from 'lucide-react';
import Stats from '@/components/ui/Stats';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Students', value: '1,234', icon: <Users size={22} />, trend: 12 },
    { label: 'Active Teachers', value: '48', icon: <BookOpen size={22} />, trend: 6 },
    { label: "Today's Sessions", value: '19', icon: <BarChart3 size={22} />, trend: 3.5 },
    { label: 'System Health', value: '99.9%', icon: <ShieldCheck size={22} />, trend: 2.1 },
  ];

  const recentActivity = [
    {
      id: 1,
      title: 'Attendance session created',
      details: 'CSE – 3rd Year · Data Structures',
      time: '12 min ago',
    },
    {
      id: 2,
      title: 'New teacher onboarded',
      details: 'Prof. Sarah Johnson · Computer Science',
      time: '2h ago',
    },
    {
      id: 3,
      title: 'CR updated student list',
      details: 'BCA – 2nd Year · Section B',
      time: '4h ago',
    },
    {
      id: 4,
      title: 'Monthly attendance report generated',
      details: 'October 2025 · All departments',
      time: 'Yesterday',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-10 animate-fade">

      {/* PAGE HEADER */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            High-level view of institution performance, sessions, and activity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/courses/create">
            <Button variant="outline" size="sm" className="gap-2">
              <Settings size={16} />
              Configure Courses
            </Button>
          </Link>

          <Link href="/admin/users/create">
            <Button variant="gradient" size="sm" className="gap-2">
              <Plus size={16} />
              New Admin/Teacher
            </Button>
          </Link>
        </div>
      </div>

      {/* STATISTICS */}
      <Stats stats={stats} />

      {/* MAIN GRID */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* SNAPSHOT */}
        <Card padding="lg" className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Institution Snapshot</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Quick overview of attendance and engagement.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <SnapshotBox title="Today's Avg Attendance" value="92%" trend="+3.2%" trendColor="text-emerald-500" />
            <SnapshotBox title="Active Sessions" value="7" subtitle="Across 3 departments" />
            <SnapshotBox title="Proxy / Anomaly Flags" value="4" valueColor="text-amber-600 dark:text-amber-400" />
          </div>
        </Card>

        {/* QUICK ACTIONS */}
        <Card padding="lg" className="space-y-5">
          <div className="flex items-center gap-2">
            <ZapIcon />
            <h2 className="text-lg font-semibold">Quick Actions</h2>
          </div>

          <div className="space-y-3">
            <ActionButton link="/admin/users/create" icon={<Users size={18} />} text="Add New User" />
            <ActionButton link="/admin/courses/create" icon={<BookOpen size={18} />} text="Manage Courses" />
            <ActionButton link="/admin/reports" icon={<FileText size={18} />} text="View Global Reports" />
          </div>
        </Card>
      </div>

      {/* RECENT ACTIVITY */}
      <Card padding="lg" className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Activity size={18} className="text-purple-500" />
          Recent Activity
        </h2>

        <div className="space-y-3">
          {recentActivity.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-3 bg-white/60 dark:bg-[#111113]/60"
            >
              <div className="flex gap-3">
                <div className="mt-1 h-7 w-7 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <span className="h-2 w-2 rounded-full bg-purple-600 dark:bg-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.details}</p>
                </div>
              </div>
              <span className="text-[11px] text-gray-500 whitespace-nowrap">{item.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ---------- Reusable Mini Components ----------- */

function SnapshotBox({ title, value, subtitle, trend, trendColor, valueColor }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-white/70 dark:bg-[#111113]/60 space-y-2">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">{title}</p>
      <p className={`text-3xl font-semibold ${valueColor || ''}`}>{value}</p>
      {trend && <p className={`text-xs ${trendColor}`}>{trend} vs last week</p>}
      {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>}
    </div>
  );
}

function ActionButton({ link, icon, text }) {
  return (
    <Link href={link}>
      <Button fullWidth variant="outline" size="sm" className="justify-start gap-2">
        {icon}
        {text}
      </Button>
    </Link>
  );
}

function ZapIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-purple-500"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
