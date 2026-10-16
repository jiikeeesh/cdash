'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth, type SafeUser } from '../lib/auth-context';
import OnlinePresenceWidget from '../components/OnlinePresenceWidget';

interface Task {
  id: string; title: string; description: string;
  assignedToId: string; assignedById: string;
  status: string; priority: string; dueDate: string;
  createdAt: string; updatedAt: string; notes: string[];
}

function StatCard({ label, value, change, color, icon }: {
  label: string; value: number | string; change?: string; color: string; icon: React.ReactNode;
}) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-content">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {change && <div className="stat-change">{change}</div>}
      </div>
      <div className={`stat-icon-wrap ${color}`}>{icon}</div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const [users, setUsers]     = useState<SafeUser[]>([]);
  const [tasks, setTasks]     = useState<Task[]>([]);
  const [reqCount, setReqCount] = useState(0);

  // Restore cached dashboard data for instant 0ms initial render
  useEffect(() => {
    try {
      const cachedTasks = sessionStorage.getItem('cdash_cached_tasks');
      const cachedUsers = sessionStorage.getItem('cdash_cached_users');
      const cachedReqs  = sessionStorage.getItem('cdash_cached_req_count');
      if (cachedTasks) setTasks(JSON.parse(cachedTasks));
      if (cachedUsers) setUsers(JSON.parse(cachedUsers));
      if (cachedReqs)  setReqCount(Number(cachedReqs));
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    // Parallel fetch all dashboard data concurrently
    const tasksUrl = currentUser.role !== 'admin'
      ? `/api/tasks?userId=${currentUser.id}`
      : '/api/tasks';

    const promises: Promise<any>[] = [
      fetch(tasksUrl).then((r) => r.json()).catch(() => []),
    ];

    if (currentUser.role !== 'user') {
      promises.push(fetch('/api/users').then((r) => r.json()).catch(() => []));
      promises.push(fetch('/api/requests').then((r) => r.json()).catch(() => []));
    }

    Promise.all(promises).then(([taskData, userData, reqData]) => {
      if (Array.isArray(taskData)) {
        setTasks(taskData);
        try { sessionStorage.setItem('cdash_cached_tasks', JSON.stringify(taskData)); } catch (e) {}
      }
      if (Array.isArray(userData)) {
        setUsers(userData);
        try { sessionStorage.setItem('cdash_cached_users', JSON.stringify(userData)); } catch (e) {}
      }
      if (Array.isArray(reqData)) {
        const count = reqData.filter((r) => r.status === 'pending').length;
        setReqCount(count);
        try { sessionStorage.setItem('cdash_cached_req_count', String(count)); } catch (e) {}
      }
    });
  }, [currentUser]);

  if (!currentUser) return null;

  const myTasks = tasks;
  const doneTasks       = myTasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = myTasks.filter((t) => t.status === 'in-progress').length;
  const reviewTasks     = myTasks.filter((t) => t.status === 'review').length;
  const criticalTasks   = myTasks.filter((t) => t.priority === 'critical' && t.status !== 'done').length;

  const recentTasks = [...myTasks]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const getUserName = (id: string) => users.find((u) => u.id === id)?.fullName ?? '—';

  const statusBadge  = (s: string) => <span className={`badge badge-${s}`}>{s.replace('-', ' ')}</span>;
  const priorityBadge = (p: string) => <span className={`badge badge-${p}`}>{p}</span>;

  return (
    <>
      {/* Welcome banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--brand-600), var(--brand-800))',
        borderRadius: 'var(--radius-lg)', padding: '28px 32px', marginBottom: 24,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        color: 'white', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, background: 'rgba(255,255,255,.05)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', right: 60, bottom: -60, width: 140, height: 140, background: 'rgba(255,255,255,.05)', borderRadius: '50%' }} />
        <div style={{ position: 'relative' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
            Good {getGreeting()}, {currentUser.fullName.split(' ')[0]}! 👋
          </h2>
          <p style={{ opacity: .7, fontSize: 14 }}>
            {currentUser.role === 'admin'     && 'You have full access to manage the platform.'}
            {currentUser.role === 'moderator' && 'You can assign tasks and manage the workflow.'}
            {currentUser.role === 'user'      && `You have ${myTasks.filter((t) => t.status !== 'done').length} active task(s).`}
          </p>
        </div>
        <div style={{ fontSize: 48, position: 'relative' }}>
          {currentUser.role === 'admin' ? '🛡️' : currentUser.role === 'moderator' ? '⚡' : '📋'}
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {currentUser.role !== 'user' && (
          <StatCard label="Total Users" color="indigo"
            value={users.filter((u) => u.role === 'user').length}
            change={`${users.filter((u) => u.role === 'moderator').length} moderator(s)`}
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
          />
        )}
        <StatCard label={currentUser.role === 'user' ? 'My Tasks' : 'Total Tasks'} color="green"
          value={myTasks.length} change={`${doneTasks} completed`}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>}
        />
        <StatCard label="In Progress" color="blue"
          value={inProgressTasks} change={`${reviewTasks} in review`}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
        />
        {criticalTasks > 0 && (
          <StatCard label="Critical Tasks" color="red"
            value={criticalTasks} change="Needs immediate attention"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
          />
        )}
        {currentUser.role !== 'user' && reqCount > 0 && (
          <StatCard label="Pending Requests" color="yellow"
            value={reqCount} change="Account creation requests"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>}
          />
        )}
      </div>

      {/* Real-time Team Online Presence Widget (Admin sees all, Moderator sees assigned) */}
      <OnlinePresenceWidget />

      <div className={`dashboard-grid ${currentUser.role !== 'user' ? 'dashboard-grid-2' : 'dashboard-grid-1'}`}>
        {/* Recent Tasks */}
        <div className="card" style={{ gridColumn: currentUser.role === 'user' ? '1/-1' : 'auto' }}>
          <div className="card-header">
            <div><div className="card-title">Recent Tasks</div><div className="card-subtitle">Latest activity</div></div>
            <Link href="/dashboard/tasks" className="btn btn-outline btn-sm">View all</Link>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {recentTasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <h3>No tasks yet</h3>
                <p>{currentUser.role !== 'user' ? 'Create a task to get started.' : 'No tasks assigned to you.'}</p>
              </div>
            ) : (
              <>
                {/* Mobile View: Details as Icons */}
                <div className="mobile-only-cards" style={{ padding: 12 }}>
                  {recentTasks.map((task) => (
                    <div key={`m-${task.id}`} className="mobile-icon-card" style={{ padding: 12 }}>
                      <div className="mobile-icon-card-header">
                        <div className="mobile-icon-card-title" style={{ fontSize: 14 }}>{task.title}</div>
                        {/* Status as Icon */}
                        {task.status === 'pending' && (
                          <span className="icon-chip status-chip-pending" title="Pending">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            Pending
                          </span>
                        )}
                        {task.status === 'in-progress' && (
                          <span className="icon-chip status-chip-in-progress" title="In Progress">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
                            In Progress
                          </span>
                        )}
                        {task.status === 'review' && (
                          <span className="icon-chip status-chip-review" title="In Review">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            Review
                          </span>
                        )}
                        {task.status === 'done' && (
                          <span className="icon-chip status-chip-done" title="Completed">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                            Done
                          </span>
                        )}
                      </div>

                      {/* Details as Icons */}
                      <div className="mobile-details-icon-bar" style={{ margin: '6px 0 0' }}>
                        {/* Priority Icon Chip */}
                        {task.priority === 'critical' && (
                          <span className="icon-chip priority-chip-critical" title="Critical Priority">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                            Critical
                          </span>
                        )}
                        {task.priority === 'high' && (
                          <span className="icon-chip priority-chip-high" title="High Priority">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
                            High
                          </span>
                        )}
                        {task.priority === 'medium' && (
                          <span className="icon-chip priority-chip-medium" title="Medium Priority">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/></svg>
                            Medium
                          </span>
                        )}
                        {task.priority === 'low' && (
                          <span className="icon-chip priority-chip-low" title="Low Priority">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
                            Low
                          </span>
                        )}

                        {/* Due Date as Icon */}
                        <span className="icon-chip" title="Due Date">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop View: Table */}
                <div className="table-wrap desktop-only-table">
                  <table>
                    <thead><tr><th>Task</th><th>Priority</th><th>Status</th></tr></thead>
                    <tbody>
                      {recentTasks.map((task) => (
                        <tr key={task.id}>
                          <td>
                            <div style={{ fontWeight: 600, color: 'var(--neutral-900)', fontSize: 13 }}>{task.title}</div>
                            <div style={{ fontSize: 12, color: 'var(--neutral-400)' }}>Due {new Date(task.dueDate).toLocaleDateString()}</div>
                          </td>
                          <td>{priorityBadge(task.priority)}</td>
                          <td>{statusBadge(task.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        {currentUser.role !== 'user' && (
          <div className="card">
            <div className="card-header">
              <div><div className="card-title">Quick Actions</div><div className="card-subtitle">Common operations</div></div>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href="/dashboard/tasks" className="btn btn-brand" style={{ justifyContent: 'flex-start' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Assign New Task
              </Link>
              <Link href="/dashboard/users" className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>
                {currentUser.role === 'admin' ? 'Create Account' : 'View Users'}
              </Link>
              {currentUser.role === 'moderator' && (
                <Link href="/dashboard/requests" className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  Request New Account
                </Link>
              )}
              {currentUser.role === 'admin' && reqCount > 0 && (
                <Link href="/dashboard/requests" className="btn btn-outline" style={{ justifyContent: 'flex-start', color: 'var(--warning)', borderColor: 'var(--warning)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                  Review {reqCount} Pending Request{reqCount > 1 ? 's' : ''}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
