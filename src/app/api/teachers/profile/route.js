import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { getSession } from '@/lib/auth';
import User from '@/models/User';
import TeacherProfile from '@/models/TeacherProfile';

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
        const user = await User.findById(teacherId).select('-password').lean();
        const profile = await TeacherProfile.findOne({ userId: teacherId }).lean();

        return NextResponse.json({
            success: true,
            data: {
                name: user?.name || 'Unknown',
                email: user?.email || 'N/A',
                phone: profile?.phone || user?.phone || 'Not provided',
            }
        });

    } catch (error) {
        console.error('Teacher profile fetch error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

export async function PATCH(request) {
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
        const body = await request.json();
        const { name, email, phone } = body;

        // Update user
        if (name || email) {
            await User.findByIdAndUpdate(teacherId, {
                ...(name && { name }),
                ...(email && { email }),
            });
        }

        // Update or create teacher profile
        if (phone) {
            await TeacherProfile.findOneAndUpdate(
                { userId: teacherId },
                { phone },
                { upsert: true, new: true }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully'
        });

    } catch (error) {
        console.error('Teacher profile update error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
