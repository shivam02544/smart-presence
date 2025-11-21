import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

/**
 * GET /api/auth/session
 * Check current session and return user info
 * Useful for debugging session issues
 */
export async function GET() {
    try {
        const session = await getSession();
        
        if (!session) {
            return NextResponse.json({ 
                authenticated: false,
                message: 'No session found'
            });
        }
        
        if (!session.user) {
            return NextResponse.json({ 
                authenticated: false,
                message: 'Session found but no user data',
                session: session
            });
        }
        
        return NextResponse.json({
            authenticated: true,
            user: {
                _id: session.user._id,
                name: session.user.name,
                email: session.user.email,
                role: session.user.role
            }
        });
    } catch (error) {
        console.error('Session check error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

