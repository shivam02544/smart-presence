'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Users, Lock, Unlock, AlertTriangle, ArrowLeft } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Table from '@/components/composite/Table';
import LoadingSpinner from '@/components/composite/LoadingSpinner';
import EmptyState from '@/components/composite/EmptyState';

export default function LiveSessionPage({ params }) {
    const { id } = params;
    const [sessionData, setSessionData] = useState(null);
    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const res = await fetch(`/api/sessions/${id}`);
                const data = await res.json();
                if (data.success) {
                    setSessionData(data.session);
                    setAttendees(data.attendees);
                }
            } catch (error) {
                console.error('Error fetching session:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
        const interval = setInterval(fetchSession, 5000);
        return () => clearInterval(interval);
    }, [id]);

    const toggleStatus = async () => {
        if (!sessionData) return;
        const newStatus = sessionData.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';

        try {
            await fetch(`/api/sessions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            setSessionData({ ...sessionData, status: newStatus });
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
                <LoadingSpinner size="large" />
            </div>
        );
    }
    
    if (!sessionData) {
        return (
            <div className="p-6 lg:p-8">
                <EmptyState
                    icon={<AlertTriangle size={64} />}
                    title="Session not found"
                    description="The session you're looking for doesn't exist."
                    actionLabel="Back to Dashboard"
                    actionHref="/teacher/dashboard"
                />
            </div>
        );
    }

    const columns = [
        {
            header: 'Student',
            accessor: 'student',
            render: (_, row) => (
                <span className="font-semibold text-gray-900">
                    {row.studentId?.name}
                </span>
            )
        },
        {
            header: 'Roll No',
            accessor: 'rollNo',
            render: (_, row) => (
                <span className="text-gray-700">
                    {row.studentId?.email}
                </span>
            )
        },
        {
            header: 'Time',
            accessor: 'time',
            render: (_, row) => (
                <span className="text-gray-600">
                    {new Date(row.markedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (_, row) => (
                row.flags && row.flags.length > 0 ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-error-50 text-error-600 text-xs font-semibold rounded-md">
                        <AlertTriangle size={14} />
                        Suspicious
                    </span>
                ) : (
                    <span className="inline-flex items-center px-2.5 py-1 bg-success-50 text-success-600 text-xs font-semibold rounded-md">
                        Verified
                    </span>
                )
            )
        }
    ];

    return (
        <div className="p-6 lg:p-8">
            {/* Back Link */}
            <Link 
                href="/teacher/dashboard" 
                className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-700 mb-6 transition-colors group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
                <span className="text-sm font-medium">Back to Dashboard</span>
            </Link>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {sessionData.subjectId?.name}
                        <span className="text-gray-500 font-normal ml-2">({sessionData.subjectId?.code})</span>
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <span>Batch: <span className="font-semibold text-gray-900">{sessionData.batchId?.name}</span></span>
                        <span>•</span>
                        <span>Code: <span className="font-mono font-bold text-purple-700 text-lg">{sessionData.sessionCode}</span></span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Card padding="sm" className="text-center min-w-[100px]">
                        <p className="text-xs text-gray-600 mb-1">Present</p>
                        <p className="text-3xl font-bold text-success-600">{attendees.length}</p>
                    </Card>
                    <Button
                        onClick={toggleStatus}
                        variant={sessionData.status === 'ACTIVE' ? 'primary' : 'secondary'}
                        size="medium"
                        leftIcon={sessionData.status === 'ACTIVE' ? <Lock size={18} /> : <Unlock size={18} />}
                        className={sessionData.status === 'ACTIVE' ? 'bg-error-600 hover:bg-error-700' : 'bg-success-600 hover:bg-success-700 text-white border-success-600'}
                    >
                        {sessionData.status === 'ACTIVE' ? 'Close Session' : 'Re-open Session'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* QR Code Card */}
                <Card className="lg:col-span-1">
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                        {sessionData.status === 'ACTIVE' ? (
                            <>
                                <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 mb-6">
                                    <QRCodeSVG
                                        value={JSON.stringify({
                                            s: sessionData._id,
                                            t: sessionData.currentQRToken
                                        })}
                                        size={200}
                                        className="w-full h-auto"
                                    />
                                </div>
                                <p className="text-base font-medium text-gray-900 mb-2">
                                    Scan to mark attendance
                                </p>
                                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                                    <RefreshCw size={14} className="animate-spin text-purple-700" />
                                    <span>QR refreshes automatically</span>
                                </div>
                            </>
                        ) : (
                            <div className="py-8">
                                <div className="p-6 bg-gray-100 border border-gray-200 rounded-xl mb-4 inline-block">
                                    <Lock size={64} className="text-gray-400" />
                                </div>
                                <p className="text-lg font-semibold text-gray-900">Session is Closed</p>
                                <p className="text-sm text-gray-600 mt-1">No new attendance can be marked</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Attendance Table Card */}
                <Card className="lg:col-span-2" padding="none">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h2 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                            <Users size={20} className="text-purple-700" />
                            <span>Live Attendees</span>
                            <span className="ml-auto flex items-center gap-2 text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full font-medium">
                                <div className="w-2 h-2 bg-purple-700 rounded-full animate-pulse"></div>
                                Live Updates
                            </span>
                        </h2>
                    </div>

                    {attendees.length > 0 ? (
                        <Table columns={columns} data={attendees} />
                    ) : (
                        <div className="p-16">
                            <EmptyState
                                icon={<Users size={48} />}
                                title="Waiting for students to join..."
                                description="Students can scan the QR code to mark attendance"
                            />
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
