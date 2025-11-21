"use client";

import { useState, useEffect } from "react";
import {
    User,
    Mail,
    Phone,
    Calendar,
    Award,
    Globe,
    BarChart3,
    Hash,
} from "lucide-react";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/composite/LoadingSpinner";

export default function StudentProfilePage() {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({
        name: "Loading...",
        email: "loading@example.com",
        rollNumber: "N/A",
        batch: "N/A",
        section: "N/A",
        phone: "N/A",
        enrollmentDate: "N/A",
        totalSessions: 0,
        presentSessions: 0,
        attendanceRate: "0%",
        deviceId: "N/A",
        ipAddress: "N/A",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/students/profile");
                const data = await res.json();

                if (data.success) {
                    setProfile({
                        name: data.data.name || "Unknown",
                        email: data.data.email || "N/A",
                        rollNumber: data.data.rollNumber || "N/A",
                        batch: data.data.batch?.name || "N/A",
                        section: data.data.batch?.section || "N/A",
                        phone: data.data.phone || "Not provided",
                        enrollmentDate: data.data.enrollmentDate
                            ? new Date(data.data.enrollmentDate).toLocaleDateString()
                            : "N/A",
                        totalSessions: data.data.totalSessions || 0,
                        presentSessions: data.data.presentSessions || 0,
                        attendanceRate: data.data.attendanceRate || "0%",
                        deviceId: data.data.deviceId || "Not registered",
                        ipAddress: data.data.ipAddress || "N/A",
                    });
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <LoadingSpinner />
            </div>
        );
    }

    const attendancePercent = parseFloat(profile.attendanceRate) || 0;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    My Profile
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    View your academic and attendance information
                </p>
            </div>

            {/* Profile Overview */}
            <Card>
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <User size={20} /> Personal Information
                    </h2>
                </div>
                <div className="p-6 grid gap-6 md:grid-cols-2">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                            <User size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="font-semibold">{profile.name}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                            <Mail size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-semibold">{profile.email}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                            <Hash size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Roll Number</p>
                            <p className="font-semibold">{profile.rollNumber}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                            <Phone size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Phone Number</p>
                            <p className="font-semibold">{profile.phone}</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Academic Information */}
            <Card>
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Award size={20} /> Academic Details
                    </h2>
                </div>
                <div className="p-6 grid gap-6 md:grid-cols-3">
                    <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        <p className="text-sm text-gray-500 mb-1">Batch</p>
                        <p className="text-lg font-bold">{profile.batch}</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        <p className="text-sm text-gray-500 mb-1">Section</p>
                        <p className="text-lg font-bold">{profile.section}</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        <p className="text-sm text-gray-500 mb-1">Enrollment Date</p>
                        <p className="text-lg font-bold">{profile.enrollmentDate}</p>
                    </div>
                </div>
            </Card>

            {/* Attendance Statistics */}
            <Card>
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <BarChart3 size={20} /> Attendance Overview
                    </h2>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                            <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">
                                Attendance Rate
                            </p>
                            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                {profile.attendanceRate}
                            </p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                            <p className="text-sm text-green-600 dark:text-green-400 mb-1">
                                Present
                            </p>
                            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                {profile.presentSessions}
                            </p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                            <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">
                                Total Sessions
                            </p>
                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                {profile.totalSessions}
                            </p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600 dark:text-gray-400">
                                Overall Progress
                            </span>
                            <span className="font-semibold">{profile.attendanceRate}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div
                                className={`h-3 rounded-full transition-all ${attendancePercent >= 75
                                    ? "bg-green-500"
                                    : attendancePercent >= 60
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                    }`}
                                style={{ width: `${attendancePercent}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Device Information */}
            <Card>
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Globe size={20} /> Registered Device
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    {profile.deviceId === "Not registered" ? (
                        <div className="p-6 text-center rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 w-16 h-16 mx-auto flex items-center justify-center mb-4">
                                <Globe size={32} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">No Device Registered Yet</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Mark your first attendance to register your device automatically.
                            </p>
                            <a href="/student/mark">
                                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                                    Mark Attendance Now
                                </button>
                            </a>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                                    <Calendar size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500">Device ID</p>
                                    <p className="font-mono text-sm font-semibold break-all">
                                        {profile.deviceId}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400">
                                    <Globe size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500">Last IP Address</p>
                                    <p className="font-mono text-sm font-semibold">
                                        {profile.ipAddress === "::1" ? "localhost (testing)" : profile.ipAddress}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                                <p className="text-sm text-amber-800 dark:text-amber-300">
                                    <strong>Note:</strong> Your attendance is linked to your
                                    registered device. Using a different device may trigger proxy
                                    detection alerts.
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
}
