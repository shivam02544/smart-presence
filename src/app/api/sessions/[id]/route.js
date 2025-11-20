import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ClassSession from '@/models/ClassSession';
import AttendanceRecord from '@/models/AttendanceRecord';
import User from '@/models/User'; // Ensure User model is registered
import Course from '@/models/Course'; // Ensure Course model is registered
import Batch from '@/models/Batch'; // Ensure Batch model is registered

export async function GET(request, { params }) {
    const { id } = params;
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
    const { id } = params;
    try {
        await dbConnect();
        const body = await request.json();

        const session = await ClassSession.findByIdAndUpdate(id, body, { new: true });

        return NextResponse.json({ success: true, session });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
