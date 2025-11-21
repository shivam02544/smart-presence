import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { getSession } from '@/lib/auth';
import User from '@/models/User';
import bcrypt from 'bcrypt';

export async function POST(request) {
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
        const { currentPassword, newPassword } = body;

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: 'Current password and new password are required' },
                { status: 400 }
            );
        }

        // Verify current password
        const user = await User.findById(teacherId);
        const isValid = await bcrypt.compare(currentPassword, user.password);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Current password is incorrect' },
                { status: 400 }
            );
        }

        // Hash and update new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(teacherId, { password: hashedPassword });

        return NextResponse.json({
            success: true,
            message: 'Password updated successfully'
        });

    } catch (error) {
        console.error('Password update error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
