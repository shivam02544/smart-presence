import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import StudentProfile from '@/models/StudentProfile';
import TeacherProfile from '@/models/TeacherProfile';
import { getSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function PATCH(request, { params }) {
    try {
        await dbConnect();
        
        // Check authentication - only ADMIN can update users
        const session = await getSession();
        
        if (!session) {
            console.error('No session found in PATCH /api/users/[id]');
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
                { error: 'Unauthorized. Only administrators can update users.' },
                { status: 403 }
            );
        }

        const { id } = params;
        const body = await request.json();
        const { name, email, password, role, ...profileData } = body;

        // Find user
        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Update user fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (role) {
            const validRoles = ['ADMIN', 'TEACHER', 'STUDENT', 'CR'];
            if (!validRoles.includes(role)) {
                return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
            }
            user.role = role;
        }
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();

        // Update profile if needed
        if (role === 'STUDENT' || role === 'CR') {
            let profile = await StudentProfile.findOne({ userId: id });
            if (profile) {
                if (profileData.rollNumber) profile.rollNumber = profileData.rollNumber;
                if (profileData.batchId) profile.batchId = profileData.batchId;
                if (profileData.department) profile.department = profileData.department;
                if (profileData.phone !== undefined) profile.phone = profileData.phone;
                await profile.save();
            }
        } else if (role === 'TEACHER') {
            let profile = await TeacherProfile.findOne({ userId: id });
            if (profile) {
                if (profileData.employeeId) profile.employeeId = profileData.employeeId;
                if (profileData.department) profile.department = profileData.department;
                await profile.save();
            }
        }

        return NextResponse.json({ success: true, user });

    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

