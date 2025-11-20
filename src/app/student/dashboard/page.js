import Link from 'next/link';
import { QrCode, Calendar, UserCheck, TrendingUp, Clock } from 'lucide-react';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import AttendanceRecord from '@/models/AttendanceRecord';
import ClassSession from '@/models/ClassSession';
import Stats from '@/components/ui/Stats';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/composite/EmptyState';

export const dynamic = 'force-dynamic';

async function getStudentStats(studentId) {
    await dbConnect();
    const totalPresent = await AttendanceRecord.countDocuments({
        studentId,
        status: 'PRESENT'
    });
    
    const totalSessions = await AttendanceRecord.countDocuments({
        studentId
    });
    
    const attendanceRate = totalSessions > 0 ? Math.round((totalPresent / totalSessions) * 100) : 0;
    
    return { totalPresent, totalSessions, attendanceRate };
}

async function getUpcomingSessions(studentId) {
    await dbConnect();
    // Get student's batch to find relevant sessions
    // For now, return empty array - would need to implement batch lookup
    return [];
}

export default async function StudentDashboard() {
    const session = await getSession();
    const statsData = await getStudentStats(session.user._id);
    const upcomingSessions = await getUpcomingSessions(session.user._id);

    const stats = [
        {
            label: 'Classes Attended',
            value: statsData.totalPresent,
            icon: <UserCheck size={24} />,
            trend: 5
        },
        {
            label: 'Total Sessions',
            value: statsData.totalSessions,
            icon: <Calendar size={24} />,
        },
        {
            label: 'Attendance Rate',
            value: statsData.attendanceRate,
            suffix: '%',
            icon: <TrendingUp size={24} />,
            trend: statsData.attendanceRate >= 75 ? 2.5 : -2.5
        },
    ];

    return (
        <div className="p-6 lg:p-8 space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Student Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Welcome back, <span className="text-purple-700 font-medium">{session.user.name}</span>
                    </p>
                </div>
                <Link href="/student/mark">
                    <Button variant="primary" size="lg" leftIcon={<QrCode size={20} />}>
                        Mark Attendance
                    </Button>
                </Link>
            </div>

            {/* Stats Row */}
            <Stats stats={stats} />

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions Card */}
                <Link href="/student/mark" className="block">
                    <Card hover={true} className="h-full p-8 flex flex-col items-center justify-center text-center group">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-700 to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <QrCode size={40} className="text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Mark Attendance</h2>
                        <p className="text-gray-600 mb-6">Enter session code to mark your presence</p>
                        <Button variant="outline" className="group-hover:bg-purple-50">
                            Get Started
                        </Button>
                    </Card>
                </Link>

                {/* Upcoming Sessions */}
                <Card className="p-6 lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Clock size={20} className="text-purple-700" /> Upcoming Sessions
                        </h2>
                    </div>

                    {upcomingSessions.length > 0 ? (
                        <div className="space-y-4">
                            {upcomingSessions.map((session) => (
                                <Card key={session._id} variant="outlined" className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{session.courseName}</h3>
                                            <p className="text-sm text-gray-600 mt-1">{session.topic}</p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                {new Date(session.scheduledAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={<Calendar size={48} />}
                            title="No Upcoming Sessions"
                            description="Your upcoming class sessions will appear here"
                        />
                    )}
                </Card>
            </div>
        </div>
    );
}
