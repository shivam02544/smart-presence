'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Calendar, Clock, Users, BookOpen, ArrowRight } from 'lucide-react';
import Stats from '@/components/ui/Stats';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/composite/EmptyState';
import SessionsTable from '@/components/teacher/SessionsTable';
import LoadingSpinner from '@/components/composite/LoadingSpinner';
import { apiUrl } from '@/lib/api';
import { motion } from 'framer-motion';

export default function TeacherDashboard() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({ name: '' });
    const [sessions, setSessions] = useState([]);
    const [stats, setStats] = useState([
        { label: "Today's Classes", value: '0', icon: <Calendar size={24} />, trend: 0 },
        { label: 'Total Students', value: '0', icon: <Users size={24} />, trend: 0 },
        { label: 'Avg Duration', value: '0', suffix: 'm', icon: <Clock size={24} />, trend: 0 },
    ]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch stats
            const statsRes = await fetch(apiUrl('/api/teachers/stats'));
            const statsData = await statsRes.json();

            if (statsData.success) {
                setStats([
                    {
                        label: "Today's Classes",
                        value: statsData.data.todaySessions.toString(),
                        icon: <Calendar size={24} />,
                        trend: 0
                    },
                    {
                        label: 'Total Students',
                        value: statsData.data.totalStudents.toString(),
                        icon: <Users size={24} />,
                        trend: 0
                    },
                    {
                        label: 'Avg Duration',
                        value: statsData.data.avgDuration.toString(),
                        suffix: 'm',
                        icon: <Clock size={24} />,
                        trend: 0
                    },
                ]);
            }

            // Fetch recent sessions
            const sessionsRes = await fetch(apiUrl('/api/teachers/sessions'));
            const sessionsData = await sessionsRes.json();

            if (sessionsData.success) {
                setSessions(sessionsData.data.sessions || []);
                setUser({ name: sessionsData.data.userName || 'Teacher' });
            }

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

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
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Teacher Dashboard
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Welcome back, <span className="text-purple-600 dark:text-purple-400 font-semibold">{user.name}</span>
                    </p>
                </div>
                <Link href="/teacher/session/create">
                    <Button variant="gradient" size="md" leftIcon={<Plus size={20} />} className="shadow-lg shadow-purple-500/20">
                        Start New Session
                    </Button>
                </Link>
            </div>

            {/* Stats Overview */}
            <Stats stats={stats} />

            {/* Recent Sessions */}
            <Card variant="glass" padding="lg" className="min-h-[400px]">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Recent Sessions
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Your latest teaching activity
                        </p>
                    </div>
                    <Link href="/teacher/reports">
                        <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={16} />}>
                            View All
                        </Button>
                    </Link>
                </div>

                {sessions.length > 0 ? (
                    <SessionsTable sessions={sessions} />
                ) : (
                    <EmptyState
                        icon={<BookOpen size={48} className="text-purple-200 dark:text-purple-900/50" />}
                        title="No sessions found"
                        description="Start your first session to begin tracking attendance"
                        actionLabel="Start New Session"
                        actionHref="/teacher/session/create"
                    />
                )}
            </Card>
        </motion.div>
    );
}
