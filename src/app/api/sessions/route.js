import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ClassSession from '@/models/ClassSession';
import { getSession } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
    try {
        await dbConnect();
        const session = await getSession();
        if (!session || session.user.role !== 'TEACHER') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { subjectId, batchId } = body;

        // Generate initial secrets
        const sessionCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit code
        const currentQRToken = uuidv4();

        const newSession = await ClassSession.create({
            teacherId: session.user._id,
            subjectId,
            batchId,
            sessionCode,
            currentQRToken,
            status: 'ACTIVE',
        });

        return NextResponse.json({ success: true, session: newSession }, { status: 201 });

    } catch (error) {
        console.error('Create session error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
