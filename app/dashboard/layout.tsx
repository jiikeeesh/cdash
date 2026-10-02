'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../lib/auth-context';

export type Role = 'admin' | 'moderator' | 'user';

interface NavItem {
  href: string;
  label: string;
  roles: Role[];
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    roles: ['admin', 'moderator', 'user'],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    href: '/dashboard/tasks',
    label: 'Tasks',
    roles: ['admin', 'moderator', 'user'],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
  },
  {
    href: '/dashboard/users',
    label: 'Users',
    roles: ['admin', 'moderator'],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    href: '/dashboard/requests',
    label: 'Account Requests',
    roles: ['admin', 'moderator'],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/>
      </svg>
    ),
  },
];

function roleBadgeClass(role: Role) {
  return `sidebar-role-badge role-badge-${role}`;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const lastCheckedRef = useRef(new Date().toISOString());

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Request Notification permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
  }, []);

  // Poll for new tasks
  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/tasks?userId=${currentUser.id}`);
        if (!res.ok) return;
        const tasks = await res.json();
        
        const newTasks = tasks.filter((t: any) => 
          t.createdAt > lastCheckedRef.current && 
          t.assigneeIds?.includes(currentUser.id) &&
          t.assignedById !== currentUser.id // Don't notify if user assigned it to themselves
        );
        
        if (newTasks.length > 0) {
          lastCheckedRef.current = new Date().toISOString();
          
          if ('Notification' in window && Notification.permission === 'granted') {
            newTasks.forEach((t: any) => {
              new Notification('New Task Assigned', {
                body: `You have been assigned: ${t.title}`,
                icon: '/favicon.ico',
              });
            });
          } else {
             // Fallback standard alert if notifications are blocked/unsupported
             // alert(`New Task Assigned: ${newTasks.map((t: any) => t.title).join(', ')}`);
          }
        }
      } catch (err) {}
    }, 10000); // Poll every 10s for responsiveness
    
    return () => clearInterval(interval);
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      router.replace('/login');
    } else if (currentUser.isFirstLogin) {
      router.replace('/change-password');
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return (
      <div className="page-redirect">
        <div className="spinner spinner-dark" />
      </div>
    );
  }

  const initials = currentUser.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const visibleNav = navItems.filter((item) => item.roles.includes(currentUser.role));

  function handleLogout() {
    logout();
    router.push('/login');
  }

  const pageTitle = navItems.find((n) => n.href === pathname)?.label ?? 'Dashboard';

  return (
    <div className="app-shell">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
              </svg>
            </div>
            <div>
              <div className="sidebar-logo-text">CompanyDash</div>
              <div className="sidebar-logo-sub">Work Management</div>
            </div>
          </div>
        </div>

        {/* User info */}
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{currentUser.fullName}</div>
            <span className={roleBadgeClass(currentUser.role)}>{currentUser.role}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-nav-label">Navigation</div>
          {visibleNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-nav-item${pathname === item.href ? ' active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout} id="sidebar-logout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <button 
              className="mobile-menu-btn" 
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <div>
              <div className="topbar-title">{pageTitle}</div>
              <div className="topbar-subtitle">
                {currentTime ? currentTime.toLocaleString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                }) : ''}
              </div>
            </div>
          </div>
          <div className="topbar-actions">
            <div style={{ fontSize: 13, color: 'var(--neutral-500)' }}>
              Hi, <strong style={{ color: 'var(--neutral-800)' }}>{currentUser.fullName.split(' ')[0]}</strong>
            </div>
            <div className="sidebar-avatar" style={{ width: 34, height: 34, fontSize: 12 }}>{initials}</div>
          </div>
        </header>

        {/* Page content */}
        <main className="page-body">{children}</main>
      </div>
    </div>
  );
}
