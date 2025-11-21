import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { getSession } from '@/lib/auth';
import StudentProfile from '@/models/StudentProfile';
import Batch from '@/models/Batch';
import ClassSession from '@/models/ClassSession';
import AttendanceRecord from '@/models/AttendanceRecord';

export async function GET(request) {
    try {
        await dbConnect();
        const session = await getSession();

        if (!session || session.user.role !== 'CR') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const crId = session.user._id;

        // Get CR's profile to find their batch
        const crProfile = await StudentProfile.findOne({ userId: crId }).lean();

        if (!crProfile || !crProfile.batchId) {
            return NextResponse.json({
                success: true,
                data: {
                    classStudents: 0,
                    sessionsThisWeek: 0,
                    avgAttendance: 0
                }
            });
        }

        const batchId = crProfile.batchId;

        // Count students in the same batch
        const classStudents = await StudentProfile.countDocuments({ batchId });

        // Get sessions for this week
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week
        weekStart.setHours(0, 0, 0, 0);

        const sessionsThisWeek = await ClassSession.countDocuments({
            batchId,
            createdAt: { $gte: weekStart }
        });

        // Calculate average attendance for the batch
        const allSessionsForBatch = await ClassSession.find({ batchId }).lean();
        const sessionIds = allSessionsForBatch.map(s => s._id);

        let avgAttendance = 0;
        if (sessionIds.length > 0) {
            const totalAttendance = await AttendanceRecord.countDocuments({
                sessionId: { $in: sessionIds },
                status: 'PRESENT'
            });

            const totalPossible = sessionIds.length * classStudents;
            avgAttendance = totalPossible > 0
                ? Math.round((totalAttendance / totalPossible) * 100)
                : 0;
        }

        return NextResponse.json({
            success: true,
            data: {
                classStudents,
                sessionsThisWeek,
                avgAttendance
            }
        });

    } catch (error) {
        console.error('CR stats error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
