'use client';

import { useState, useEffect } from 'react';
import { Users, Calendar, BarChart3, Wifi, WifiOff, UploadCloud, CheckCircle, FileText, Settings } from 'lucide-react';
import { getOfflineRecords, clearSyncedRecords } from '@/lib/offline';
import Stats from '@/components/ui/Stats';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/composite/LoadingSpinner';
import { apiUrl } from '@/lib/api';

export default function CRDashboard() {
    const [loading, setLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(true);
    const [offlineCount, setOfflineCount] = useState(0);
    const [syncing, setSyncing] = useState(false);
    const [stats, setStats] = useState([
        { label: 'Class Students', value: '0', icon: <Users size={24} />, trend: 0 },
        { label: 'Sessions This Week', value: '0', icon: <Calendar size={24} />, trend: 0 },
        { label: 'Avg Attendance', value: '0', suffix: '%', icon: <BarChart3 size={24} />, trend: 0 },
    ]);

    useEffect(() => {
        setIsOnline(navigator.onLine);

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        updateOfflineCount();
        fetchStats();

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch(apiUrl('/api/cr/stats'));
            const data = await res.json();

            if (data.success) {
                setStats([
                    {
                        label: 'Class Students',
                        value: data.data.classStudents.toString(),
                        icon: <Users size={24} />,
                        trend: 0
                    },
                    {
                        label: 'Sessions This Week',
                        value: data.data.sessionsThisWeek.toString(),
                        icon: <Calendar size={24} />,
                        trend: 0
                    },
                    {
                        label: 'Avg Attendance',
                        value: data.data.avgAttendance.toString(),
                        suffix: '%',
                        icon: <BarChart3 size={24} />,
                        trend: 0
                    },
                ]);
            }
        } catch (error) {
            console.error('Error fetching CR stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateOfflineCount = async () => {
        const records = await getOfflineRecords();
        setOfflineCount(records.length);
    };

    const handleSync = async () => {
        if (!isOnline) return;
        setSyncing(true);

        try {
            const records = await getOfflineRecords();
            await new Promise(r => setTimeout(r, 1000));
            await clearSyncedRecords(records.map(r => r.id));
            await updateOfflineCount();
            alert('Sync successful!');
        } catch (error) {
            console.error('Sync failed', error);
            alert('Sync failed');
        } finally {
            setSyncing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-full p-4 md:p-6 lg:p-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        CR Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your class attendance and records
                    </p>
                </div>
                <div className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all duration-200 ${isOnline
                    ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                    {isOnline ? <Wifi size={18} /> : <WifiOff size={18} />}
                    <span>{isOnline ? 'Online' : 'Offline Mode'}</span>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="mb-8">
                <Stats stats={stats} />
            </div>

            {/* Content Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Offline Sync Management Card */}
                <Card padding="default">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                                <UploadCloud size={20} className="text-purple-700 dark:text-purple-400" />
                                Offline Records
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Records stored locally waiting to be synced
                            </p>
                        </div>
                        <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                            <span className="text-xl font-bold text-purple-700 dark:text-purple-400">{offlineCount}</span>
                        </div>
                    </div>

                    <Button
                        onClick={handleSync}
                        disabled={!isOnline || offlineCount === 0 || syncing}
                        variant="primary"
                        fullWidth
                        leftIcon={syncing ? <UploadCloud className="animate-bounce" size={20} /> : <UploadCloud size={20} />}
                    >
                        {syncing ? 'Syncing...' : 'Sync Now'}
                    </Button>

                    {!isOnline && (
                        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                <strong>Offline Mode:</strong> You're currently offline. Records will sync automatically when connection is restored.
                            </p>
                        </div>
                    )}
                </Card>

                {/* Session Management Options Card */}
                <Card padding="default">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Calendar size={20} className="text-purple-700 dark:text-purple-400" />
                        Session Management
                    </h2>
                    <div className="space-y-3">
                        <Button
                            variant="outline"
                            fullWidth
                            leftIcon={<CheckCircle size={18} />}
                            className="justify-start"
                        >
                            Manual Attendance Sheet
                        </Button>
                        <Button
                            variant="outline"
                            fullWidth
                            leftIcon={<FileText size={18} />}
                            className="justify-start"
                        >
                            Generate Reports
                        </Button>
                        <Button
                            variant="outline"
                            fullWidth
                            leftIcon={<Users size={18} />}
                            className="justify-start"
                        >
                            Manage Class List
                        </Button>
                        <Button
                            variant="outline"
                            fullWidth
                            leftIcon={<Settings size={18} />}
                            className="justify-start"
                        >
                            Class Settings
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Note about activity */}
            <div className="mt-6">
                <Card padding="default">
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <BarChart3 size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Recent activity will appear here</p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
