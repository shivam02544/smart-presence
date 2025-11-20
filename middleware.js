import { NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth';

// Define protected routes and allowed roles
const protectedRoutes = {
    '/admin': ['ADMIN'],
    '/teacher': ['TEACHER', 'ADMIN'],
    '/student': ['STUDENT'],
    '/cr': ['CR', 'STUDENT'],
};

export async function middleware(request) {
    const path = request.nextUrl.pathname;

    // Check if the path is protected
    const isProtectedRoute = Object.keys(protectedRoutes).some((route) =>
        path.startsWith(route)
    );

    if (!isProtectedRoute) {
        return NextResponse.next();
    }

    const cookie = request.cookies.get('session')?.value;
    const session = await decrypt(cookie);

    // Redirect to login if no session
    if (!session?.user) {
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    const userRole = session.user.role;

    // Check role-based access
    // Find the matching route prefix
    const matchedRoute = Object.keys(protectedRoutes).find((route) => path.startsWith(route));

    if (matchedRoute) {
        const allowedRoles = protectedRoutes[matchedRoute];
        if (!allowedRoles.includes(userRole)) {
            // Redirect to unauthorized or dashboard
            // For now, redirect to their own dashboard based on role
            if (userRole === 'ADMIN') return NextResponse.redirect(new URL('/admin/dashboard', request.nextUrl));
            if (userRole === 'TEACHER') return NextResponse.redirect(new URL('/teacher/dashboard', request.nextUrl));
            if (userRole === 'STUDENT') return NextResponse.redirect(new URL('/student/dashboard', request.nextUrl));
            if (userRole === 'CR') return NextResponse.redirect(new URL('/cr/dashboard', request.nextUrl));

            return NextResponse.redirect(new URL('/unauthorized', request.nextUrl));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
