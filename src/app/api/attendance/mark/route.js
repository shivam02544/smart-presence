import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ClassSession from '@/models/ClassSession';
import AttendanceRecord from '@/models/AttendanceRecord';
import StudentProfile from '@/models/StudentProfile';
import { getSession } from '@/lib/auth';

export async function POST(request) {
    try {
        await dbConnect();
        const session = await getSession();
        if (!session || session.user.role !== 'STUDENT') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { sessionCode, deviceId } = await request.json();

        // 1. Find Active Session
        const classSession = await ClassSession.findOne({
            sessionCode,
            status: 'ACTIVE'
        });

        if (!classSession) {
            return NextResponse.json({ error: 'Invalid or closed session code' }, { status: 400 });
        }

        // 2. Check if already marked
        const existingRecord = await AttendanceRecord.findOne({
            sessionId: classSession._id,
            studentId: session.user._id,
        });

        if (existingRecord) {
            return NextResponse.json({ error: 'Attendance already marked' }, { status: 400 });
        }

        // 3. Anti-Proxy: Device Check
        // Fetch student profile to check registered devices
        const profile = await StudentProfile.findOne({ userId: session.user._id });
        let flags = [];

        if (profile) {
            // If no devices registered, register this one
            if (profile.deviceIds.length === 0) {
                profile.deviceIds.push(deviceId);
                await profile.save();
            } else if (!profile.deviceIds.includes(deviceId)) {
                // Unrecognized device
                flags.push('SUSPICIOUS_DEVICE');
            }
        }

        // 4. Anti-Proxy: Check if device used by another student in this session
        const deviceUsed = await AttendanceRecord.findOne({
            sessionId: classSession._id,
            deviceId: deviceId
        });

        if (deviceUsed) {
            flags.push('MULTIPLE_LOGINS_SAME_DEVICE');
            // Strict mode: Block it
            // return NextResponse.json({ error: 'Device already used for attendance' }, { status: 403 });
        }

        // 5. Mark Attendance
        const record = await AttendanceRecord.create({
            sessionId: classSession._id,
            studentId: session.user._id,
            status: 'PRESENT',
            markedBy: 'STUDENT',
            deviceId,
            flags,
        });

        return NextResponse.json({ success: true, record });

    } catch (error) {
        console.error('Mark attendance error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
