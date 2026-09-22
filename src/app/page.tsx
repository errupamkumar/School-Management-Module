import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (session) {
    const role = (session.user as any).role;
    const dashMap: Record<string, string> = {
      SUPER_ADMIN: '/dashboard/admin',
      ADMIN: '/dashboard/admin',
      TEACHER: '/dashboard/teacher',
      PARENT: '/dashboard/parent',
      STUDENT: '/dashboard/student',
      ACCOUNTANT: '/dashboard/admin',
    };
    redirect(dashMap[role] || '/dashboard/admin');
  }
  redirect('/login');
}
