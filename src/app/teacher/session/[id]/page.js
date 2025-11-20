'use client';

import { io } from "socket.io-client";
import * as XLSX from "xlsx";
import { useEffect, useMemo, useState } from 'react';
import {
    QrCode,
    Users,
    Clock,
    Activity,
    LayoutDashboard,
    Download,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const PAGE_SIZE = 10;

// TODO: Replace this with real data from backend / WebSocket
const mockRecords = [
    {
        roll: '23CS001',
        name: 'Aarav Singh',
        joinTime: '10:02:14 AM',
        leaveTime: '10:45:32 AM',
        device: 'Pixel 6 (Android)',
        browser: 'Chrome 120',
        ip: '192.168.1.24',
        flags: [],
        status: 'PRESENT',
    },
    {
        roll: '23CS027',
        name: 'Ritika Sharma',
        joinTime: '10:03:22 AM',
        leaveTime: '10:31:10 AM',
        device: 'Same Device Used Twice',
        browser: 'Chrome 118',
        ip: '192.168.1.25',
        flags: ['DEVICE_DUPLICATE'],
        status: 'FLAGGED',
    },
    {
        roll: '23CS045',
        name: 'Mohit Verma',
        joinTime: '10:05:10 AM',
        leaveTime: null,
        device: 'iPhone 13 (iOS)',
        browser: 'Safari 17',
        ip: '192.168.1.32',
        flags: [],
        status: 'PRESENT',
    },
];

export default function TeacherSessionPage({ params }) {
    const sessionId = params?.id;
    const [viewMode, setViewMode] = useState('simple'); // 'simple' | 'advanced'
    const [timeLeft, setTimeLeft] = useState(10 * 60); // seconds
    const [presentCount, setPresentCount] = useState(0);
    const [records, setRecords] = useState([]);
    const [highlightRecordId, setHighlightRecordId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch real attendance data from backend
    useEffect(() => {

        // WebSocket listener
        useEffect(() => {
            const socket = io("http://localhost:3001");

            socket.emit("joinSession", sessionId);

            socket.on("newAttendance", (entry) => {
                setRecords((prev) => {
                    const updated = [entry, ...prev];
                    setHighlightRecordId(entry.roll); // trigger green animation
                    return updated;
                });
            });

            return () => socket.disconnect();
        }, [sessionId]);


        const fetchRecords = async () => {
            try {
                const res = await fetch(`/api/attendance/session/${sessionId}`);
                const data = await res.json();

                if (data.success) {
                    // Detect newly added entry
                    if (records.length && data.records.length > records.length) {
                        const newEntry = data.records[0];
                        setHighlightRecordId(newEntry.roll);
                    }

                    setRecords(data.records);
                }
            } catch (err) {
                console.error('Fetch failed', err);
            }
        };

        fetchRecords();
    }, [sessionId]);



    // Timer for session countdown
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Keep present count in sync with records
    useEffect(() => {
        const count = records.filter(
            (r) => r.status === 'PRESENT' || r.status === 'FLAGGED'
        ).length;
        setPresentCount(count);
    }, [records]);

    const totalPages = Math.ceil(records.length / PAGE_SIZE) || 1;

    const pagedRecords = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return records.slice(start, start + PAGE_SIZE);
    }, [records, currentPage]);

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const handleExport = () => {
        if (!records || records.length === 0) return alert("No attendance data to export.");

        // Format data for excel
        const formatted = records.map((row) => ({
            Roll: row.roll,
            Name: row.name,
            "Join Time": row.joinTime,
            "Leave Time": row.leaveTime || "-",
            Device: row.device,
            Browser: row.browser,
            IP: row.ip,
            Status: row.status,
            Flags: row.flags?.length ? row.flags.join(", ") : "None",
        }));

        const worksheet = XLSX.utils.json_to_sheet(formatted);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
        XLSX.writeFile(workbook, `session_${sessionId}_attendance.xlsx`);
    };


    const handleCloseSession = () => {
        // TODO: Call API to close session
        alert('Session closed (hook to backend)');
    };

    const handleExtendTime = () => {
        // TODO: Call API to extend session time
        setTimeLeft((prev) => prev + 5 * 60);
    };

    return (
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 space-y-8 animate-fade">
            {/* Header */}
            <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                        Live Attendance Session
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Session ID: <span className="font-mono">{sessionId}</span>
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() =>
                            setViewMode((prev) =>
                                prev === 'simple' ? 'advanced' : 'simple'
                            )
                        }
                    >
                        {viewMode === 'simple' ? (
                            <>
                                <Activity size={16} /> Advanced View
                            </>
                        ) : (
                            <>
                                <LayoutDashboard size={16} /> Simple View
                            </>
                        )}
                    </Button>
                </div>
            </header>

            {/* SIMPLE VIEW */}
            {viewMode === 'simple' && (
                <section className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* QR + timer card */}
                        <Card padding="lg" className="space-y-5">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                QR Attendance
                            </p>

                            {/* QR with animation (uses animate-fade-scale + animate-soft-pulse if added in globals.css) */}
                            <div
                                key={timeLeft} // causes re-animation on change if desired
                                className="relative mx-auto w-44 h-44 flex items-center justify-center animate-fade-scale"
                            >
                                <span className="absolute inset-0 rounded-xl bg-purple-500/10 animate-soft-pulse" />
                                <div className="relative z-10 w-full h-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-black flex items-center justify-center">
                                    <QrCode size={100} />
                                </div>
                            </div>

                            <p className="text-xs text-center text-gray-500 mt-2">
                                Show this code to students. It can be rotated periodically for
                                higher security.
                            </p>
                        </Card>

                        {/* Stats card */}
                        <Card padding="lg" className="space-y-4">
                            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                                <p className="text-xs text-gray-500 flex items-center gap-2">
                                    <Clock size={14} /> Time Remaining
                                </p>
                                <p className="text-3xl font-semibold text-purple-600 dark:text-purple-400 mt-1">
                                    {formatTime(timeLeft)}
                                </p>
                            </div>

                            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                                <p className="text-xs text-gray-500 flex items-center gap-2">
                                    <Users size={14} /> Students Present
                                </p>
                                <p className="text-2xl font-semibold mt-1">{presentCount}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Includes flagged entries as well.
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col gap-3 md:flex-row">
                        <Button
                            variant="gradient"
                            size="lg"
                            className="flex-1"
                            onClick={handleCloseSession}
                        >
                            Close Session
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="flex-1"
                            onClick={handleExtendTime}
                        >
                            Extend Time +5 min
                        </Button>
                    </div>
                </section>
            )}

            {/* ADVANCED VIEW */}
            {viewMode === 'advanced' && (
                <section className="space-y-6">
                    <Card padding="lg" className="space-y-6 overflow-hidden">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <Activity size={18} className="text-purple-500" />
                                    Live Attendance Records
                                </h2>
                                <p className="text-xs text-gray-500 mt-1">
                                    Detailed view of all scans, devices, and potential proxy
                                    attempts.
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1"
                                    onClick={() => handleExport('CSV')}
                                >
                                    <Download size={14} /> CSV
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1"
                                    onClick={handleExport}
                                >
                                    <Download size={14} /> Export Excel
                                </Button>

                            </div>
                        </div>

                        {/* MOBILE – Card feed */}
                        <div className="space-y-3 md:hidden max-h-[60vh] overflow-y-auto pr-1">
                            {records.map((row, i) => (
                                <div
                                    key={i}
                                    className={`border border-gray-200 dark:border-gray-800 rounded-xl p-3 bg-white dark:bg-[#111113] ${highlightRecordId === row.roll ? 'animate-entry' : ''
                                        }`}
                                >

                                    <div className="flex justify-between items-center mb-1">
                                        <p className="font-medium text-sm">
                                            {row.roll} · {row.name}
                                        </p>
                                        <StatusBadge status={row.status} flags={row.flags} />
                                    </div>

                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        Join: {row.joinTime}
                                        {row.leaveTime && ` · Leave: ${row.leaveTime}`}
                                    </p>

                                    <p className="text-[11px] text-gray-500 mt-1">
                                        Device: {row.device}
                                    </p>
                                    <p className="text-[11px] text-gray-500">
                                        Browser: {row.browser}
                                    </p>
                                    <p className="text-[11px] text-gray-500">
                                        IP: {row.ip}
                                    </p>

                                    {row.flags?.length > 0 && (
                                        <p className="text-[11px] text-amber-600 mt-1">
                                            Flags: {row.flags.join(', ')}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* DESKTOP – Table with pagination */}
                        <div className="hidden md:block">
                            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                                <table className="w-full border-collapse">
                                    <thead className="bg-gray-100 dark:bg-[#0f0f11]">
                                        <tr className="text-left text-xs uppercase text-gray-500 tracking-wide">
                                            <th className="py-3 px-4">Roll</th>
                                            <th className="py-3 px-4">Name</th>
                                            <th className="py-3 px-4">Join Time</th>
                                            <th className="py-3 px-4">Leave Time</th>
                                            <th className="py-3 px-4">Device</th>
                                            <th className="py-3 px-4">Browser</th>
                                            <th className="py-3 px-4">IP</th>
                                            <th className="py-3 px-4">Flags / Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-sm">
                                        {pagedRecords.map((row, i) => (
                                            <tr
                                                key={i}
                                                className={`hover:bg-gray-50 dark:hover:bg-[#151518] ${highlightRecordId === row.roll ? 'animate-entry' : ''
                                                    }`}
                                            >
                                                <td className="px-4 py-3 font-medium">{row.roll}</td>
                                                <td className="px-4 py-3">{row.name}</td>
                                                <td className="px-4 py-3">{row.joinTime}</td>
                                                <td className="px-4 py-3">
                                                    {row.leaveTime || '-'}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-300">
                                                    {row.device}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-300">
                                                    {row.browser}
                                                </td>
                                                <td className="px-4 py-3 text-xs font-mono text-gray-500">
                                                    {row.ip}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <StatusBadge status={row.status} flags={row.flags} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                                <p>
                                    Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                                    {Math.min(currentPage * PAGE_SIZE, records.length)} of{' '}
                                    {records.length} entries
                                </p>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={currentPage === 1}
                                        onClick={() =>
                                            setCurrentPage((p) => Math.max(1, p - 1))
                                        }
                                    >
                                        Prev
                                    </Button>
                                    <span>
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={currentPage === totalPages}
                                        onClick={() =>
                                            setCurrentPage((p) =>
                                                Math.min(totalPages, p + 1)
                                            )
                                        }
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </section>
            )}
        </div>
    );
}

/**
 * Status badge for PRESENT / FLAGGED / ABSENT / LATE etc.
 */
function StatusBadge({ status, flags }) {
    const base =
        'px-2 py-1 rounded-full text-[11px] font-semibold inline-flex items-center gap-1';

    const isFlagged = flags && flags.length > 0;

    if (isFlagged || status === 'FLAGGED') {
        return (
            <span className={`${base} bg-amber-600/15 text-amber-700`}>
                ⚠ Flagged
            </span>
        );
    }

    if (status === 'PRESENT') {
        return (
            <span className={`${base} bg-emerald-600/15 text-emerald-700`}>
                ● Present
            </span>
        );
    }

    if (status === 'LATE') {
        return (
            <span className={`${base} bg-blue-600/15 text-blue-700`}>
                ⏱ Late
            </span>
        );
    }

    if (status === 'EXCUSED') {
        return (
            <span className={`${base} bg-indigo-600/15 text-indigo-700`}>
                ✔ Excused
            </span>
        );
    }

    return (
        <span className={`${base} bg-red-600/15 text-red-700`}>
            ✕ Absent
        </span>
    );
}
