'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { getMenuForRole } from '@/lib/navigation';
import { cn } from '@/utils/helpers';
import { useLanguage } from '@/components/providers/LanguageProvider';
import * as Icons from 'lucide-react';

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const { lang } = useLanguage();

  const role = (session?.user as any)?.role || 'ADMIN';
  const menuItems = getMenuForRole(role);

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]);
  };

  const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName];
    return Icon ? <Icon size={20} /> : <Icons.Circle size={20} />;
  };

  return (
    <aside className={cn('fixed left-0 top-0 h-screen bg-sidebar-bg text-white z-40 flex flex-col transition-all duration-300', collapsed ? 'w-[68px]' : 'w-64')}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <Icons.GraduationCap size={20} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-lg font-bold tracking-tight">विद्यालय</h1>
            <p className="text-[10px] text-sidebar-text -mt-0.5">School Management</p>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="ml-auto p-1 hover:bg-sidebar-hover rounded-lg transition-colors">
          {collapsed ? <Icons.ChevronRight size={16} /> : <Icons.ChevronLeft size={16} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const isOpen = openMenus.includes(item.title);
          const hasChildren = item.children && item.children.length > 0;

          return (
            <div key={item.title + item.href}>
              {hasChildren ? (
                <button onClick={() => toggleMenu(item.title)} className={cn('sidebar-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm', isActive ? 'bg-sidebar-active text-white' : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white')}>
                  {getIcon(item.icon)}
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{lang === 'hi' ? item.titleHi : item.title}</span>
                      <Icons.ChevronDown size={14} className={cn('transition-transform', isOpen && 'rotate-180')} />
                    </>
                  )}
                </button>
              ) : (
                <Link href={item.href} className={cn('sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm', isActive ? 'bg-primary-600/90 text-white shadow-lg shadow-primary-600/20' : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white')}>
                  {getIcon(item.icon)}
                  {!collapsed && <span>{lang === 'hi' ? item.titleHi : item.title}</span>}
                </Link>
              )}

              {/* Submenu */}
              {hasChildren && isOpen && !collapsed && (
                <div className="ml-4 mt-0.5 space-y-0.5 border-l border-white/10 pl-3">
                  {item.children!.map((child) => {
                    const childActive = pathname === child.href;
                    return (
                      <Link key={child.href} href={child.href} className={cn('sidebar-item flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs', childActive ? 'bg-sidebar-active text-white' : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white')}>
                        {getIcon(child.icon)}
                        <span>{lang === 'hi' ? child.titleHi : child.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User / Logout */}
      <div className="border-t border-white/10 p-3">
        <button onClick={() => signOut({ callbackUrl: '/login' })} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
          <Icons.LogOut size={20} />
          {!collapsed && <span>{lang === 'hi' ? 'लॉग आउट' : 'Logout'}</span>}
        </button>
      </div>
    </aside>
  );
}
