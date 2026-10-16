'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../lib/auth-context';
import { useTheme, PRESET_COLORS } from '../lib/theme-context';
import { useNotifications } from '../lib/notification-context';

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
  const { mode, toggleMode, themeColor, setThemeColor, setIsThemeModalOpen } = useTheme();
  const { unreadCount, setIsDrawerOpen } = useNotifications();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isProfileSheetOpen, setIsProfileSheetOpen] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close sidebar & profile sheet on route change
  useEffect(() => {
    setIsSidebarOpen(false);
    setIsProfileSheetOpen(false);
  }, [pathname]);

  // Presence heartbeat & online count polling
  useEffect(() => {
    if (!currentUser) return;

    const pingAndFetchPresence = async () => {
      try {
        await fetch('/api/presence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUser.id }),
        });

        const res = await fetch(`/api/presence?userId=${currentUser.id}&role=${currentUser.role}`);
        if (res.ok) {
          const data = await res.json();
          setOnlineCount(data.totalOnline || 0);
        }
      } catch (e) {}
    };

    pingAndFetchPresence();
    const interval = setInterval(pingAndFetchPresence, 15000); // 15s heartbeat
    return () => clearInterval(interval);
  }, [currentUser]);

  // Poll for pending requests count (admin/moderator)
  useEffect(() => {
    if (!currentUser || currentUser.role === 'user') return;
    const fetchRequests = async () => {
      try {
        const url = currentUser.role === 'moderator'
          ? `/api/requests?requestedById=${currentUser.id}`
          : '/api/requests';
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          const pending = data.filter((r: any) => r.status === 'pending').length;
          setPendingRequestsCount(pending);
        }
      } catch (err) {}
    };

    fetchRequests();
    const interval = setInterval(fetchRequests, 10000);
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

  const visibleNav = navItems.filter((item) => item.roles.includes(currentUser.role as Role));

  async function handleLogout() {
    try {
      await fetch('/api/presence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser!.id, action: 'logout' }),
      });
    } catch (e) {}
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
      
      {/* Sidebar (Desktop) */}
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
            <span className={roleBadgeClass(currentUser.role as Role)}>{currentUser.role}</span>
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

      {/* Main Content */}
      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">
          {/* Desktop Topbar Content */}
          <div className="topbar-desktop-content" style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
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
              {/* Online Users Presence Indicator (Admin: all, Moderator: assigned) */}
              {currentUser.role !== 'user' && (
                <Link
                  href="/dashboard"
                  className="topbar-btn-ghost"
                  title={currentUser.role === 'admin' ? `${onlineCount} team members online across the company` : `${onlineCount} of your assigned users are currently online`}
                  style={{
                    padding: '6px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--success-dark)',
                    background: 'var(--success-light)',
                    borderColor: 'rgba(16, 185, 129, 0.35)',
                    textDecoration: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <span className="presence-pulse-dot" />
                  <span>{onlineCount} Online</span>
                </Link>
              )}

              {/* Notification Center Bell Trigger */}
              <button
                type="button"
                className="topbar-btn-ghost"
                onClick={() => setIsDrawerOpen(true)}
                title="Notifications"
                aria-label="Notifications"
                style={{
                  padding: '7px 11px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      minWidth: 16,
                      height: 16,
                      borderRadius: 10,
                      background: 'var(--error)',
                      color: 'white',
                      fontSize: 10,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 4px',
                      boxShadow: '0 0 6px rgba(239, 68, 68, 0.6)',
                    }}
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Quick Dark/Light Mode Toggle */}
              <button 
                type="button" 
                className="topbar-btn-ghost"
                onClick={toggleMode}
                title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                aria-label={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                style={{ padding: '7px 11px', display: 'flex', alignItems: 'center', gap: 6, borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
              >
                {mode === 'light' ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>Dark</span>
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>Light</span>
                  </>
                )}
              </button>

              {/* Theme Color Customizer Button */}
              <button 
                type="button" 
                className="topbar-btn-ghost"
                onClick={() => setIsThemeModalOpen(true)}
                title="Change Workspace Theme & Colors"
                aria-label="Change Workspace Theme & Colors"
                style={{ padding: '7px 11px', display: 'flex', alignItems: 'center', gap: 7, borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
              >
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--brand-600)', border: '1.5px solid white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>Color</span>
              </button>

              <div style={{ width: 1, height: 22, background: 'var(--neutral-200)', margin: '0 4px' }} />

              <div style={{ fontSize: 13, color: 'var(--neutral-500)' }}>
                Hi, <strong style={{ color: 'var(--neutral-800)' }}>{currentUser.fullName.split(' ')[0]}</strong>
              </div>
              <div className="sidebar-avatar" style={{ width: 34, height: 34, fontSize: 12 }}>{initials}</div>
            </div>
          </div>

          {/* Instagram-Style Mobile Topbar */}
          <div className="insta-mobile-topbar">
            <Link href="/dashboard" className="insta-header-brand">
              <div className="insta-header-logo-icon">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                </svg>
              </div>
              <span>CompanyDash</span>
            </Link>

            <div className="insta-header-actions">
              {/* Notification Bell */}
              <button
                type="button"
                className="insta-header-action-btn"
                onClick={() => setIsDrawerOpen(true)}
                title="Notifications"
                aria-label="Notifications"
                style={{ position: 'relative' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -1,
                      right: -1,
                      minWidth: 15,
                      height: 15,
                      borderRadius: 10,
                      background: 'var(--error)',
                      color: 'white',
                      fontSize: 9,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 3px',
                      boxShadow: '0 0 5px rgba(239, 68, 68, 0.6)',
                    }}
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Quick Light/Dark Switch */}
              <button 
                type="button"
                className="insta-header-action-btn"
                onClick={toggleMode}
                title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                aria-label={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {mode === 'light' ? (
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                ) : (
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="page-body">{children}</main>

        {/* Instagram-Style Bottom Navigation Bar (Mobile) */}
        <nav className="insta-bottom-nav" aria-label="Mobile Navigation">
          {/* Home */}
          <Link 
            href="/dashboard" 
            className={`insta-nav-tab${pathname === '/dashboard' ? ' active' : ''}`}
            aria-label="Home"
          >
            {pathname === '/dashboard' ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H4a1 1 0 0 1-1-1V9.5z"/>
              </svg>
            )}
          </Link>

          {/* Tasks */}
          <Link 
            href="/dashboard/tasks" 
            className={`insta-nav-tab${pathname.startsWith('/dashboard/tasks') ? ' active' : ''}`}
            aria-label="Tasks"
          >
            {pathname.startsWith('/dashboard/tasks') ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            )}
          </Link>

          {/* Users (admin & moderator only) */}
          {currentUser.role !== 'user' && (
            <Link 
              href="/dashboard/users" 
              className={`insta-nav-tab${pathname.startsWith('/dashboard/users') ? ' active' : ''}`}
              aria-label="Users"
            >
              {pathname.startsWith('/dashboard/users') ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              )}
            </Link>
          )}

          {/* Account Requests (admin & moderator only) */}
          {currentUser.role !== 'user' && (
            <Link 
              href="/dashboard/requests" 
              className={`insta-nav-tab${pathname.startsWith('/dashboard/requests') ? ' active' : ''}`}
              aria-label="Account Requests"
            >
              {pathname.startsWith('/dashboard/requests') ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              )}
              {pendingRequestsCount > 0 && (
                <span className="insta-tab-badge">{pendingRequestsCount}</span>
              )}
            </Link>
          )}

          {/* Profile Tab */}
          <button 
            type="button"
            className="insta-nav-tab insta-profile-tab-btn" 
            onClick={() => setIsProfileSheetOpen((prev) => !prev)}
            aria-label="Open profile menu"
          >
            <div className={`insta-avatar-ring ${isProfileSheetOpen ? 'active' : ''}`}>
              <div className="insta-avatar-inner">{initials}</div>
            </div>
          </button>
        </nav>

        {/* Instagram Profile Bottom Sheet */}
        {isProfileSheetOpen && (
          <>
            <div 
              className="insta-sheet-backdrop" 
              onClick={() => setIsProfileSheetOpen(false)}
            />
            <div className="insta-sheet" role="dialog" aria-modal="true">
              <div className="insta-sheet-handle" />
              
              <div className="insta-sheet-profile-header">
                <div className="insta-sheet-avatar-wrap">
                  <div className="insta-sheet-avatar">{initials}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--neutral-900)' }}>
                    {currentUser.fullName}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--neutral-400)', marginTop: 2 }}>
                    @{currentUser.username}
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <span className={roleBadgeClass(currentUser.role as Role)}>
                      {currentUser.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details as Icons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--neutral-700)' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--neutral-500)', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <span style={{ wordBreak: 'break-all' }}>{currentUser.email}</span>
                </div>

                {currentUser.department && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--neutral-700)' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--neutral-500)', flexShrink: 0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="14" rx="2"/>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                      </svg>
                    </div>
                    <span>{currentUser.department}</span>
                  </div>
                )}

                {currentTime && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--neutral-700)' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--neutral-500)', flexShrink: 0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                    </div>
                    <span>
                      {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {currentTime.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                )}
              </div>

              {/* Theme & Workspace Appearance in Profile Drawer */}
              <div style={{
                background: 'var(--neutral-100)',
                borderRadius: 'var(--radius-lg)',
                padding: '14px',
                border: '1px solid var(--neutral-200)',
                marginBottom: 18,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--neutral-900)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"/><line x1="9" y1="21" x2="15" y2="21"/></svg>
                    Theme & Color
                  </div>
                  {/* Mode switch pill */}
                  <button
                    type="button"
                    onClick={toggleMode}
                    style={{
                      border: '1px solid var(--neutral-300)',
                      background: 'var(--bg-surface)',
                      borderRadius: 20,
                      padding: '4px 10px',
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--neutral-800)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      cursor: 'pointer',
                    }}
                  >
                    {mode === 'light' ? '☀️ Light' : '🌙 Dark'}
                  </button>
                </div>

                {/* Quick Swatches */}
                <div style={{ fontSize: 11, color: 'var(--neutral-400)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Workspace Color
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                  {PRESET_COLORS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setThemeColor(preset.id)}
                      title={preset.name}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: preset.primary,
                        border: themeColor === preset.id ? '2.5px solid white' : '1.5px solid rgba(0,0,0,0.1)',
                        boxShadow: themeColor === preset.id ? `0 0 0 2px ${preset.primary}` : 'none',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileSheetOpen(false);
                      setIsThemeModalOpen(true);
                    }}
                    title="Custom Color"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
                      border: themeColor === 'custom' ? '2.5px solid white' : '1.5px solid rgba(0,0,0,0.1)',
                      boxShadow: themeColor === 'custom' ? '0 0 0 2px var(--brand-600)' : 'none',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileSheetOpen(false);
                    setIsThemeModalOpen(true);
                  }}
                  className="btn btn-outline btn-sm"
                  style={{ width: '100%', justifyContent: 'center', fontSize: 12, padding: '7px' }}
                >
                  Custom Color & Theme Settings…
                </button>
              </div>

              {/* Sign out button */}
              <button 
                onClick={handleLogout}
                className="btn btn-outline" 
                style={{ width: '100%', borderColor: 'var(--error-light)', color: 'var(--error)', justifyContent: 'center', padding: '12px', marginBottom: 8 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}>
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
                </svg>
                Sign Out
              </button>

              <button 
                onClick={() => setIsProfileSheetOpen(false)}
                className="btn btn-outline" 
                style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
