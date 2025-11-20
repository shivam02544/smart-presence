'use client';

import { useState, useEffect } from 'react';
import { Users, Calendar, BarChart3, Wifi, WifiOff, UploadCloud, CheckCircle, FileText, Settings } from 'lucide-react';
import { saveOfflineAttendance, getOfflineRecords, clearSyncedRecords } from '@/lib/offline';
import Stats from '@/components/ui/Stats';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function CRDashboard() {
    const [isOnline, setIsOnline] = useState(true);
    const [offlineCount, setOfflineCount] = useState(0);
    const [syncing, setSyncing] = useState(false);

    useEffect(() => {
        setIsOnline(navigator.onLine);

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        updateOfflineCount();

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

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

    // Class statistics for CR dashboard
    const stats = [
        {
            label: 'Class Students',
            value: 42,
            icon: <Users size={24} />,
            trend: 2
        },
        {
            label: 'Sessions This Week',
            value: 8,
            icon: <Calendar size={24} />,
            trend: 0
        },
        {
            label: 'Avg Attendance',
            value: 89,
            suffix: '%',
            icon: <BarChart3 size={24} />,
            trend: 5.2
        },
    ];

    return (
        <div className="bg-gray-50 min-h-full p-4 md:p-6 lg:p-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        CR Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Manage your class attendance and records
                    </p>
                </div>
                <div className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all duration-200 ${
                    isOnline 
                        ? 'bg-success-50 text-success-700 border border-success-200' 
                        : 'bg-error-50 text-error-700 border border-error-200'
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
                            <h2 className="text-xl font-semibold text-gray-900 mb-1 flex items-center gap-2">
                                <UploadCloud size={20} className="text-purple-700" />
                                Offline Records
                            </h2>
                            <p className="text-sm text-gray-600">
                                Records stored locally waiting to be synced
                            </p>
                        </div>
                        <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full">
                            <span className="text-xl font-bold text-purple-700">{offlineCount}</span>
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
                        <div className="mt-4 p-4 bg-warning-50 border border-warning-200 rounded-lg">
                            <p className="text-sm text-warning-700">
                                <strong>Offline Mode:</strong> You're currently offline. Records will sync automatically when connection is restored.
                            </p>
                        </div>
                    )}
                </Card>

                {/* Session Management Options Card */}
                <Card padding="default">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Calendar size={20} className="text-purple-700" />
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

            {/* Recent Activity Card */}
            <div className="mt-6">
                <Card padding="default">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <BarChart3 size={20} className="text-purple-700" />
                        Recent Activity
                    </h2>
                    <div className="space-y-3">
                        {[
                            { action: 'Attendance synced', details: '15 records uploaded to server', time: '2h ago', icon: UploadCloud },
                            { action: 'Manual attendance taken', details: 'Session CS101 - 38/42 students present', time: '4h ago', icon: CheckCircle },
                            { action: 'Weekly report generated', details: 'Attendance summary for Week 12', time: '1d ago', icon: FileText },
                            { action: 'Class list updated', details: '2 new students added to roster', time: '2d ago', icon: Users }
                        ].map((activity, index) => {
                            const Icon = activity.icon;
                            return (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200 hover:bg-purple-50 hover:border-purple-200 transition-colors group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 group-hover:scale-110 transition-transform">
                                        <Icon size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">
                                            {activity.action}
                                        </p>
                                        <p className="text-xs text-gray-600 mt-0.5">
                                            {activity.details}
                                        </p>
                                    </div>
                                    <span className="text-xs text-gray-500">{activity.time}</span>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>
        </div>
    );
}
