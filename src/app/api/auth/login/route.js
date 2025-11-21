import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { login } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        await dbConnect();
        const { email, password } = await request.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Please provide email and password' },
                { status: 400 }
            );
        }

        // Find user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Create session
        const userData = {
            _id: user._id.toString(), // Convert ObjectId to string
            name: user.name,
            email: user.email,
            role: user.role,
        };

        await login(userData);

        return NextResponse.json({
            success: true,
            user: userData,
            redirectUrl: `/${user.role.toLowerCase()}/dashboard`
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
