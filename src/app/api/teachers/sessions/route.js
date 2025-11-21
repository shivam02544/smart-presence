import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { getSession } from '@/lib/auth';
import ClassSession from '@/models/ClassSession';

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

        // Get recent sessions
        const sessions = await ClassSession.find({ teacherId })
            .sort({ createdAt: -1 })
            .populate('courseId', 'name code')
            .populate('batchId', 'name section')
            .limit(10)
            .lean();

        return NextResponse.json({
            success: true,
            data: {
                sessions,
                userName: session.user.name
            }
        });

    } catch (error) {
        console.error('Fetch sessions error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
