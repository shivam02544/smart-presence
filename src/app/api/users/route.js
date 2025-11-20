import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import StudentProfile from '@/models/StudentProfile';
import TeacherProfile from '@/models/TeacherProfile';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { name, email, password, role, ...profileData } = body;

        // Basic validation
        if (!name || !email || !password || !role) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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
