'use client';

import Sidebar from '@/components/layouts/Sidebar';
import Header from '@/components/layouts/Header';
import { SidebarProvider, useSidebar } from '@/components/providers/SidebarProvider';
import { cn } from '@/utils/helpers';

function DashboardInnerLayout({ children }: { children: React.ReactNode }) {
  const { isMobileOpen, setIsMobileOpen, isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200 relative overflow-x-hidden">
      {/* Mobile Drawer Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden transition-opacity animate-in fade-in duration-200"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Responsive Sidebar (Mobile Drawer + Desktop Fixed) */}
      <Sidebar />

      {/* Main Content Area: Responsive margins for mobile (0) vs desktop (64 or 68px) */}
      <div
        className={cn(
          'flex flex-col min-h-screen w-full min-w-0 transition-all duration-300 ease-in-out',
          isCollapsed ? 'lg:pl-[68px]' : 'lg:pl-64',
          'pl-0'
        )}
      >
        <Header />
        <main className="flex-1 p-3 sm:p-5 md:p-6 w-full min-w-0 max-w-full overflow-x-hidden transition-all duration-200">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardInnerLayout>{children}</DashboardInnerLayout>
    </SidebarProvider>
  );
}
