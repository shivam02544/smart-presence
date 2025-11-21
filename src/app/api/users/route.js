import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import StudentProfile from '@/models/StudentProfile';
import TeacherProfile from '@/models/TeacherProfile';
import { getSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        await dbConnect();
        
        // Check authentication - only ADMIN can create users
        const session = await getSession();
        
        // Debug logging (remove in production)
        if (!session) {
            console.error('No session found in POST /api/users');
            return NextResponse.json(
                { error: 'Unauthorized. Please log in to continue.' },
                { status: 401 }
            );
        }
        
        if (!session.user) {
            console.error('Session found but no user data:', session);
            return NextResponse.json(
                { error: 'Unauthorized. Invalid session.' },
                { status: 401 }
            );
        }
        
        if (session.user.role !== 'ADMIN') {
            console.error('User role is not ADMIN:', session.user.role);
            return NextResponse.json(
                { error: 'Unauthorized. Only administrators can create user accounts.' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { name, email, password, role, ...profileData } = body;

        // Basic validation
        if (!name || !email || !password || !role) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Validate role
        const validRoles = ['ADMIN', 'TEACHER', 'STUDENT', 'CR'];
        if (!validRoles.includes(role)) {
            return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        // Create Profile based on role
        if (role === 'STUDENT' || role === 'CR') {
            await StudentProfile.create({
                userId: user._id,
                rollNumber: profileData.rollNumber || 'TEMP-' + Date.now(), // Fallback
                batchId: profileData.batchId, // Should be validated
                department: profileData.department || 'General',
                phone: profileData.phone,
            });
        } else if (role === 'TEACHER') {
            await TeacherProfile.create({
                userId: user._id,
                employeeId: profileData.employeeId || 'EMP-' + Date.now(),
                department: profileData.department || 'General',
            });
        }

        return NextResponse.json({ success: true, user }, { status: 201 });

    } catch (error) {
        console.error('Create user error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        await dbConnect();
        
        // Check authentication - only ADMIN can delete users
        const session = await getSession();
        
        if (!session) {
            console.error('No session found in DELETE /api/users');
            return NextResponse.json(
                { error: 'Unauthorized. Please log in to continue.' },
                { status: 401 }
            );
        }
        
        if (!session.user) {
            console.error('Session found but no user data:', session);
            return NextResponse.json(
                { error: 'Unauthorized. Invalid session.' },
                { status: 401 }
            );
        }
        
        if (session.user.role !== 'ADMIN') {
            console.error('User role is not ADMIN:', session.user.role);
            return NextResponse.json(
                { error: 'Unauthorized. Only administrators can delete users.' },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('id');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Prevent deleting yourself
        if (userId === session.user._id) {
            return NextResponse.json(
                { error: 'You cannot delete your own account' },
                { status: 400 }
            );
        }

        // Delete associated profiles first
        await StudentProfile.deleteMany({ userId });
        await TeacherProfile.deleteMany({ userId });

        // Delete user
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'User deleted successfully' });

    } catch (error) {
        console.error('Delete user error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
