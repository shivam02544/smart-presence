import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { withAuth } from '@/lib/apiMiddleware';
import Course from '@/models/Course';
import TeacherProfile from '@/models/TeacherProfile';

async function handler(request, context, session) {
    try {
        await dbConnect();

        const teacherId = session.user._id;

        // Get teacher profile to find assigned subjects/courses
        const teacherProfile = await TeacherProfile.findOne({ userId: teacherId }).lean();

        if (!teacherProfile || !teacherProfile.subjects || teacherProfile.subjects.length === 0) {
            return NextResponse.json({
                success: true,
                data: []
            });
        }

        // Fetch courses (stored as subjects in TeacherProfile)
        const courses = await Course.find({
            _id: { $in: teacherProfile.subjects }
        }).lean();

        return NextResponse.json({
            success: true,
            data: courses
        });

    } catch (error) {
        console.error('Fetch courses error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

export const GET = withAuth(handler, ['TEACHER']);
