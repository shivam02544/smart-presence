import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSession();

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            authenticated: true,
            role: session.user.role,
            user: {
                id: session.user._id,
                name: session.user.name,
                email: session.user.email,
                role: session.user.role
            }
        });

    } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
