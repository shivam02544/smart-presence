import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

/**
 * Higher-order function to protect API routes
 * @param {Function} handler - The API route handler
 * @param {Array} allowedRoles - Array of roles allowed to access this route
 */
export function withAuth(handler, allowedRoles = []) {
    return async (request, context) => {
        try {
            // Get session
            const session = await getSession();

            // Check if user is authenticated
            if (!session || !session.user) {
                return NextResponse.json(
                    {
                        error: 'Unauthorized',
                        message: 'Please log in to access this resource'
                    },
                    { status: 401 }
                );
            }

            // Check if user has required role
            if (allowedRoles.length > 0 && !allowedRoles.includes(session.user.role)) {
                return NextResponse.json(
                    {
                        error: 'Forbidden',
                        message: 'You do not have permission to access this resource'
                    },
                    { status: 403 }
                );
            }

            // User is authenticated and authorized, call the handler
            return handler(request, context, session);

        } catch (error) {
            console.error('Auth middleware error:', error);
            return NextResponse.json(
                {
                    error: 'Internal Server Error',
                    message: 'An error occurred while verifying authentication'
                },
                { status: 500 }
            );
        }
    };
}

/**
 * Middleware specifically for role-based access
 */
export function requireRole(...roles) {
    return (handler) => withAuth(handler, roles);
}
