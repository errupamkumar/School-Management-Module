import Sidebar from '@/components/layouts/Sidebar';
import Header from '@/components/layouts/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Sidebar />
      <div className="ml-64 transition-all duration-300">
        <Header />
        <main className="p-6 transition-all duration-200">{children}</main>
      </div>
    </div>
  );
}
