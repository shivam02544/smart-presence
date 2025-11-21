"use client";

import { useState, useEffect } from "react";
import { BarChart3, Calendar, Download, Filter } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import * as XLSX from "xlsx";
import { apiUrl } from "@/lib/api";

export default function TeacherReportsPage() {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await fetch(apiUrl('/api/teachers/courses'));

            console.log('API Response Status:', res.status, res.statusText);

            if (!res.ok) {
                const errorText = await res.text();
                console.error('API Error - Status:', res.status);
                console.error('API Error - Response:', errorText);

                // If you're not logged in as a teacher, you might see a 401 error
                if (res.status === 401) {
                    alert('Please log in as a teacher to view reports');
                }

                setCourses([]);
                setLoading(false);
                return;
            }

            const data = await res.json();
            console.log('Courses received:', data);

            if (data.success) {
                setCourses(data.data);
                if (data.data.length > 0) {
                    setSelectedCourse(data.data[0]);
                    fetchReportData(data.data[0]._id);
                }
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchReportData = async (courseId) => {
        try {
            setLoading(true);
            const res = await fetch(apiUrl(`/api/teachers/reports/${courseId}`));

            if (!res.ok) {
                throw new Error('Failed to fetch report');
            }

            const data = await res.json();
            if (data.success) {
                setReportData(data.data);
            }
        } catch (error) {
            console.error('Error fetching report:', error);
            setReportData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleCourseSelect = (course) => {
        setSelectedCourse(course);
        fetchReportData(course._id);
    };

    const handleExport = () => {
        if (!reportData || !reportData.students) return;

        const rows = reportData.students.map((s) => ({
            Name: s.name,
            Roll: s.roll,
            "Attendance (%)": s.attendance,
        }));

        const sheet = XLSX.utils.json_to_sheet(rows);
        const book = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(book, sheet, "Report");
        XLSX.writeFile(book, `${selectedCourse?.name || 'Report'}_Attendance.xlsx`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading reports...</p>
                </div>
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div className="space-y-8 animate-fade p-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Attendance Reports
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Analyze student attendance and performance
                    </p>
                </div>
                <Card padding="lg">
                    <div className="text-center py-12">
                        <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No Courses Found</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            You don't have any courses assigned yet. Check the console for error details.
                        </p>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Attendance Reports
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Analyze student attendance and performance
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={handleExport}
                    disabled={!reportData || !reportData.students || reportData.students.length === 0}
                >
                    <Download size={18} className="mr-2" /> Export Report
                </Button>
            </div>

            {/* Content */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1 space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Filter size={18} /> Select Class
                    </h3>
                    <div className="space-y-2">
                        {courses.map((course) => (
                            <button
                                key={course._id}
                                onClick={() => handleCourseSelect(course)}
                                className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${selectedCourse?._id === course._id
                                    ? "bg-purple-50 border-purple-500 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                                    : "hover:bg-gray-50 dark:hover:bg-gray-800 border-transparent"
                                    }`}
                            >
                                <p className="font-medium">{course.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{course.code}</p>
                            </button>
                        ))}
                    </div>
                </Card>

                <div className="md:col-span-2 space-y-6">
                    {reportData ? (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <Card padding="md" className="flex items-center gap-4">
                                    <div className="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                        <Calendar size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Classes</p>
                                        <p className="text-2xl font-bold">{reportData.totalClasses || 0}</p>
                                    </div>
                                </Card>
                                <Card padding="md" className="flex items-center gap-4">
                                    <div className="p-3 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                        <BarChart3 size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Avg Attendance</p>
                                        <p className="text-2xl font-bold">{reportData.avgAttendance || 0}%</p>
                                    </div>
                                </Card>
                            </div>

                            <Card>
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                                    <h3 className="font-bold">Student Performance</h3>
                                </div>
                                {reportData.students && reportData.students.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 uppercase text-xs">
                                                <tr>
                                                    <th className="px-6 py-3">Name</th>
                                                    <th className="px-6 py-3">Roll Number</th>
                                                    <th className="px-6 py-3">Attendance</th>
                                                    <th className="px-6 py-3">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                                {reportData.students.map((student, i) => (
                                                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                        <td className="px-6 py-4 font-medium">{student.name}</td>
                                                        <td className="px-6 py-4">{student.roll}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 max-w-[100px]">
                                                                    <div
                                                                        className={`h-2.5 rounded-full ${student.attendance >= 75
                                                                            ? "bg-green-500"
                                                                            : student.attendance >= 60
                                                                                ? "bg-yellow-500"
                                                                                : "bg-red-500"
                                                                            }`}
                                                                        style={{ width: `${student.attendance}%` }}
                                                                    ></div>
                                                                </div>
                                                                <span>{student.attendance}%</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span
                                                                className={`px-2 py-1 rounded-full text-xs font-medium ${student.attendance >= 75
                                                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                                    }`}
                                                            >
                                                                {student.attendance >= 75 ? "Good" : "Low"}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                                        No student data available
                                    </div>
                                )}
                            </Card>
                        </>
                    ) : (
                        <Card padding="lg">
                            <div className="text-center py-12">
                                <p className="text-gray-600 dark:text-gray-400">
                                    Select a class to view reports
                                </p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
