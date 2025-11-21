import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ClassSession from '@/models/ClassSession';
import AttendanceRecord from '@/models/AttendanceRecord';
import User from '@/models/User'; // Ensure User model is registered
import Course from '@/models/Course'; // Ensure Course model is registered
import Batch from '@/models/Batch'; // Ensure Batch model is registered
import { getSession } from '@/lib/auth';

export async function GET(request, { params }) {
    const { id } = await params;
    try {
        await dbConnect();

        const session = await ClassSession.findById(id)
            .populate('subjectId')
            .populate('batchId');

        if (!session) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        const attendees = await AttendanceRecord.find({ sessionId: id })
            .populate('studentId', 'name email')
            .sort({ markedAt: -1 });

        return NextResponse.json({ success: true, session, attendees });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request, { params }) {
    const { id } = await params;
    try {
        await dbConnect();
        const authSession = await getSession();

        if (!authSession) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const session = await ClassSession.findById(id);
        if (!session) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        // Only teacher who created the session or admin can update it
        if (authSession.user.role !== 'ADMIN' && session.teacherId.toString() !== authSession.user._id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const updatedSession = await ClassSession.findByIdAndUpdate(id, body, { new: true });

        return NextResponse.json({ success: true, session: updatedSession });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
