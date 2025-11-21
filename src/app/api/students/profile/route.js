import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { getSession } from '@/lib/auth';
import AttendanceRecord from '@/models/AttendanceRecord';
import ClassSession from '@/models/ClassSession';
import StudentProfile from '@/models/StudentProfile';
import User from '@/models/User';
import Batch from '@/models/Batch';

export async function GET(request) {
    try {
        await dbConnect();
        const session = await getSession();

        if (!session || session.user.role !== 'STUDENT') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const studentId = session.user._id;

        // Get student profile
        const profile = await StudentProfile.findOne({ userId: studentId })
            .populate('batchId')
            .lean();

        // Get user details
        const user = await User.findById(studentId).lean();

        // Get attendance records
        const records = await AttendanceRecord.find({ studentId }).lean();

        // Calculate statistics
        const totalSessions = await ClassSession.countDocuments({
            batchId: profile?.batchId?._id,
            status: { $in: ['ACTIVE', 'CLOSED'] }
        });

        const presentCount = records.filter(r => r.status === 'PRESENT').length;

        const attendanceRate = totalSessions > 0
            ? Math.round((presentCount / totalSessions) * 100)
            : 0;

        // Get device info from most recent attendance record
        const latestRecord = records.sort((a, b) =>
            new Date(b.markedAt) - new Date(a.markedAt)
        )[0];

        return NextResponse.json({
            success: true,
            data: {
                name: user?.name || 'Unknown',
                email: user?.email || 'N/A',
                rollNumber: profile?.rollNumber || 'N/A',
                batch: profile?.batchId || { name: 'N/A', section: 'N/A' },
                phone: profile?.phone || user?.phone || 'Not provided',
                enrollmentDate: profile?.enrollmentDate || user?.createdAt || new Date(),
                totalSessions,
                presentSessions: presentCount,
                attendanceRate: `${attendanceRate}%`,
                deviceId: latestRecord?.deviceId || 'Not registered',
                ipAddress: latestRecord?.ipAddress || 'N/A'
            }
        });

    } catch (error) {
        console.error('Student profile error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
