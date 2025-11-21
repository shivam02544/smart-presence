import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { getSession } from '@/lib/auth';
import User from '@/models/User';
import ClassSession from '@/models/ClassSession';
import AttendanceRecord from '@/models/AttendanceRecord';
import Batch from '@/models/Batch'; // Import Batch model to register schema

export async function GET(request) {
    try {
        await dbConnect();
        const session = await getSession();

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get real statistics
        const totalStudents = await User.countDocuments({ role: { $in: ['STUDENT', 'CR'] } });
        const activeTeachers = await User.countDocuments({ role: 'TEACHER' });

        // Today's sessions
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todaySessions = await ClassSession.countDocuments({
            createdAt: { $gte: today }
        });

        // Calculate today's average attendance
        const todayRecords = await AttendanceRecord.find({
            markedAt: { $gte: today }
        }).populate('sessionId').lean();

        const sessionsWithAttendance = new Set(todayRecords.map(r => r.sessionId?._id?.toString()).filter(Boolean));
        let avgAttendance = 0;
        if (sessionsWithAttendance.size > 0) {
            const sessionAttendanceRates = [];
            for (const sessionId of sessionsWithAttendance) {
                const session = await ClassSession.findById(sessionId).populate('batchId').lean();
                if (session?.batchId?.students) {
                    const totalStudentsInBatch = session.batchId.students.length;
                    const presentCount = todayRecords.filter(r => r.sessionId?._id?.toString() === sessionId).length;
                    if (totalStudentsInBatch > 0) {
                        sessionAttendanceRates.push((presentCount / totalStudentsInBatch) * 100);
                    }
                }
            }
            if (sessionAttendanceRates.length > 0) {
                avgAttendance = Math.round(sessionAttendanceRates.reduce((a, b) => a + b, 0) / sessionAttendanceRates.length);
            }
        }

        // Active sessions (currently open)
        const activeSessions = await ClassSession.countDocuments({ status: 'ACTIVE' });

        // Proxy/anomaly flags
        const flaggedRecords = await AttendanceRecord.countDocuments({
            flags: { $exists: true, $ne: [] }
        });

        // Get departments count for active sessions
        const activeSessionDocs = await ClassSession.find({ status: 'ACTIVE' })
            .populate('batchId', 'department')
            .lean();
        const departments = new Set(activeSessionDocs.map(s => s.batchId?.department).filter(Boolean));

        return NextResponse.json({
            success: true,
            data: {
                totalStudents,
                activeTeachers,
                todaySessions,
                avgAttendance,
                activeSessions,
                flaggedRecords,
                departmentsCount: departments.size
            }
        });

    } catch (error) {
        console.error('Admin stats error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
