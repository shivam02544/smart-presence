import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { getSession } from '@/lib/auth';
import ClassSession from '@/models/ClassSession';
import Course from '@/models/Course';
import AttendanceRecord from '@/models/AttendanceRecord';
import StudentProfile from '@/models/StudentProfile';

export async function GET(request) {
    try {
        await dbConnect();
        const session = await getSession();

        if (!session || session.user.role !== 'TEACHER') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const teacherId = session.user._id;

        // Get today's sessions count
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todaySessions = await ClassSession.countDocuments({
            teacherId,
            createdAt: { $gte: today, $lt: tomorrow }
        });

        // Get all teacher's courses
        const allSessions = await ClassSession.find({ teacherId }).lean();
        const courseIds = [...new Set(allSessions.map(s => s.courseId?.toString()).filter(Boolean))];
        const courses = await Course.find({ _id: { $in: courseIds } }).lean();

        // Get total unique students across all courses
        const batchIds = [...new Set(courses.map(c => c.batchId?.toString()).filter(Boolean))];
        const totalStudents = await StudentProfile.countDocuments({
            batchId: { $in: batchIds }
        });

        // Calculate average session duration
        const sessionsWithDuration = allSessions.filter(s => s.startTime && s.endTime);
        let avgDuration = 0;

        if (sessionsWithDuration.length > 0) {
            const totalMinutes = sessionsWithDuration.reduce((sum, session) => {
                const start = new Date(session.startTime);
                const end = new Date(session.endTime);
                const minutes = Math.floor((end - start) / (1000 * 60));
                return sum + minutes;
            }, 0);
            avgDuration = Math.round(totalMinutes / sessionsWithDuration.length);
        }

        return NextResponse.json({
            success: true,
            data: {
                todaySessions,
                totalStudents,
                avgDuration
            }
        });

    } catch (error) {
        console.error('Teacher stats error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
