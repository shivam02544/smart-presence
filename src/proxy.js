import { NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth';

// Define protected routes and their required roles
const protectedRoutes = {
    '/admin': ['ADMIN'],
    '/teacher': ['TEACHER'],
    '/student': ['STUDENT'],
    '/cr': ['CR'],
};

// Public routes that don't require authentication
const publicRoutes = ['/', '/login', '/register'];

export async function proxy(request) {
    const { pathname } = request.nextUrl;

    // Check if route is public
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    if (isPublicRoute) {
        return NextResponse.next();
    }

    // Get session from cookie
    const sessionCookie = request.cookies.get('session');

    if (!sessionCookie) {
        // No session found, redirect to login
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    try {
        // Decrypt and verify session
        const session = await decrypt(sessionCookie.value);

        if (!session || !session.user) {
            // Invalid session, redirect to login
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Check if user has access to the route
        const userRole = session.user.role;

        for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
            if (pathname.startsWith(route)) {
                if (!allowedRoles.includes(userRole)) {
                    // User doesn't have permission, redirect to their dashboard
                    const dashboardUrl = getDashboardUrl(userRole);
                    return NextResponse.redirect(new URL(dashboardUrl, request.url));
                }
            }
        }

        // User is authenticated and authorized, continue
        return NextResponse.next();

    } catch (error) {
        console.error('Middleware auth error:', error);

        // Session verification failed, redirect to login
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }
}

function getDashboardUrl(role) {
    const dashboards = {
        ADMIN: '/admin/dashboard',
        TEACHER: '/teacher/dashboard',
        STUDENT: '/student/dashboard',
        CR: '/cr/dashboard',
    };
    return dashboards[role] || '/login';
}

// Configure which routes use this middleware
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc.)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg).*)',
    ],
};
