import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { getSession } from '@/lib/auth';
import ClassSession from '@/models/ClassSession';
import AttendanceRecord from '@/models/AttendanceRecord';
import StudentProfile from '@/models/StudentProfile';
import User from '@/models/User';
import Batch from '@/models/Batch';

export async function GET(request, { params }) {
    try {
        await dbConnect();
        const session = await getSession();

        if (!session || session.user.role !== 'TEACHER') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id: courseId } = params;

        // Get all sessions for this course
        const sessions = await ClassSession.find({ courseId }).lean();
        const sessionIds = sessions.map(s => s._id);

        if (sessions.length === 0) {
            return NextResponse.json({
                success: true,
                data: {
                    totalClasses: 0,
                    avgAttendance: 0,
                    students: []
                }
            });
        }

        // Get all attendance records for these sessions
        const attendanceRecords = await AttendanceRecord.find({
            sessionId: { $in: sessionIds }
        }).lean();

        // Get unique students from attendance
        const studentIds = [...new Set(attendanceRecords.map(r => r.studentId.toString()))];

        // Fetch student details
        const students = await Promise.all(
            studentIds.map(async (studentId) => {
                const user = await User.findById(studentId).lean();
                const profile = await StudentProfile.findOne({ userId: studentId }).lean();

                // Calculate attendance for this student
                const studentAttendance = attendanceRecords.filter(
                    r => r.studentId.toString() === studentId
                );
                const attendancePercentage = Math.round(
                    (studentAttendance.length / sessions.length) * 100
                );

                return {
                    name: user?.name || 'Unknown',
                    roll: profile?.rollNumber || 'N/A',
                    attendance: attendancePercentage
                };
            })
        );

        // Calculate average attendance
        const totalAttendance = students.reduce((sum, s) => sum + s.attendance, 0);
        const avgAttendance = students.length > 0
            ? Math.round(totalAttendance / students.length)
            : 0;

        return NextResponse.json({
            success: true,
            data: {
                totalClasses: sessions.length,
                avgAttendance,
                students: students.sort((a, b) => a.roll.localeCompare(b.roll))
            }
        });

    } catch (error) {
        console.error('Fetch report error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
