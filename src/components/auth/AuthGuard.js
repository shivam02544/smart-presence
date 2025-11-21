'use client';

import { useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { apiUrl } from '@/lib/api';

export default function AuthGuard({ children, allowedRoles = [] }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        checkAuth();
    }, [pathname]);

    const checkAuth = async () => {
        try {
            // Check if user has a session by calling a simple auth check endpoint
            const res = await fetch(apiUrl('/api/auth/check'));

            if (!res.ok) {
                // Not authenticated, redirect to login
                const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
                router.push(loginUrl);
                return;
            }

            const data = await res.json();

            // Check if user has required role
            if (allowedRoles.length > 0 && !allowedRoles.includes(data.role)) {
                // Redirect to appropriate dashboard
                const dashboardUrl = getDashboardUrl(data.role);
                router.push(dashboardUrl);
                return;
            }

        } catch (error) {
            console.error('Auth check error:', error);
            router.push('/login');
        }
    };

    const getDashboardUrl = (role) => {
        const dashboards = {
            ADMIN: '/admin/dashboard',
            TEACHER: '/teacher/dashboard',
            STUDENT: '/student/dashboard',
            CR: '/cr/dashboard',
        };
        return dashboards[role] || '/login';
    };

    return <>{children}</>;
}
