import Link from 'next/link';
import { Plus, Calendar, Clock, Users } from 'lucide-react';
import dbConnect from '@/lib/db';
import ClassSession from '@/models/ClassSession';
import { getSession } from '@/lib/auth';
import Stats from '@/components/ui/Stats';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Table from '@/components/composite/Table';
import EmptyState from '@/components/composite/EmptyState';

export const dynamic = 'force-dynamic';

async function getTeacherSessions(teacherId) {
    await dbConnect();
    return await ClassSession.find({ teacherId })
        .sort({ createdAt: -1 })
        .populate('subjectId', 'name code')
        .populate('batchId', 'name section')
        .limit(10);
}

export default async function TeacherDashboard() {
    const session = await getSession();
    const sessions = await getTeacherSessions(session.user._id);

    const stats = [
        {
            label: "Today's Classes",
            value: 3,
            icon: <Calendar size={24} />,
            trend: 0
        },
        {
            label: 'Total Students',
            value: 156,
            icon: <Users size={24} />,
            trend: 12
        },
        {
            label: 'Avg Duration',
            value: 55,
            suffix: 'm',
            icon: <Clock size={24} />,
            trend: -2
        },
    ];

    const columns = [
        {
            header: 'Subject',
            accessor: 'subject',
            render: (_, row) => (
                <div>
                    <div className="font-semibold text-gray-900">
                        {row.subjectId?.name}
                    </div>
                    <div className="text-xs text-gray-500 md:hidden mt-1">
                        {row.batchId?.name} - {row.batchId?.section}
                    </div>
                </div>
            )
        },
        {
            header: 'Batch',
            accessor: 'batch',
            render: (_, row) => (
                <span className="text-gray-700">
                    {row.batchId?.name} - {row.batchId?.section}
                </span>
            )
        },
        {
            header: 'Date',
            accessor: 'date',
            render: (_, row) => (
                <div>
                    <div className="text-sm text-gray-900">
                        {new Date(row.startTime).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                        {new Date(row.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (_, row) => (
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
                    ${row.status === 'ACTIVE'
                        ? 'bg-success-50 text-success-600'
                        : 'bg-gray-100 text-gray-600'}`}>
                    {row.status}
                </span>
            )
        },
        {
            header: 'Action',
            accessor: 'action',
            render: (_, row) => (
                <div className="text-right">
                    <Link href={`/teacher/session/${row._id}`}>
                        <Button variant="ghost" size="sm">
                            View
                        </Button>
                    </Link>
                </div>
            )
        }
    ];

    return (
        <div className="p-6 lg:p-8 space-y-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Teacher Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Welcome back, <span className="text-purple-700 font-medium">{session.user.name}</span>
                    </p>
                </div>
                <Link href="/teacher/session/create">
                    <Button variant="primary" size="large" leftIcon={<Plus size={20} />}>
                        Start New Session
                    </Button>
                </Link>
            </div>

            {/* Stats Overview */}
            <Stats stats={stats} />

            {/* Recent Sessions */}
            <Card>
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">
                        Recent Sessions
                    </h2>
                </div>
                {sessions.length > 0 ? (
                    <Table columns={columns} data={sessions} />
                ) : (
                    <EmptyState
                        icon={<Calendar size={64} />}
                        title="No sessions found"
                        description="Start your first session to begin tracking attendance"
                        actionLabel="Start New Session"
                        actionHref="/teacher/session/create"
                    />
                )}
            </Card>
        </div>
    );
}
