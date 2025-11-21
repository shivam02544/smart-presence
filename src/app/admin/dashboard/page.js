'use client';

import { useState, useEffect } from 'react';
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
  Zap,
  ArrowRight
} from 'lucide-react';
import Stats from '@/components/ui/Stats';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/composite/LoadingSpinner';
import { apiUrl } from '@/lib/api';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: 'Total Students', value: '0', icon: <Users size={24} />, trend: 0 },
    { label: 'Active Teachers', value: '0', icon: <BookOpen size={24} />, trend: 0 },
    { label: "Today's Sessions", value: '0', icon: <BarChart3 size={24} />, trend: 0 },
    { label: 'System Health', value: '100%', icon: <ShieldCheck size={24} />, trend: 0 },
  ]);
  const [snapshotData, setSnapshotData] = useState({
    avgAttendance: '0%',
    activeSessions: '0',
    flaggedRecords: '0',
    departmentsCount: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(apiUrl('/api/admin/stats'));
        const data = await res.json();

        if (data.success) {
          setStats([
            { label: 'Total Students', value: data.data.totalStudents.toLocaleString(), icon: <Users size={24} />, trend: 12 },
            { label: 'Active Teachers', value: data.data.activeTeachers.toString(), icon: <BookOpen size={24} />, trend: 5 },
            { label: "Today's Sessions", value: data.data.todaySessions.toString(), icon: <BarChart3 size={24} />, trend: 8 },
            { label: 'System Health', value: '98%', icon: <ShieldCheck size={24} />, trend: 0 },
          ]);
          setSnapshotData({
            avgAttendance: data.data.avgAttendance ? `${data.data.avgAttendance}%` : '0%',
            activeSessions: data.data.activeSessions.toString(),
            flaggedRecords: data.data.flaggedRecords.toString(),
            departmentsCount: data.data.departmentsCount || 0
          });
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8"
    >

      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Overview of your institution's performance and activity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/courses/create">
            <Button variant="outline" size="sm" leftIcon={<Settings size={16} />}>
              Configure Courses
            </Button>
          </Link>

          <Link href="/admin/users/create">
            <Button variant="gradient" size="sm" leftIcon={<Plus size={16} />}>
              New User
            </Button>
          </Link>
        </div>
      </div>

      {/* STATISTICS */}
      <Stats stats={stats} />

      {/* MAIN GRID */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* SNAPSHOT */}
        <Card variant="glass" padding="lg" className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Institution Snapshot</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Real-time attendance metrics
              </p>
            </div>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Activity size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <SnapshotBox
              title="Avg Attendance"
              value={snapshotData.avgAttendance}
              icon={<Users size={18} />}
              trend="+2.5%"
            />
            <SnapshotBox
              title="Active Sessions"
              value={snapshotData.activeSessions}
              icon={<Zap size={18} />}
              subtitle={`${snapshotData.departmentsCount} Depts`}
            />
            <SnapshotBox
              title="Flags Raised"
              value={snapshotData.flaggedRecords}
              icon={<ShieldCheck size={18} />}
              valueColor="text-amber-600 dark:text-amber-500"
            />
          </div>
        </Card>

        {/* QUICK ACTIONS */}
        <Card variant="default" padding="lg" className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Common tasks</p>
          </div>

          <div className="space-y-3">
            <ActionButton
              link="/admin/users/create"
              icon={<Users size={18} />}
              title="Add New User"
              desc="Create student or teacher accounts"
            />
            <ActionButton
              link="/admin/courses/create"
              icon={<BookOpen size={18} />}
              title="Manage Courses"
              desc="Add or edit course details"
            />
            <ActionButton
              link="/admin/reports"
              icon={<FileText size={18} />}
              title="View Reports"
              desc="Generate attendance reports"
            />
          </div>
        </Card>
      </div>

      {/* RECENT ACTIVITY */}
      <Card variant="default" padding="lg" className="min-h-[300px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
          <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={16} />}>View All</Button>
        </div>

        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <Activity size={32} className="text-gray-400" />
          </div>
          <div>
            <p className="text-gray-900 dark:text-white font-medium">No recent activity</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto mt-1">
              Activity logs will appear here as users interact with the system.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

/* ---------- Reusable Mini Components ----------- */

function SnapshotBox({ title, value, subtitle, trend, valueColor, icon }) {
  return (
    <div className="p-5 rounded-2xl bg-gray-50 dark:bg-[#0D0D0E] border border-gray-100 dark:border-gray-800 relative overflow-hidden group hover:border-purple-200 dark:hover:border-purple-900/50 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-white dark:bg-[#1A1A1C] rounded-lg text-gray-500 dark:text-gray-400 shadow-sm">
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className={`text-2xl font-bold text-gray-900 dark:text-white ${valueColor || ''}`}>{value}</p>
      </div>

      {subtitle && <p className="text-xs text-gray-400 mt-2">{subtitle}</p>}
    </div>
  );
}

function ActionButton({ link, icon, title, desc }) {
  return (
    <Link href={link} className="block group">
      <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
        <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
        </div>
        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowRight size={16} className="text-gray-400" />
        </div>
      </div>
    </Link>
  );
}
