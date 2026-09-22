import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin routes
    if (path.startsWith('/dashboard/admin') && !['SUPER_ADMIN', 'ADMIN'].includes(token?.role as string)) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Teacher routes
    if (path.startsWith('/dashboard/teacher') && token?.role !== 'TEACHER') {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Parent routes
    if (path.startsWith('/dashboard/parent') && token?.role !== 'PARENT') {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Student routes
    if (path.startsWith('/dashboard/student') && token?.role !== 'STUDENT') {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Admission & management routes - admin/super_admin only
    const adminOnlyPaths = ['/admission', '/classes', '/subjects', '/campus', '/settings', '/salary', '/inventory', '/idcard', '/biometric', '/certification'];
    if (adminOnlyPaths.some(p => path.startsWith(p)) && !['SUPER_ADMIN', 'ADMIN'].includes(token?.role as string)) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/admission/:path*', '/students/:path*', '/staff/:path*', '/attendance/:path*', '/fees/:path*', '/exams/:path*', '/timetable/:path*', '/accounting/:path*', '/salary/:path*', '/notices/:path*', '/classes/:path*', '/subjects/:path*', '/homework/:path*', '/online-class/:path*', '/transport/:path*', '/leave/:path*', '/inventory/:path*', '/idcard/:path*', '/reports/:path*', '/campus/:path*', '/settings/:path*', '/biometric/:path*', '/certification/:path*'],
};
