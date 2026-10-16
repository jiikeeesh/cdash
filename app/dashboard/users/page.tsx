'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth, type SafeUser } from '../../lib/auth-context';

type ToastType = 'success' | 'error' | 'info';
interface ToastMsg { id: number; type: ToastType; text: string; }
function useToast() {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const push = useCallback((type: ToastType, text: string) => {
    const id = Date.now();
    setToasts((p) => [...p, { id, type, text }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  }, []);
  return { toasts, push };
}

interface UserFormData {
  username: string; password: string; fullName: string;
  email: string; phone: string; address: string; department: string; role: string; createdBy?: string;
}
const EMPTY_FORM: UserFormData = { username: '', password: '', fullName: '', email: '', phone: '', address: '', department: '', role: 'user' };

function UserModal({ user, canCreateModerator, onClose, onSave, users, currentUserId, isAdmin }: {
  user: SafeUser | null; canCreateModerator: boolean;
  onClose: () => void; onSave: (data: UserFormData) => void;
  users: SafeUser[]; currentUserId: string; isAdmin: boolean;
}) {
  const [form, setForm] = useState<UserFormData>(
    user ? { username: user.username, password: '', fullName: user.fullName, email: user.email, phone: user.phone || '', address: user.address || '', department: user.department, role: user.role, createdBy: user.createdBy }
         : { ...EMPTY_FORM, createdBy: currentUserId }
  );
  const [errors, setErrors] = useState<Partial<UserFormData>>({});
  const setF = (k: keyof UserFormData, v: string) => setForm((p) => ({ ...p, [k]: v }));

  function validate() {
    const e: Partial<UserFormData> = {};
    if (!form.fullName.trim()) e.fullName = 'Required';
    if (!form.username.trim()) e.username = 'Required';
    if (!user && !form.password.trim()) e.password = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const assigneesArray = form.createdBy ? form.createdBy.split(',').filter(Boolean) : [];
  const toggleModerator = (modId: string) => {
    let newArr = [...assigneesArray];
    if (newArr.includes(modId)) newArr = newArr.filter(id => id !== modId);
    else newArr.push(modId);
    if (newArr.length === 0) newArr.push(currentUserId);
    setF('createdBy', newArr.join(','));
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{user ? 'Edit Account' : 'Create Account'}</h3>
          <button className="btn-close" onClick={onClose}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
        <div className="modal-body">
          <div className="field-row">
            <div className="field"><label className="label">Full Name *</label>
              <input className="input" value={form.fullName} onChange={(e) => setF('fullName', e.target.value)} placeholder="John Doe" />
              {errors.fullName && <span className="error-msg">{errors.fullName}</span>}</div>
            <div className="field"><label className="label">Role *</label>
              <select className="select" value={form.role} onChange={(e) => setF('role', e.target.value)} disabled={user?.role === 'admin'}>
                <option value="user">User</option>
                {canCreateModerator && <option value="moderator">Moderator</option>}
              </select></div>
          </div>
          <div className="field-row">
            <div className="field"><label className="label">Username *</label>
              <input className="input" value={form.username} onChange={(e) => setF('username', e.target.value)} placeholder="john.doe" autoComplete="off" />
              {errors.username && <span className="error-msg">{errors.username}</span>}</div>
            <div className="field"><label className="label">{user ? 'New Password (leave blank to keep)' : 'Initial Password *'}</label>
              <input className="input" type="password" value={form.password} onChange={(e) => setF('password', e.target.value)} placeholder={user ? 'Leave blank to keep' : 'Temporary password'} autoComplete="new-password" />
              {errors.password && <span className="error-msg">{errors.password}</span>}</div>
          </div>
          <div className="field-row">
            <div className="field"><label className="label">Email *</label>
              <input className="input" type="email" value={form.email} onChange={(e) => setF('email', e.target.value)} placeholder="john@company.com" />
              {errors.email && <span className="error-msg">{errors.email}</span>}</div>
            <div className="field"><label className="label">Phone</label>
              <input className="input" type="tel" value={form.phone} onChange={(e) => setF('phone', e.target.value)} placeholder="+1 234 567 890" />
            </div>
          </div>
          <div className="field-row">
            <div className="field"><label className="label">Address</label>
              <input className="input" type="text" value={form.address} onChange={(e) => setF('address', e.target.value)} placeholder="123 Main St, City" />
            </div>
          </div>
          <div className="field-row">
            <div className="field"><label className="label">Department</label>
              <input className="input" value={form.department} onChange={(e) => setF('department', e.target.value)} placeholder="Engineering" /></div>
            {isAdmin && form.role === 'user' && (
              <div className="field">
                <label className="label">Assign to Moderator(s) (Managers)</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', maxHeight: '120px', overflowY: 'auto', padding: '10px', border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius-md)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 14, cursor: 'pointer' }}>
                    <input type="checkbox" checked={assigneesArray.includes(currentUserId)} onChange={() => toggleModerator(currentUserId)} />
                    <span>Self (Admin)</span>
                  </label>
                  {users.filter(u => u.role === 'moderator').map(m => (
                    <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 14, cursor: 'pointer' }}>
                      <input type="checkbox" checked={assigneesArray.includes(m.id)} onChange={() => toggleModerator(m.id)} />
                      <span>{m.fullName}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          {!user && (
            <div style={{ background: 'var(--info-light)', border: '1px solid rgba(59,130,246,.2)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 13, color: 'var(--info-dark)' }}>
              <strong>ℹ️ Note:</strong> The user will be required to change their password on first login.
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-brand" onClick={() => { if (validate()) onSave(form); }}>
            {user ? 'Save Changes' : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  );
}

import { ConfirmModal } from '../../components/ConfirmModal';

export default function UsersPage() {
  const { currentUser } = useAuth();
  const { toasts, push } = useToast();
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
  const [search, setSearch]     = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [modalState, setModalState] = useState<{ type: 'create' } | { type: 'edit'; user: SafeUser } | null>(null);
  const [confirmState, setConfirmState] = useState<{ title: string; message: string; onConfirm: () => void; confirmText?: string; confirmStyle?: 'danger'|'brand'|'warning' } | null>(null);

  const loadUsers = useCallback(() => {
    fetch('/api/users')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers((prev) => (JSON.stringify(prev) === JSON.stringify(data) ? prev : data));
        }
      })
      .catch(() => {});
  }, []);

  const loadPresence = useCallback(() => {
    if (!currentUser) return;
    fetch(`/api/presence?userId=${currentUser.id}&role=${currentUser.role}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.onlineUsers && Array.isArray(data.onlineUsers)) {
          const newIds = (data.onlineUsers as any[]).map((u: any) => u.id).sort().join(',');
          setOnlineUserIds((prev) => {
            const prevIds = Array.from(prev).sort().join(',');
            if (prevIds === newIds) return prev;
            return new Set(data.onlineUsers.map((u: any) => u.id));
          });
        }
      })
      .catch(() => {});
  }, [currentUser]);

  useEffect(() => {
    loadUsers();
    loadPresence();
    const interval = setInterval(loadPresence, 20000);
    return () => clearInterval(interval);
  }, [loadUsers, loadPresence]);

  if (!currentUser || currentUser.role === 'user') return null;

  const isAdmin     = currentUser.role === 'admin';
  const isModerator = currentUser.role === 'moderator';

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.fullName.toLowerCase().includes(q) || u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole   = filterRole === 'all' || u.role === filterRole;
    const matchAccess = isAdmin || (u.role === 'user' && (u.createdBy?.includes(currentUser.id) || u.id === currentUser.id));
    return matchSearch && matchRole && matchAccess;
  });

  async function handleSave(form: UserFormData) {
    const editUser = modalState?.type === 'edit' ? modalState.user : null;
    if (editUser) {
      const res = await fetch(`/api/users/${editUser.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: form.fullName, email: form.email, phone: form.phone, address: form.address, department: form.department, role: form.role, createdBy: form.createdBy, ...(form.password ? { password: form.password, isFirstLogin: true } : {}) }),
      });
      if (res.ok) { push('success', 'Account updated'); loadUsers(); setModalState(null); }
      else { const d = await res.json(); push('error', d.error ?? 'Failed'); }
    } else {
      const res = await fetch('/api/users', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form }),
      });
      if (res.ok) { push('success', `Account created — ${form.fullName} must change password on first login`); loadUsers(); setModalState(null); }
      else { const d = await res.json(); push('error', d.error ?? 'Failed'); }
    }
  }

  function handleDelete(user: SafeUser) {
    if (user.id === currentUser!.id) { push('error', 'Cannot delete your own account'); return; }
    setConfirmState({
      title: 'Delete Account',
      message: `Are you sure you want to delete ${user.fullName}? This cannot be undone.`,
      confirmText: 'Delete Account',
      confirmStyle: 'danger',
      onConfirm: async () => {
        setConfirmState(null);
        const res = await fetch(`/api/users/${user.id}`, { method: 'DELETE' });
        if (res.ok) { push('info', 'Account deleted'); loadUsers(); }
        else push('error', 'Failed to delete');
      }
    });
  }

  function handleResetPassword(user: SafeUser) {
    setConfirmState({
      title: 'Reset Password',
      message: `Are you sure you want to reset ${user.fullName}'s password? They will be prompted on next login.`,
      confirmText: 'Reset Password',
      confirmStyle: 'warning',
      onConfirm: async () => {
        setConfirmState(null);
        const res = await fetch(`/api/users/${user.id}`, {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isFirstLogin: true }),
        });
        if (res.ok) { push('success', 'Password reset — user prompted on next login'); loadUsers(); }
        else push('error', 'Failed');
      }
    });
  }

  const roleCounts = {
    admin:     users.filter((u) => u.role === 'admin').length,
    moderator: users.filter((u) => u.role === 'moderator').length,
    user:      users.filter((u) => u.role === 'user').length,
  };

  return (
    <>
      <div className="toast-container">{toasts.map((t) => <div key={t.id} className={`toast toast-${t.type}`}>{t.text}</div>)}</div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--neutral-900)' }}>{isAdmin ? 'User Management' : 'Users'}</h2>
          <p className="text-sm text-neutral" style={{ marginTop: 2 }}>{isAdmin ? `${users.length} accounts total` : `${users.filter((u) => u.role === 'user').length} users`}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="view-toggle-group" style={{ display: 'flex', border: '1.5px solid var(--neutral-200)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            {(['grid', 'list'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{ padding: '7px 12px', border: 'none', background: view === v ? 'var(--brand-600)' : 'var(--neutral-0)', color: view === v ? 'white' : 'var(--neutral-500)', cursor: 'pointer', transition: 'all .2s' }}
                title={v === 'grid' ? 'Icon View' : 'Table View'}
                aria-label={v === 'grid' ? 'Icon View' : 'Table View'}
              >
                {v === 'grid'
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>}
              </button>
            ))}
          </div>
          {isAdmin && (
            <button id="create-user-btn" className="btn btn-brand" onClick={() => setModalState({ type: 'create' })}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>
              Create Account
            </button>
          )}
        </div>
      </div>

      {isAdmin && (
        <div className="stats-grid" style={{ marginBottom: 24 }}>
          {(Object.entries(roleCounts) as [string, number][]).map(([role, count]) => (
            <div key={role} className="stat-card" style={{ cursor: 'default' }}>
              <div className="stat-content"><div className="stat-label">{role}s</div><div className="stat-value">{count}</div></div>
              <span className={`badge badge-${role}`} style={{ alignSelf: 'center' }}>{role}</span>
            </div>
          ))}
        </div>
      )}

      <div className="filter-row">
        <div className="search-bar" style={{ flex: 1, maxWidth: 320 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--neutral-400)', flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input placeholder="Search by name, username, email…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {isAdmin && (
          <select className="select" style={{ width: 'auto' }} value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="user">User</option>
          </select>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="card"><div className="empty-state"><div className="empty-state-icon">👥</div><h3>No accounts found</h3><p>Click "Create Account" to add one.</p></div></div>
      ) : (
        <>
          {(() => {
            const renderUserIconCard = (u: SafeUser, keyPrefix: string) => {
              const isOnline = onlineUserIds.has(u.id);
              return (
              <div key={`${keyPrefix}-${u.id}`} className="mobile-icon-card">
                <div className="mobile-icon-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ position: 'relative' }}>
                      <div className="sidebar-avatar" style={{ width: 36, height: 36, fontSize: 13 }}>
                        {u.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                      {isOnline && (
                        <span className="presence-pulse-dot-sm" title="Online Now" />
                      )}
                    </div>
                    <div>
                      <div className="mobile-icon-card-title">{u.fullName}</div>
                      <div style={{ fontSize: 12, color: 'var(--neutral-400)' }}>@{u.username}</div>
                    </div>
                  </div>
                  {/* Status as Icon */}
                  {isOnline ? (
                    <span className="icon-chip icon-chip-success" title="Online Now" style={{ borderColor: 'var(--success)', background: 'var(--success-light)', color: 'var(--success-dark)', fontWeight: 600 }}>
                      <span className="presence-pulse-dot" style={{ width: 7, height: 7 }} />
                      Online
                    </span>
                  ) : u.isFirstLogin ? (
                    <span className="icon-chip icon-chip-warning" title="Pending Setup">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      Setup
                    </span>
                  ) : (
                    <span className="icon-chip" title="Offline" style={{ opacity: 0.8 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                      Offline
                    </span>
                  )}
                </div>

                {/* All User Details as Icons */}
                <div className="mobile-details-icon-bar">
                  {/* Role Icon */}
                  {u.role === 'admin' && (
                    <span className="icon-chip icon-chip-error" title="Admin">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      Admin
                    </span>
                  )}
                  {u.role === 'moderator' && (
                    <span className="icon-chip icon-chip-warning" title="Moderator">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                      Moderator
                    </span>
                  )}
                  {u.role === 'user' && (
                    <span className="icon-chip icon-chip-brand" title="User">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      User
                    </span>
                  )}

                  {/* Email as clickable Icon */}
                  <a href={`mailto:${u.email}`} className="icon-chip icon-chip-link" title="Send Email">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    {u.email}
                  </a>

                  {/* Phone as clickable Icon */}
                  {u.phone && (
                    <a href={`tel:${u.phone}`} className="icon-chip icon-chip-link" title="Call Phone">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      {u.phone}
                    </a>
                  )}

                  {/* Department Icon */}
                  <span className="icon-chip" title="Department">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2"/>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                    </svg>
                    {u.department || 'General'}
                  </span>

                  {/* Address Icon */}
                  {u.address && (
                    <span className="icon-chip" title="Address">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      {u.address}
                    </span>
                  )}

                  {/* Created Date Icon */}
                  <span className="icon-chip" title="Account Created">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="mobile-icon-actions">
                  {(isAdmin || (isModerator && u.role === 'user')) && (
                    <>
                      <button className="mobile-icon-btn" onClick={() => setModalState({ type: 'edit', user: u })} title="Edit Account" aria-label="Edit Account">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button className="mobile-icon-btn" onClick={() => handleResetPassword(u)} title="Reset Password" aria-label="Reset Password" style={{ color: 'var(--warning)', borderColor: 'var(--warning)' }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
                      </button>
                    </>
                  )}
                  {isAdmin && u.id !== currentUser.id && (
                    <button className="mobile-icon-btn mobile-icon-btn-danger" onClick={() => handleDelete(u)} title="Delete Account" aria-label="Delete Account">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    </button>
                  )}
                </div>
              </div>
            );
          };

            return (
              <>
                {/* Mobile / Tablet Icon Cards View (Shown on screens <= 1024px instead of table) */}
                <div className="mobile-only-cards">
                  {filtered.map((u) => renderUserIconCard(u, 'm'))}
                </div>

                {/* Desktop Views (Icon Grid or Table) */}
                <div className="desktop-only-table">
                  {view === 'grid' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
                      {filtered.map((u) => renderUserIconCard(u, 'd'))}
                    </div>
                  ) : (
              <div className="card">
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>User</th><th>Contact Details</th><th>Username</th><th>Department</th><th>Role</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead>
                    <tbody>
                      {filtered.map((u) => (
                        <tr key={u.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ position: 'relative' }}>
                                <div className="sidebar-avatar" style={{ width: 34, height: 34, fontSize: 12 }}>
                                  {u.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                                </div>
                                {onlineUserIds.has(u.id) && (
                                  <span className="presence-pulse-dot-sm" title="Online Now" />
                                )}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, color: 'var(--neutral-900)' }}>{u.fullName}</div>
                                <div style={{ fontSize: 12, color: 'var(--neutral-400)' }}>{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontSize: 12, color: 'var(--neutral-600)' }}>{u.phone || '—'}</div>
                            <div style={{ fontSize: 12, color: 'var(--neutral-600)' }}>{u.address || '—'}</div>
                          </td>
                          <td style={{ fontFamily: 'monospace', fontSize: 13 }}>@{u.username}</td>
                          <td style={{ fontSize: 13, color: 'var(--neutral-600)' }}>{u.department || '—'}</td>
                          <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                          <td>
                            {onlineUserIds.has(u.id) ? (
                              <span className="badge badge-done" style={{ fontWeight: 700, gap: 5 }}>
                                <span className="presence-pulse-dot" style={{ width: 6, height: 6 }} />
                                Online
                              </span>
                            ) : u.isFirstLogin ? (
                              <span className="badge badge-review">Pending Setup</span>
                            ) : (
                              <span className="badge" style={{ background: 'var(--neutral-100)', color: 'var(--neutral-500)', fontSize: 11 }}>Offline</span>
                            )}
                          </td>
                          <td style={{ fontSize: 12, color: 'var(--neutral-400)' }}>
                            <div>{new Date(u.createdAt).toLocaleDateString()}</div>
                            <div>{new Date(u.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              {(isAdmin || (isModerator && u.role === 'user')) && (
                                <>
                                  <button className="btn btn-outline btn-sm" onClick={() => setModalState({ type: 'edit', user: u })} title="Edit">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                  </button>
                                  <button className="btn btn-outline btn-sm" onClick={() => handleResetPassword(u)} title="Reset password" style={{ color: 'var(--warning)', borderColor: 'var(--warning)' }}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
                                  </button>
                                </>
                              )}
                              {isAdmin && u.id !== currentUser.id && (
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u)} title="Delete">
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      );
    })()}
  </>
)}

      {modalState && (
        <UserModal user={modalState.type === 'edit' ? modalState.user : null}
          canCreateModerator={isAdmin} users={users} currentUserId={currentUser.id} isAdmin={isAdmin} onClose={() => setModalState(null)} onSave={handleSave} />
      )}

      {confirmState && (
        <ConfirmModal
          title={confirmState.title}
          message={confirmState.message}
          onConfirm={confirmState.onConfirm}
          onCancel={() => setConfirmState(null)}
          confirmText={confirmState.confirmText}
          confirmStyle={confirmState.confirmStyle}
        />
      )}
    </>
  );
}
