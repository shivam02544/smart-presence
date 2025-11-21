import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { getSession } from '@/lib/auth';
import AttendanceRecord from '@/models/AttendanceRecord';
import ClassSession from '@/models/ClassSession';
import StudentProfile from '@/models/StudentProfile';
import User from '@/models/User';

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

        // Get student profile for roll number
        const profile = await StudentProfile.findOne({ userId: studentId });
        const rollNumber = profile?.rollNumber || 'N/A';

        // Get all attendance records for this student
        const records = await AttendanceRecord.find({ studentId })
            .populate('sessionId')
            .lean();

        // Calculate statistics
        const totalSessions = await ClassSession.countDocuments({
            batchId: profile?.batchId,
            status: { $in: ['ACTIVE', 'CLOSED'] }
        });

        const presentCount = records.filter(r => r.status === 'PRESENT').length;
        const flaggedCount = records.filter(r => r.flags && r.flags.length > 0).length;
        
        const attendanceRate = totalSessions > 0 
            ? Math.round((presentCount / totalSessions) * 100) 
            : 0;

        return NextResponse.json({
            success: true,
            data: {
                name: session.user.name,
                roll: rollNumber,
                attendanceRate: `${attendanceRate}%`,
                totalSessions,
                present: presentCount,
                flagged: flaggedCount
            }
        });

    } catch (error) {
        console.error('Student stats error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

