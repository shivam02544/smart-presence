import Link from 'next/link';
import { Users, BookOpen, BarChart3, Settings, Plus, FileText, Activity } from 'lucide-react';
import Stats from '@/components/ui/Stats';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function AdminDashboard() {
    const stats = [
        {
            label: 'Total Students',
            value: '1,234',
            icon: <Users size={24} />,
            trend: 12
        },
        {
            label: 'Active Teachers',
            value: '45',
            icon: <BookOpen size={24} />,
            trend: 5
        },
        {
            label: 'Avg Attendance',
            value: 87,
            suffix: '%',
            icon: <BarChart3 size={24} />,
            trend: 2.1
        },
    ];

    return (
        <div className="bg-gray-50 min-h-full p-4 md:p-6 lg:p-8">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Admin Dashboard
                </h1>
                <p className="text-gray-600">
                    Overview of your institution's performance
                </p>
            </div>

            {/* Stats Row - 3 columns on desktop, 1 on mobile */}
            <div className="mb-8">
                <Stats stats={stats} />
            </div>

            {/* Content Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions Card */}
                <Card padding="default">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <ZapIcon /> Quick Actions
                    </h2>
                    <div className="space-y-3">
                        <Link href="/admin/users/create" className="block">
                            <Button variant="outline" className="w-full justify-start" leftIcon={<Users size={18} />}>
                                Add New User
                            </Button>
                        </Link>
                        <Link href="/admin/courses/create" className="block">
                            <Button variant="outline" className="w-full justify-start" leftIcon={<BookOpen size={18} />}>
                                Manage Courses
                            </Button>
                        </Link>
                        <Link href="/admin/reports" className="block">
                            <Button variant="outline" className="w-full justify-start" leftIcon={<FileText size={18} />}>
                                View Global Reports
                            </Button>
                        </Link>
                    </div>
                </Card>

                {/* Recent Activity Card */}
                <Card padding="default" className="lg:col-span-2">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Activity size={20} className="text-purple-700" /> Recent Activity
                    </h2>
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200 hover:bg-purple-50 hover:border-purple-200 transition-colors group"
                            >
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 group-hover:scale-110 transition-transform">
                                    <Users size={18} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                        New teacher registered
                                    </p>
                                    <p className="text-xs text-gray-600 mt-0.5">
                                        Prof. Sarah Johnson joined the Computer Science department
                                    </p>
                                </div>
                                <span className="text-xs text-gray-500">2h ago</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}

function ZapIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-700"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
}
