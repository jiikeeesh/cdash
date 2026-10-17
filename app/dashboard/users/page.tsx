'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth, type SafeUser } from '../../lib/auth-context';
import { ConfirmModal } from '../../components/ConfirmModal';

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

const MOD_GRADIENTS = [
  'linear-gradient(135deg, #f59e0b, #d97706)',
  'linear-gradient(135deg, #06b6d4, #0891b2)',
  'linear-gradient(135deg, #10b981, #059669)',
  'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  'linear-gradient(135deg, #ec4899, #db2777)',
  'linear-gradient(135deg, #3b82f6, #2563eb)',
];

function getInitials(name: string): string {
  return name.trim().split(/\s+/).map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
}

// ── User Creation / Edit Modal ─────────────────────────────────────────────────
function UserModal({ user, canCreateModerator, onClose, onSave, users, currentUserId, isAdmin, onlineUserIds }: {
  user: SafeUser | null; canCreateModerator: boolean;
  onClose: () => void; onSave: (data: UserFormData) => void;
  users: SafeUser[]; currentUserId: string; isAdmin: boolean;
  onlineUserIds?: Set<string>;
}) {
  const [form, setForm] = useState<UserFormData>(
    user ? { username: user.username, password: '', fullName: user.fullName, email: user.email, phone: user.phone || '', address: user.address || '', department: user.department, role: user.role, createdBy: user.createdBy }
         : { ...EMPTY_FORM, createdBy: currentUserId }
  );
  const [errors, setErrors] = useState<Partial<UserFormData>>({});
  const [modalTab, setModalTab] = useState<'profile' | 'moderators'>('profile');
  const [modSearch, setModSearch] = useState('');
  const setF = (k: keyof UserFormData, v: string) => setForm((p) => ({ ...p, [k]: v }));

  function validate() {
    const e: Partial<UserFormData> = {};
    if (!form.fullName.trim()) e.fullName = 'Required';
    if (!form.username.trim()) e.username = 'Required';
    if (!user && !form.password.trim()) e.password = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    setErrors(e);
    if (Object.keys(e).length > 0) {
      setModalTab('profile');
    }
    return Object.keys(e).length === 0;
  }

  const assigneesArray = form.createdBy ? form.createdBy.split(',').filter(Boolean) : [];
  const currentAdmin = users.find((u) => u.id === currentUserId);
  const moderators = users.filter((u) => u.role === 'moderator');

  const toggleModerator = (modId: string) => {
    let newArr = [...assigneesArray];
    if (newArr.includes(modId)) {
      newArr = newArr.filter((id) => id !== modId);
    } else {
      newArr.push(modId);
    }
    if (newArr.length === 0) newArr.push(currentUserId);
    setF('createdBy', newArr.join(','));
  };

  const selectAllModerators = () => {
    const allIds = Array.from(new Set([currentUserId, ...moderators.map((m) => m.id)]));
    setF('createdBy', allIds.join(','));
  };

  const selectOnlySelf = () => {
    setF('createdBy', currentUserId);
  };

  const q = modSearch.toLowerCase().trim();
  const filteredModerators = moderators.filter((m) => {
    if (!q) return true;
    return (
      m.fullName.toLowerCase().includes(q) ||
      m.username.toLowerCase().includes(q) ||
      (m.department && m.department.toLowerCase().includes(q)) ||
      m.email.toLowerCase().includes(q)
    );
  });

  const isSelfMatching = (() => {
    if (!q) return true;
    if (!currentAdmin) return 'admin self you primary'.includes(q);
    return (
      currentAdmin.fullName.toLowerCase().includes(q) ||
      currentAdmin.username.toLowerCase().includes(q) ||
      (currentAdmin.department && currentAdmin.department.toLowerCase().includes(q)) ||
      currentAdmin.email.toLowerCase().includes(q) ||
      'admin self you primary'.includes(q)
    );
  })();

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 580, width: '100%' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{user ? 'Edit Account' : 'Create Account'}</h3>
          <button className="btn-close" onClick={onClose}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>

        {isAdmin && form.role === 'user' && (
          <div style={{ display: 'flex', borderBottom: '1.5px solid var(--neutral-200)', padding: '0 24px', gap: '8px', background: 'var(--neutral-50)' }}>
            <button
              type="button"
              onClick={() => setModalTab('profile')}
              style={{
                padding: '10px 14px',
                fontSize: '13px',
                fontWeight: 600,
                background: 'none',
                border: 'none',
                borderBottom: modalTab === 'profile' ? '2.5px solid var(--brand-600)' : '2.5px solid transparent',
                color: modalTab === 'profile' ? 'var(--brand-600)' : 'var(--neutral-500)',
                cursor: 'pointer'
              }}
            >
              👤 Account Details
            </button>
            <button
              type="button"
              onClick={() => setModalTab('moderators')}
              style={{
                padding: '10px 14px',
                fontSize: '13px',
                fontWeight: 600,
                background: 'none',
                border: 'none',
                borderBottom: modalTab === 'moderators' ? '2.5px solid var(--brand-600)' : '2.5px solid transparent',
                color: modalTab === 'moderators' ? 'var(--brand-600)' : 'var(--neutral-500)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              🛡️ Assign to Moderator(s)
              <span className="badge badge-brand" style={{ fontSize: '11px', padding: '1px 6px' }}>
                {assigneesArray.length}
              </span>
            </button>
          </div>
        )}

        <div className="modal-body">
          {modalTab === 'profile' ? (
            <>
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
                <div className="field"><label className="label">Department</label>
                  <input className="input" value={form.department} onChange={(e) => setF('department', e.target.value)} placeholder="Engineering" />
                </div>
                <div className="field"><label className="label">Address</label>
                  <input className="input" type="text" value={form.address} onChange={(e) => setF('address', e.target.value)} placeholder="123 Main St, City" />
                </div>
              </div>

              {!user && (
                <div style={{ background: 'var(--info-light)', border: '1px solid rgba(59,130,246,.2)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 13, color: 'var(--info-dark)' }}>
                  <strong>ℹ️ Note:</strong> The user will be required to change their password on first login.
                </div>
              )}
            </>
          ) : (
            <div className="mod-assign-box" style={{ margin: 0 }}>
              <div className="mod-assign-header">
                <div className="mod-assign-title-wrap">
                  <div className="mod-assign-title-row">
                    <span className="mod-assign-title">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      Assign to Moderator(s) (Managers)
                    </span>
                    <span className="mod-assign-badge">
                      {assigneesArray.length} {assigneesArray.length === 1 ? 'manager' : 'managers'} selected
                    </span>
                  </div>
                  <span className="mod-assign-subtitle">
                    Select which moderators or administrators can supervise, assign tasks, and monitor this user.
                  </span>
                </div>
                {moderators.length > 0 && (
                  <div className="mod-assign-actions">
                    <button type="button" className="mod-quick-btn" onClick={selectAllModerators} title="Assign all available managers">
                      Select All
                    </button>
                    <button type="button" className="mod-quick-btn" onClick={selectOnlySelf} title="Assign only current administrator">
                      Only You
                    </button>
                  </div>
                )}
              </div>

              {moderators.length >= 2 && (
                <div className="mod-search-wrap">
                  <span className="mod-search-icon">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    className="mod-search-input"
                    value={modSearch}
                    onChange={(e) => setModSearch(e.target.value)}
                    placeholder="Search managers by name, email, or department..."
                  />
                  {modSearch && (
                    <button type="button" className="mod-search-clear" onClick={() => setModSearch('')} title="Clear search">×</button>
                  )}
                </div>
              )}

              <div className="mod-assign-grid">
                {isSelfMatching && (
                  <div
                    className={`mod-card ${assigneesArray.includes(currentUserId) ? 'selected' : ''}`}
                    onClick={() => toggleModerator(currentUserId)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleModerator(currentUserId); } }}
                    title="Click to toggle assignment to Admin"
                  >
                    <div className="mod-card-left">
                      <div className="mod-card-avatar" style={{ background: 'linear-gradient(135deg, #6366f1, #4338ca)' }}>
                        {getInitials(currentAdmin?.fullName || 'Admin')}
                        {onlineUserIds?.has(currentUserId) && (
                          <span className="presence-pulse-dot-sm" style={{ position: 'absolute', bottom: -1, right: -1 }} title="Online Now" />
                        )}
                      </div>
                      <div className="mod-card-body">
                        <div className="mod-card-name-row">
                          <span className="mod-card-name">{currentAdmin?.fullName || 'Admin (You)'}</span>
                          <span className="mod-card-role-tag mod-card-role-admin">👑 Admin (You)</span>
                        </div>
                        <div className="mod-card-meta">{currentAdmin?.department || 'Primary Administrator'}</div>
                      </div>
                    </div>
                    <div className="mod-card-check">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  </div>
                )}

                {filteredModerators.map((m, idx) => {
                  const isSelected = assigneesArray.includes(m.id);
                  const isOnline = onlineUserIds?.has(m.id);
                  return (
                    <div
                      key={m.id}
                      className={`mod-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleModerator(m.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleModerator(m.id); } }}
                      title={`Click to toggle assignment to ${m.fullName}`}
                    >
                      <div className="mod-card-left">
                        <div className="mod-card-avatar" style={{ background: MOD_GRADIENTS[idx % MOD_GRADIENTS.length] }}>
                          {getInitials(m.fullName)}
                          {isOnline && (
                            <span className="presence-pulse-dot-sm" style={{ position: 'absolute', bottom: -1, right: -1 }} title="Online Now" />
                          )}
                        </div>
                        <div className="mod-card-body">
                          <div className="mod-card-name-row">
                            <span className="mod-card-name">{m.fullName}</span>
                            <span className="mod-card-role-tag mod-card-role-mod">⚡ Moderator</span>
                          </div>
                          <div className="mod-card-meta">
                            {m.department ? `${m.department} • ` : ''}@{m.username}
                          </div>
                        </div>
                      </div>
                      <div className="mod-card-check">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    </div>
                  );
                })}

                {!isSelfMatching && filteredModerators.length === 0 && (
                  <div className="mod-assign-empty" style={{ gridColumn: '1 / -1' }}>
                    No managers found matching &ldquo;{modSearch}&rdquo;.
                    <button
                      type="button"
                      onClick={() => setModSearch('')}
                      style={{ background: 'none', border: 'none', color: 'var(--brand-600)', fontWeight: 600, marginLeft: 6, cursor: 'pointer', textDecoration: 'underline', fontSize: 12 }}
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </div>

              {moderators.length === 0 && (
                <div style={{ marginTop: 8, fontSize: 11.5, color: 'var(--neutral-500)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>💡</span>
                  <span>No other moderators found. You can add more managers anytime by creating accounts with the <strong>Moderator</strong> role.</span>
                </div>
              )}

              <div className="mod-assign-footer">
                <span>
                  👥 Supervised by <strong>{assigneesArray.length} {assigneesArray.length === 1 ? 'manager' : 'managers'}</strong>
                  {assigneesArray.includes(currentUserId) ? ' (including you)' : ''}
                </span>
                {assigneesArray.length === 0 && (
                  <span style={{ color: 'var(--warning-dark)', fontWeight: 600 }}>⚠️ At least 1 manager required</span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          {modalTab === 'profile' && isAdmin && form.role === 'user' ? (
            <button className="btn btn-brand" onClick={() => { if (validate()) setModalTab('moderators'); }}>
              Next: Assign Moderators →
            </button>
          ) : (
            <button className="btn btn-brand" onClick={() => { if (validate()) onSave(form); }}>
              {user ? 'Save Changes' : 'Create Account'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Standalone Assign Managers Modal (For a single User) ───────────────────────
function AssignUserManagersModal({
  user,
  users,
  currentUserId,
  onlineUserIds,
  onClose,
  onSave,
}: {
  user: SafeUser;
  users: SafeUser[];
  currentUserId: string;
  onlineUserIds?: Set<string>;
  onClose: () => void;
  onSave: (userId: string, newCreatedBy: string) => Promise<void>;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    user.createdBy ? user.createdBy.split(',').filter(Boolean) : [currentUserId]
  );
  const [modSearch, setModSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const currentAdmin = users.find((u) => u.id === currentUserId);
  const moderators = users.filter((u) => u.role === 'moderator');

  const toggle = (id: string) => {
    let arr = [...selectedIds];
    if (arr.includes(id)) arr = arr.filter((x) => x !== id);
    else arr.push(id);
    if (arr.length === 0) arr.push(currentUserId);
    setSelectedIds(arr);
  };

  const selectAll = () => {
    setSelectedIds(Array.from(new Set([currentUserId, ...moderators.map((m) => m.id)])));
  };

  const selectOnlySelf = () => {
    setSelectedIds([currentUserId]);
  };

  const q = modSearch.toLowerCase().trim();
  const filteredMods = moderators.filter(
    (m) =>
      !q ||
      m.fullName.toLowerCase().includes(q) ||
      m.username.toLowerCase().includes(q) ||
      (m.department && m.department.toLowerCase().includes(q)) ||
      m.email.toLowerCase().includes(q)
  );

  const isSelfMatching =
    !q ||
    (currentAdmin &&
      (currentAdmin.fullName.toLowerCase().includes(q) ||
        currentAdmin.username.toLowerCase().includes(q) ||
        'admin self you primary'.includes(q)));

  async function handleConfirm() {
    setSaving(true);
    try {
      await onSave(user.id, selectedIds.join(','));
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 580, width: '100%' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🛡️</span> Assign Managers for {user.fullName}
            </h3>
            <p style={{ fontSize: 12, color: 'var(--neutral-500)', marginTop: 2 }}>
              @{user.username} • {user.department || 'General'}
            </p>
          </div>
          <button className="btn-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="modal-body">
          <div className="mod-assign-box" style={{ margin: 0 }}>
            <div className="mod-assign-header">
              <div className="mod-assign-title-wrap">
                <div className="mod-assign-title-row">
                  <span className="mod-assign-title">Assigned Supervisors</span>
                  <span className="mod-assign-badge">
                    {selectedIds.length} {selectedIds.length === 1 ? 'manager' : 'managers'} selected
                  </span>
                </div>
                <span className="mod-assign-subtitle">
                  Selected moderators and administrators can view this user, assign tasks, and track attendance.
                </span>
              </div>
              {moderators.length > 0 && (
                <div className="mod-assign-actions">
                  <button type="button" className="mod-quick-btn" onClick={selectAll}>Select All</button>
                  <button type="button" className="mod-quick-btn" onClick={selectOnlySelf}>Only You</button>
                </div>
              )}
            </div>

            {moderators.length >= 2 && (
              <div className="mod-search-wrap">
                <span className="mod-search-icon">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </span>
                <input
                  type="text"
                  className="mod-search-input"
                  value={modSearch}
                  onChange={(e) => setModSearch(e.target.value)}
                  placeholder="Filter managers by name or department..."
                />
                {modSearch && (
                  <button type="button" className="mod-search-clear" onClick={() => setModSearch('')}>×</button>
                )}
              </div>
            )}

            <div className="mod-assign-grid">
              {isSelfMatching && (
                <div
                  className={`mod-card ${selectedIds.includes(currentUserId) ? 'selected' : ''}`}
                  onClick={() => toggle(currentUserId)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(currentUserId); } }}
                >
                  <div className="mod-card-left">
                    <div className="mod-card-avatar" style={{ background: 'linear-gradient(135deg, #6366f1, #4338ca)' }}>
                      {getInitials(currentAdmin?.fullName || 'Admin')}
                      {onlineUserIds?.has(currentUserId) && (
                        <span className="presence-pulse-dot-sm" style={{ position: 'absolute', bottom: -1, right: -1 }} title="Online Now" />
                      )}
                    </div>
                    <div className="mod-card-body">
                      <div className="mod-card-name-row">
                        <span className="mod-card-name">{currentAdmin?.fullName || 'Admin (You)'}</span>
                        <span className="mod-card-role-tag mod-card-role-admin">👑 Admin (You)</span>
                      </div>
                      <div className="mod-card-meta">{currentAdmin?.department || 'Primary Administrator'}</div>
                    </div>
                  </div>
                  <div className="mod-card-check">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>
              )}

              {filteredMods.map((m, idx) => {
                const isSelected = selectedIds.includes(m.id);
                return (
                  <div
                    key={m.id}
                    className={`mod-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggle(m.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(m.id); } }}
                  >
                    <div className="mod-card-left">
                      <div className="mod-card-avatar" style={{ background: MOD_GRADIENTS[idx % MOD_GRADIENTS.length] }}>
                        {getInitials(m.fullName)}
                        {onlineUserIds?.has(m.id) && (
                          <span className="presence-pulse-dot-sm" style={{ position: 'absolute', bottom: -1, right: -1 }} title="Online Now" />
                        )}
                      </div>
                      <div className="mod-card-body">
                        <div className="mod-card-name-row">
                          <span className="mod-card-name">{m.fullName}</span>
                          <span className="mod-card-role-tag mod-card-role-mod">⚡ Moderator</span>
                        </div>
                        <div className="mod-card-meta">{m.department ? `${m.department} • ` : ''}@{m.username}</div>
                      </div>
                    </div>
                    <div className="mod-card-check">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  </div>
                );
              })}

              {!isSelfMatching && filteredMods.length === 0 && (
                <div className="mod-assign-empty" style={{ gridColumn: '1 / -1' }}>
                  No managers matching &ldquo;{modSearch}&rdquo;.
                </div>
              )}
            </div>

            <div className="mod-assign-footer">
              <span>Supervised by {selectedIds.length} manager(s){selectedIds.includes(currentUserId) ? ' (including you)' : ''}</span>
              {selectedIds.length === 0 && (
                <span style={{ color: 'var(--warning-dark)', fontWeight: 600 }}>⚠️ At least 1 manager required</span>
              )}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="btn btn-brand" onClick={handleConfirm} disabled={saving}>
            {saving ? 'Saving...' : 'Save Assignments'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Standalone Assign Team Members Modal (For a Moderator) ─────────────────────
function AssignModeratorTeamModal({
  moderator,
  users,
  currentUserId,
  onlineUserIds,
  onClose,
  onSave,
}: {
  moderator: SafeUser;
  users: SafeUser[];
  currentUserId: string;
  onlineUserIds?: Set<string>;
  onClose: () => void;
  onSave: (updates: { userId: string; createdBy: string }[]) => Promise<void>;
}) {
  const standardUsers = users.filter((u) => u.role === 'user');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(
    standardUsers.filter((u) => (u.createdBy ? u.createdBy.split(',').includes(moderator.id) : (moderator.role === 'admin'))).map((u) => u.id)
  );
  const [userSearch, setUserSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const toggleUser = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const selectAll = () => setSelectedUserIds(standardUsers.map((u) => u.id));
  const deselectAll = () => setSelectedUserIds([]);

  const q = userSearch.toLowerCase().trim();
  const filteredUsers = standardUsers.filter(
    (u) =>
      !q ||
      u.fullName.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      (u.department && u.department.toLowerCase().includes(q)) ||
      u.email.toLowerCase().includes(q)
  );

  async function handleConfirm() {
    setSaving(true);
    try {
      const updates: { userId: string; createdBy: string }[] = [];
      for (const u of standardUsers) {
        const currentAssignees = u.createdBy ? u.createdBy.split(',').filter(Boolean) : [currentUserId];
        const isCurrentlyAssigned = currentAssignees.includes(moderator.id);
        const shouldBeAssigned = selectedUserIds.includes(u.id);

        if (isCurrentlyAssigned !== shouldBeAssigned) {
          let newArr = [...currentAssignees];
          if (shouldBeAssigned && !newArr.includes(moderator.id)) {
            newArr.push(moderator.id);
          } else if (!shouldBeAssigned && newArr.includes(moderator.id)) {
            newArr = newArr.filter((id) => id !== moderator.id);
          }
          if (newArr.length === 0) newArr.push(currentUserId);
          updates.push({ userId: u.id, createdBy: newArr.join(',') });
        }
      }
      await onSave(updates);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 580, width: '100%' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>👥</span> Manage Team for {moderator.fullName}
            </h3>
            <p style={{ fontSize: 12, color: 'var(--neutral-500)', marginTop: 2 }}>
              {moderator.role === 'admin' ? 'Primary Administrator' : 'Moderator'} • {moderator.department || 'General'}
            </p>
          </div>
          <button className="btn-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="modal-body">
          <div className="mod-assign-box" style={{ margin: 0 }}>
            <div className="mod-assign-header">
              <div className="mod-assign-title-wrap">
                <div className="mod-assign-title-row">
                  <span className="mod-assign-title">Select Team Members</span>
                  <span className="mod-assign-badge">
                    {selectedUserIds.length} of {standardUsers.length} assigned
                  </span>
                </div>
                <span className="mod-assign-subtitle">
                  Check which staff members {moderator.fullName} can supervise and assign tasks to.
                </span>
              </div>
              <div className="mod-assign-actions">
                <button type="button" className="mod-quick-btn" onClick={selectAll}>Select All</button>
                <button type="button" className="mod-quick-btn" onClick={deselectAll}>Clear All</button>
              </div>
            </div>

            <div className="mod-search-wrap">
              <span className="mod-search-icon">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </span>
              <input
                type="text"
                className="mod-search-input"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search staff by name, email, or department..."
              />
              {userSearch && (
                <button type="button" className="mod-search-clear" onClick={() => setUserSearch('')}>×</button>
              )}
            </div>

            <div className="mod-assign-grid">
              {filteredUsers.map((u, idx) => {
                const isSelected = selectedUserIds.includes(u.id);
                return (
                  <div
                    key={u.id}
                    className={`mod-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleUser(u.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleUser(u.id); } }}
                  >
                    <div className="mod-card-left">
                      <div className="mod-card-avatar" style={{ background: MOD_GRADIENTS[idx % MOD_GRADIENTS.length] }}>
                        {getInitials(u.fullName)}
                        {onlineUserIds?.has(u.id) && (
                          <span className="presence-pulse-dot-sm" style={{ position: 'absolute', bottom: -1, right: -1 }} title="Online Now" />
                        )}
                      </div>
                      <div className="mod-card-body">
                        <div className="mod-card-name-row">
                          <span className="mod-card-name">{u.fullName}</span>
                        </div>
                        <div className="mod-card-meta">
                          {u.department ? `${u.department} • ` : ''}@{u.username}
                        </div>
                      </div>
                    </div>
                    <div className="mod-card-check">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  </div>
                );
              })}

              {filteredUsers.length === 0 && (
                <div className="mod-assign-empty" style={{ gridColumn: '1 / -1' }}>
                  No staff members matching &ldquo;{userSearch}&rdquo;.
                </div>
              )}
            </div>

            <div className="mod-assign-footer">
              <span>{selectedUserIds.length} staff members will be assigned to {moderator.fullName}</span>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="btn btn-brand" onClick={handleConfirm} disabled={saving}>
            {saving ? 'Saving...' : 'Save Team Members'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface AccountRequest {
  id: string;
  requestedById: string;
  requestedRole: string;
  fullName: string;
  email: string;
  department: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  resolvedAt?: string | null;
  resolvedById?: string | null;
  rejectionReason?: string | null;
}

// ── Moderator Request User Modal ──────────────────────────────────────────────
function ModeratorRequestUserModal({
  currentUser,
  users,
  onClose,
  onSuccess,
}: {
  currentUser: SafeUser;
  users: SafeUser[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  // Staff users not yet assigned to this moderator
  const unassignedStaff = users.filter((u) => u.role === 'user' && !u.createdBy?.includes(currentUser.id));
  const [selectedUserId, setSelectedUserId] = useState<string>(unassignedStaff[0]?.id || '');
  const [requestType, setRequestType] = useState<'existing' | 'new'>(unassignedStaff.length > 0 ? 'existing' : 'new');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const selectedUser = users.find((u) => u.id === selectedUserId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a reason or justification for this request.');
      return;
    }

    if (requestType === 'existing') {
      if (!selectedUser) {
        setError('Please select an existing staff member to request.');
        return;
      }
    } else {
      if (!fullName.trim() || !email.trim()) {
        setError('Please provide full name and email for the new user request.');
        return;
      }
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        requestedById: currentUser.id,
        requestedRole: requestType === 'existing' && selectedUser ? `staff_assignment:${selectedUser.id}` : 'user',
        fullName: requestType === 'existing' && selectedUser ? selectedUser.fullName : fullName.trim(),
        email: requestType === 'existing' && selectedUser ? selectedUser.email : email.trim(),
        department: requestType === 'existing' && selectedUser ? (selectedUser.department || '') : department.trim(),
        reason: reason.trim(),
      };

      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const d = await res.json();
        setError(d.error || 'Failed to submit request');
      }
    } catch {
      setError('Failed to submit request to Admin');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal task-modal-card" style={{ maxWidth: 540 }} onClick={(e) => e.stopPropagation()}>
        <div className="task-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="task-modal-icon-badge" style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)', color: '#d97706' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="16" y1="11" x2="22" y2="11"/>
              </svg>
            </div>
            <div>
              <h3 className="modal-title" style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                Request User Assignment
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: 13, color: 'var(--neutral-400)' }}>
                Ask the Admin to allocate a staff member to your management team
              </p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: '20px 26px' }}>
            {/* Request Type Toggle */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <button
                type="button"
                className={`task-filter-tab ${requestType === 'existing' ? 'active' : ''}`}
                style={{ flex: 1, padding: '8px 12px', fontSize: 13, textAlign: 'center' }}
                onClick={() => setRequestType('existing')}
              >
                Existing Staff Member ({unassignedStaff.length})
              </button>
              <button
                type="button"
                className={`task-filter-tab ${requestType === 'new' ? 'active' : ''}`}
                style={{ flex: 1, padding: '8px 12px', fontSize: 13, textAlign: 'center' }}
                onClick={() => setRequestType('new')}
              >
                + Request New Account
              </button>
            </div>

            {requestType === 'existing' ? (
              <div className="field">
                <label className="label">Select Staff Member *</label>
                {unassignedStaff.length === 0 ? (
                  <div style={{ padding: '12px 14px', background: 'var(--neutral-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-200)', fontSize: 13, color: 'var(--neutral-500)' }}>
                    All existing staff members are currently assigned to your team. You can switch to <strong>Request New Account</strong> above.
                  </div>
                ) : (
                  <select
                    className="select"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                  >
                    {unassignedStaff.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.fullName} (@{u.username}) {u.department ? `· ${u.department}` : ''}
                      </option>
                    ))}
                  </select>
                )}
                {selectedUser && (
                  <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--neutral-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-200)' }}>
                    <div className="sidebar-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                      {getInitials(selectedUser.fullName)}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--neutral-800)' }}>{selectedUser.fullName}</div>
                      <div style={{ fontSize: 11, color: 'var(--neutral-400)' }}>{selectedUser.email} {selectedUser.department ? `· ${selectedUser.department}` : ''}</div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="field-row">
                  <div className="field">
                    <label className="label">Full Name *</label>
                    <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Alex Morgan" />
                  </div>
                  <div className="field">
                    <label className="label">Email *</label>
                    <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alex@company.com" />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Department</label>
                  <input className="input" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. Support, Operations, Engineering" />
                </div>
              </>
            )}

            <div className="field" style={{ marginTop: 12 }}>
              <label className="label">Reason / Justification to Admin *</label>
              <textarea
                className="textarea"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain why your team needs this user (e.g., Handling customer escalation tickets for Q4 project deliverables)..."
              />
            </div>

            {error && (
              <div style={{ color: 'var(--error, #ef4444)', fontSize: 12, marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                ⚠️ {error}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={submitting}>Cancel</button>
            <button
              type="submit"
              className="btn btn-brand"
              disabled={submitting || (requestType === 'existing' && !selectedUserId)}
            >
              {submitting ? 'Submitting...' : 'Send Request to Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const REJECT_REASON_PRESETS = [
  'Staff member is currently dedicated to another critical project/sprint',
  'Department allocation capacity has been reached for this quarter',
  'Requires prior sign-off from the member\'s direct supervisor',
  'Please provide more details regarding expected timeline and workload',
  'Duplicate or conflicting team allocation request',
];

function RejectRequestModal({
  req,
  requesterName,
  onClose,
  onConfirm,
}: {
  req: AccountRequest;
  requesterName?: string;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
}) {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a reason so the requester understands why it was rejected.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await onConfirm(reason.trim());
      onClose();
    } catch {
      setError('Failed to submit rejection. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal task-modal-card" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
        <div className="task-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="task-modal-icon-badge" style={{ background: 'rgba(239, 68, 68, 0.12)', color: 'var(--error, #ef4444)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <div>
              <h3 className="modal-title" style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>
                Reject Allocation Request
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: 13, color: 'var(--neutral-400)' }}>
                Provide feedback explaining why this request cannot be approved
              </p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: '20px 24px' }}>
            <div style={{ background: 'var(--neutral-50)', border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius-md)', padding: '12px 14px', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--neutral-900)' }}>
                Request for: <span style={{ color: 'var(--brand-700)' }}>{req.fullName}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--neutral-500)', marginTop: 2 }}>
                Submitted by: {requesterName || 'Moderator'} {req.department ? `· ${req.department}` : ''}
              </div>
              {req.reason && (
                <div style={{ fontSize: 12, color: 'var(--neutral-600)', marginTop: 6, fontStyle: 'italic', borderTop: '1px dashed var(--neutral-200)', paddingTop: 6 }}>
                  Original Note: &ldquo;{req.reason}&rdquo;
                </div>
              )}
            </div>

            <div className="field">
              <label className="label">
                Quick Reason Suggestions <span style={{ fontSize: 11, color: 'var(--neutral-400)', fontWeight: 400 }}>(click to fill)</span>
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                {REJECT_REASON_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className="task-filter-tab"
                    style={{ fontSize: 11.5, padding: '4px 9px', textAlign: 'left', lineHeight: 1.3 }}
                    onClick={() => setReason(preset)}
                  >
                    📌 {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <label className="label">
                Rejection Reason / Feedback to Requester <span style={{ color: 'var(--error, #ef4444)' }}>*</span>
              </label>
              <textarea
                className="textarea"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Type or customize the reason for rejecting this request..."
                style={error ? { borderColor: 'var(--error, #ef4444)' } : undefined}
              />
              <span style={{ fontSize: 11.5, color: 'var(--neutral-400)', marginTop: 4, display: 'block' }}>
                This reason will be visible to the moderator on their request dashboard.
              </span>
            </div>

            {error && (
              <div style={{ color: 'var(--error, #ef4444)', fontSize: 12, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                ⚠️ {error}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-danger"
              disabled={submitting || !reason.trim()}
              style={{ gap: 6 }}
            >
              {submitting ? 'Rejecting...' : 'Confirm Rejection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Users Page ────────────────────────────────────────────────────────────
export default function UsersPage() {
  const { currentUser } = useAuth();
  const { toasts, push } = useToast();
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
  const [userStatusMap, setUserStatusMap] = useState<Record<string, string>>({});
  const [activeMainTab, setActiveMainTab] = useState<'directory' | 'moderators' | 'requests'>('directory');
  const [search, setSearch]     = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  // Requests state
  const [requests, setRequests] = useState<AccountRequest[]>([]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [rejectingRequest, setRejectingRequest] = useState<AccountRequest | null>(null);
  const [requestFilter, setRequestFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Modals state
  const [modalState, setModalState] = useState<{ type: 'create' } | { type: 'edit'; user: SafeUser } | null>(null);
  const [assigningUser, setAssigningUser] = useState<SafeUser | null>(null);
  const [assigningModerator, setAssigningModerator] = useState<SafeUser | null>(null);
  const [confirmState, setConfirmState] = useState<{ title: string; message: string; onConfirm: () => void; confirmText?: string; confirmStyle?: 'danger'|'brand'|'warning' } | null>(null);
  const [resetSuccessUser, setResetSuccessUser] = useState<{ user: SafeUser; password: string } | null>(null);

  const getStatusDisplay = (userId: string) => {
    const st = userStatusMap[userId] || 'active';
    switch (st) {
      case 'away':
        return { label: 'Away', dotClass: 'status-dot-away', color: '#92400e', bg: 'rgba(245, 158, 11, 0.12)', borderColor: 'var(--warning)' };
      case 'busy':
        return { label: 'Busy', dotClass: 'status-dot-busy', color: '#991b1b', bg: 'rgba(239, 68, 68, 0.12)', borderColor: 'var(--error)' };
      case 'dnd':
        return { label: 'DND', dotClass: 'status-dot-dnd', color: '#881337', bg: 'rgba(225, 29, 72, 0.12)', borderColor: '#e11d48' };
      case 'ooo':
        return { label: 'Out of Office', dotClass: 'status-dot-ooo', color: '#5b21b6', bg: 'rgba(139, 92, 246, 0.12)', borderColor: '#8b5cf6' };
      case 'active':
      default:
        return { label: 'Active', dotClass: 'status-dot-active', color: 'var(--success-dark)', bg: 'var(--success-light)', borderColor: 'var(--success)' };
    }
  };

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
          const statusMap: Record<string, string> = {};
          (data.onlineUsers as any[]).forEach((u: any) => {
            statusMap[u.id] = u.status || 'active';
          });
          setUserStatusMap(statusMap);
        }
      })
      .catch(() => {});
  }, [currentUser]);

  const loadRequests = useCallback(() => {
    if (!currentUser) return;
    const url = currentUser.role === 'admin'
      ? '/api/requests'
      : `/api/requests?requestedById=${currentUser.id}`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRequests(data);
        }
      })
      .catch(() => {});
  }, [currentUser]);

  useEffect(() => {
    loadUsers();
    loadPresence();
    loadRequests();
    const interval = setInterval(() => {
      loadUsers();
      loadPresence();
      loadRequests();
    }, 20000);
    return () => clearInterval(interval);
  }, [loadUsers, loadPresence, loadRequests]);

  async function handleApproveUserRequest(req: AccountRequest) {
    if (!currentUser || currentUser.role !== 'admin') return;

    let targetUserId = '';
    if (req.requestedRole.startsWith('staff_assignment:')) {
      targetUserId = req.requestedRole.replace('staff_assignment:', '');
    }

    let targetUser = users.find((u) => u.id === targetUserId);
    if (!targetUser) {
      targetUser = users.find((u) => u.email.toLowerCase() === req.email.toLowerCase()) ||
                   users.find((u) => u.fullName.toLowerCase() === req.fullName.toLowerCase());
    }

    if (targetUser) {
      // Existing user: allocate by adding moderator and admin to createdBy
      const currentAssignees = targetUser.createdBy ? targetUser.createdBy.split(',').filter(Boolean) : [];
      if (!currentAssignees.includes(req.requestedById)) {
        currentAssignees.push(req.requestedById);
      }
      if (!currentAssignees.includes(currentUser.id)) {
        currentAssignees.push(currentUser.id);
      }
      const newCreatedBy = currentAssignees.join(',');

      const patchRes = await fetch(`/api/users/${targetUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ createdBy: newCreatedBy }),
      });
      if (!patchRes.ok) {
        push('error', 'Failed to update user manager assignment');
        return;
      }
    } else {
      // New user requested: create the account and assign to moderator and admin
      const baseUsername = req.fullName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'user';
      let uniqueUsername = baseUsername;
      if (users.some(u => u.username.toLowerCase() === uniqueUsername.toLowerCase())) {
        uniqueUsername = `${baseUsername}${Math.floor(10 + Math.random() * 90)}`;
      }

      const createRes = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: uniqueUsername,
          password: 'Welcome@123',
          fullName: req.fullName,
          email: req.email,
          department: req.department || '',
          role: 'user',
          createdBy: `${currentUser.id},${req.requestedById}`,
        }),
      });

      if (!createRes.ok) {
        const d = await createRes.json();
        push('error', d.error ?? 'Failed to create new user account');
        return;
      }
    }

    const res = await fetch(`/api/requests/${req.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved', resolvedById: currentUser.id }),
    });

    if (res.ok) {
      const mod = users.find((u) => u.id === req.requestedById);
      push('success', `Approved! ${req.fullName} is now active on ${mod?.fullName || 'the moderator'}'s team.`);
      loadUsers();
      loadRequests();
    } else {
      push('error', 'Failed to approve request');
    }
  }

  async function handleConfirmReject(req: AccountRequest, rejectionReason: string) {
    if (!currentUser || currentUser.role !== 'admin') return;

    const res = await fetch(`/api/requests/${req.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'rejected',
        resolvedById: currentUser.id,
        rejectionReason,
      }),
    });

    if (res.ok) {
      push('info', 'Request has been rejected with feedback provided');
      loadRequests();
    } else {
      push('error', 'Failed to reject request');
    }
  }

  function handleDeleteRequest(req: AccountRequest) {
    const isOwner = req.requestedById === currentUser?.id;
    const title = req.status === 'pending' && isOwner ? 'Cancel Request' : 'Delete Request';
    const message = req.status === 'pending' && isOwner
      ? `Are you sure you want to cancel your request for ${req.fullName}?`
      : `Are you sure you want to permanently delete the request for ${req.fullName}?`;

    setConfirmState({
      title,
      message,
      confirmText: title,
      confirmStyle: 'danger',
      onConfirm: async () => {
        setConfirmState(null);
        const res = await fetch(`/api/requests/${req.id}`, { method: 'DELETE' });
        if (res.ok) {
          push('info', 'Request deleted');
          loadRequests();
        } else {
          push('error', 'Failed to delete request');
        }
      }
    });
  }

  if (!currentUser || currentUser.role === 'user') return null;

  const isAdmin     = currentUser.role === 'admin';
  const isModerator = currentUser.role === 'moderator';

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.fullName.toLowerCase().includes(q) || u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole   = filterRole === 'all' || u.role === filterRole;
    const matchAccess = isAdmin || (u.role === 'user' && u.createdBy?.includes(currentUser.id)) || u.id === currentUser.id;
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

  async function handleSingleUserAssign(userId: string, newCreatedBy: string) {
    const res = await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ createdBy: newCreatedBy }),
    });
    if (res.ok) {
      push('success', 'Manager assignment updated');
      loadUsers();
    } else {
      push('error', 'Failed to update manager assignment');
    }
  }

  async function handleBulkTeamAssign(updates: { userId: string; createdBy: string }[]) {
    if (updates.length === 0) return;
    try {
      await Promise.all(
        updates.map((up) =>
          fetch(`/api/users/${up.userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ createdBy: up.createdBy }),
          })
        )
      );
      push('success', `Updated team assignments for ${updates.length} staff member(s)`);
      loadUsers();
    } catch {
      push('error', 'Failed to update some user assignments');
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
    const defaultTempPw = 'Welcome@123';
    setConfirmState({
      title: 'Reset Password',
      message: `Are you sure you want to reset ${user.fullName}'s password? Their password will be set to the default temporary password: "${defaultTempPw}", and they will be required to change it on their next login.`,
      confirmText: 'Reset Password',
      confirmStyle: 'warning',
      onConfirm: async () => {
        setConfirmState(null);
        const res = await fetch(`/api/users/${user.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: defaultTempPw, isFirstLogin: true }),
        });
        if (res.ok) {
          push('success', `Password reset! Temporary password is: ${defaultTempPw}`);
          setResetSuccessUser({ user, password: defaultTempPw });
          loadUsers();
        } else {
          push('error', 'Failed to reset password');
        }
      }
    });
  }

  const roleCounts = {
    admin:     users.filter((u) => u.role === 'admin').length,
    moderator: users.filter((u) => u.role === 'moderator').length,
    user:      users.filter((u) => u.role === 'user').length,
  };

  const allRelevantRequests = requests;
  const pendingRequestsCount = requests.filter((r) => r.status === 'pending').length;
  const filteredRequests = requests.filter((r) => requestFilter === 'all' ? true : r.status === requestFilter);

  return (
    <>
      <div className="toast-container">{toasts.map((t) => <div key={t.id} className={`toast toast-${t.type}`}>{t.text}</div>)}</div>

      <div className="flex items-center justify-between mb-4 users-header-row">
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--neutral-900)' }}>{isAdmin ? 'User Management' : 'Users & Team'}</h2>
          <p className="text-sm text-neutral" style={{ marginTop: 2 }}>{isAdmin ? `${users.length} accounts total` : `${filtered.length} team members assigned to you`}</p>
        </div>
        <div className="flex items-center gap-2 users-header-actions">
          {activeMainTab === 'directory' && (
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
          )}
          {isAdmin && (
            <button id="create-user-btn" className="btn btn-brand" onClick={() => setModalState({ type: 'create' })}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>
              Create Account
            </button>
          )}
          {isModerator && (
            <button className="btn btn-brand" onClick={() => setIsRequestModalOpen(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>
              Ask Admin for User
            </button>
          )}
        </div>
      </div>

      {/* Top View Selector Tabs (Admin Only) */}
      {isAdmin && (
        <div className="assign-nav-tabs">
          <button
            type="button"
            className={`assign-nav-tab ${activeMainTab === 'directory' ? 'active' : ''}`}
            onClick={() => setActiveMainTab('directory')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            All Accounts ({users.length})
          </button>
          <button
            type="button"
            className={`assign-nav-tab ${activeMainTab === 'moderators' ? 'active' : ''}`}
            onClick={() => setActiveMainTab('moderators')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            Assign to Moderator(s)
            <span className="badge badge-brand" style={{ fontSize: 11, padding: '2px 8px' }}>
              {users.filter(u => u.role === 'moderator').length} Mods
            </span>
          </button>
          <button
            type="button"
            className={`assign-nav-tab ${activeMainTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveMainTab('requests')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            User Requests
            {pendingRequestsCount > 0 ? (
              <span className="badge" style={{ fontSize: 11, padding: '2px 8px', background: 'var(--warning-light)', color: 'var(--warning-dark)', fontWeight: 700 }}>
                {pendingRequestsCount} Pending
              </span>
            ) : (
              <span className="badge" style={{ fontSize: 11, padding: '2px 8px', background: 'var(--neutral-100)', color: 'var(--neutral-500)' }}>
                {allRelevantRequests.length}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Top View Selector Tabs (Moderator Only) */}
      {isModerator && (
        <div className="assign-nav-tabs">
          <button
            type="button"
            className={`assign-nav-tab ${activeMainTab === 'directory' ? 'active' : ''}`}
            onClick={() => setActiveMainTab('directory')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            My Team ({filtered.length})
          </button>
          <button
            type="button"
            className={`assign-nav-tab ${activeMainTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveMainTab('requests')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>
            Requests to Admin
            {pendingRequestsCount > 0 ? (
              <span className="badge" style={{ fontSize: 11, padding: '2px 8px', background: 'var(--warning-light)', color: 'var(--warning-dark)', fontWeight: 700 }}>
                {pendingRequestsCount} Pending
              </span>
            ) : allRelevantRequests.length > 0 ? (
              <span className="badge" style={{ fontSize: 11, padding: '2px 8px', background: 'var(--neutral-100)', color: 'var(--neutral-500)' }}>
                {allRelevantRequests.length}
              </span>
            ) : null}
          </button>
        </div>
      )}

      {/* ── SECTION 1: DIRECTORY VIEW ── */}
      {activeMainTab === 'directory' && (
        <>
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
                  const statusInfo = isOnline ? getStatusDisplay(u.id) : null;
                  return (
                  <div key={`${keyPrefix}-${u.id}`} className="mobile-icon-card">
                    <div className="mobile-icon-card-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ position: 'relative' }}>
                          <div className="sidebar-avatar" style={{ width: 36, height: 36, fontSize: 13 }}>
                            {u.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                          {isOnline && statusInfo && (
                            <span className={`status-avatar-badge ${statusInfo.dotClass}`} title={statusInfo.label} />
                          )}
                        </div>
                        <div>
                          <div className="mobile-icon-card-title">{u.fullName}</div>
                          <div style={{ fontSize: 12, color: 'var(--neutral-400)' }}>@{u.username}</div>
                        </div>
                      </div>
                      {/* Status as Icon */}
                      {isOnline && statusInfo ? (
                        <span className="icon-chip" title={statusInfo.label} style={{ borderColor: statusInfo.borderColor, background: statusInfo.bg, color: statusInfo.color, fontWeight: 600 }}>
                          <span className={`status-indicator-dot ${statusInfo.dotClass}`} style={{ width: 7, height: 7 }} />
                          {statusInfo.label}
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
                      {u.department && (
                        <span className="icon-chip" title="Department">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                          </svg>
                          {u.department}
                        </span>
                      )}

                      {/* Address Icon */}
                      {u.address && (
                        <span className="icon-chip" title="Address">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
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
                      {(isAdmin || (isModerator && (u.role === 'user' || u.id === currentUser.id))) && (
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
                                {filtered.map((u) => {
                                  const isOnline = onlineUserIds.has(u.id);
                                  const statusInfo = isOnline ? getStatusDisplay(u.id) : null;
                                  return (
                                  <tr key={u.id}>
                                    <td>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ position: 'relative' }}>
                                          <div className="sidebar-avatar" style={{ width: 34, height: 34, fontSize: 12 }}>
                                            {u.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                                          </div>
                                          {isOnline && statusInfo && (
                                            <span className={`status-avatar-badge ${statusInfo.dotClass}`} title={statusInfo.label} />
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
                                      {isOnline && statusInfo ? (
                                        <span className="badge" style={{ fontWeight: 700, gap: 5, background: statusInfo.bg, color: statusInfo.color, border: `1px solid ${statusInfo.borderColor}` }}>
                                          <span className={`status-indicator-dot ${statusInfo.dotClass}`} style={{ width: 6, height: 6 }} />
                                          {statusInfo.label}
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
                                        {(isAdmin || (isModerator && (u.role === 'user' || u.id === currentUser.id))) && (
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
                                );
                              })}
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
        </>
      )}

      {/* ── SECTION 2: DEDICATED ASSIGN TO MODERATOR(S) SECTION ── */}
      {isAdmin && activeMainTab === 'moderators' && (
        <div className="moderator-assignment-hub">
          {/* Header Card */}
          <div className="card moderator-hub-header" style={{ padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--neutral-900)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🛡️</span> Moderator Supervision & Manager Delegations
              </h3>
              <p style={{ fontSize: 13, color: 'var(--neutral-500)', marginTop: 4, maxWidth: 640 }}>
                Organize and assign staff members to moderators. Assigned moderators can view presence, delegate tasks, and oversee attendance and workflow for their designated team members.
              </p>
            </div>
            <div className="moderator-hub-badges" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)', background: 'var(--brand-50)', border: '1px solid var(--brand-200)', fontSize: 12.5, fontWeight: 600, color: 'var(--brand-700)' }}>
                ⚡ {users.filter(u => u.role === 'moderator').length} Active Moderators
              </div>
              <div style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)', background: 'var(--neutral-100)', border: '1px solid var(--neutral-200)', fontSize: 12.5, fontWeight: 600, color: 'var(--neutral-700)' }}>
                👥 {users.filter(u => u.role === 'user').length} Total Staff
              </div>
            </div>
          </div>

          {/* Manager Team Cards */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--neutral-800)' }}>
                Managers & Delegated Teams
              </h4>
              <span style={{ fontSize: 12, color: 'var(--neutral-500)' }}>
                Click &ldquo;+ Manage Team&rdquo; on any manager to configure their supervised staff
              </span>
            </div>

            <div className="mod-team-grid">
              {/* Primary Admin Card */}
              {(() => {
                const adminUser = users.find(u => u.id === currentUser.id);
                const adminAssignedUsers = users.filter(u => u.role === 'user' && (u.createdBy?.includes(currentUser.id) || !u.createdBy));
                return (
                  <div className="mod-team-card">
                    <div className="mod-team-header">
                      <div className="mod-team-info">
                        <div className="mod-card-avatar" style={{ width: 38, height: 38, fontSize: 13, background: 'linear-gradient(135deg, #6366f1, #4338ca)' }}>
                          {getInitials(adminUser?.fullName || 'Admin')}
                          <span className="presence-pulse-dot-sm" style={{ position: 'absolute', bottom: -1, right: -1 }} title="Online Now" />
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--neutral-900)' }}>{adminUser?.fullName || 'Primary Administrator'}</div>
                          <div style={{ fontSize: 11.5, color: 'var(--neutral-500)' }}>@{adminUser?.username || 'admin'} • {adminUser?.department || 'IT'}</div>
                        </div>
                      </div>
                      <span className="mod-card-role-tag mod-card-role-admin">👑 Admin (You)</span>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: 'var(--neutral-600)', marginBottom: 6 }}>
                        <span>Directly Supervised Staff</span>
                        <span>{adminAssignedUsers.length} staff</span>
                      </div>
                      <div className="mod-team-members-box">
                        {adminAssignedUsers.length === 0 ? (
                          <span style={{ fontSize: 12, color: 'var(--neutral-400)', margin: 'auto' }}>No staff directly assigned</span>
                        ) : (
                          adminAssignedUsers.map(u => (
                            <span key={u.id} className="team-chip" title={u.email}>
                              <span className="team-chip-avatar">{getInitials(u.fullName)}</span>
                              <span>{u.fullName}</span>
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={() => adminUser && setAssigningModerator(adminUser)}
                    >
                      + Manage Supervised Staff
                    </button>
                  </div>
                );
              })()}

              {/* Each Moderator Card */}
              {users.filter(u => u.role === 'moderator').map((mod, idx) => {
                const modAssignedUsers = users.filter(u => u.role === 'user' && u.createdBy?.includes(mod.id));
                const isOnline = onlineUserIds.has(mod.id);
                return (
                  <div key={mod.id} className="mod-team-card">
                    <div className="mod-team-header">
                      <div className="mod-team-info">
                        <div className="mod-card-avatar" style={{ width: 38, height: 38, fontSize: 13, background: MOD_GRADIENTS[idx % MOD_GRADIENTS.length] }}>
                          {getInitials(mod.fullName)}
                          {isOnline && (
                            <span className="presence-pulse-dot-sm" style={{ position: 'absolute', bottom: -1, right: -1 }} title="Online Now" />
                          )}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--neutral-900)' }}>{mod.fullName}</div>
                          <div style={{ fontSize: 11.5, color: 'var(--neutral-500)' }}>@{mod.username} • {mod.department || 'General'}</div>
                        </div>
                      </div>
                      <span className="mod-card-role-tag mod-card-role-mod">⚡ Moderator</span>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: 'var(--neutral-600)', marginBottom: 6 }}>
                        <span>Assigned Team Members</span>
                        <span>{modAssignedUsers.length} staff</span>
                      </div>
                      <div className="mod-team-members-box">
                        {modAssignedUsers.length === 0 ? (
                          <span style={{ fontSize: 12, color: 'var(--neutral-400)', margin: 'auto' }}>No staff assigned to this moderator yet</span>
                        ) : (
                          modAssignedUsers.map(u => (
                            <span key={u.id} className="team-chip" title={u.email}>
                              <span className="team-chip-avatar">{getInitials(u.fullName)}</span>
                              <span>{u.fullName}</span>
                              <button
                                type="button"
                                className="team-chip-remove"
                                title={`Unassign ${u.fullName}`}
                                onClick={() => {
                                  const cur = u.createdBy ? u.createdBy.split(',').filter(Boolean) : [currentUser.id];
                                  const next = cur.filter(id => id !== mod.id);
                                  if (next.length === 0) next.push(currentUser.id);
                                  handleSingleUserAssign(u.id, next.join(','));
                                }}
                              >
                                ×
                              </button>
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 6, width: '100%' }}>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ flex: 1, justifyContent: 'center', gap: 5 }}
                        onClick={() => setAssigningModerator(mod)}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        Manage Team
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ color: 'var(--warning)', borderColor: 'var(--warning)', padding: '5px 9px', gap: 4 }}
                        title={`Reset ${mod.fullName}'s password`}
                        onClick={() => handleResetPassword(mod)}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
                        Reset PW
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ padding: '5px 9px' }}
                        title={`Edit ${mod.fullName}`}
                        onClick={() => setModalState({ type: 'edit', user: mod })}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Staff Allocation Matrix Table */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--neutral-800)' }}>
                Staff Oversight Matrix
              </h4>
              <span style={{ fontSize: 12, color: 'var(--neutral-500)' }}>
                {users.filter(u => u.role === 'user').length} standard accounts
              </span>
            </div>

            <div className="table-wrap" style={{ background: 'var(--neutral-0)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--neutral-200)', overflow: 'hidden' }}>
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Username</th>
                    <th>Department</th>
                    <th>Assigned Managers</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter(u => u.role === 'user').map(u => {
                    const managerIds = u.createdBy ? u.createdBy.split(',').filter(Boolean) : [currentUser.id];
                    const managerUsers = managerIds.map(id => users.find(x => x.id === id)).filter(Boolean) as SafeUser[];
                    return (
                      <tr key={u.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div className="sidebar-avatar" style={{ width: 32, height: 32, fontSize: 11 }}>
                              {getInitials(u.fullName)}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--neutral-900)', fontSize: 13.5 }}>{u.fullName}</div>
                              <div style={{ fontSize: 12, color: 'var(--neutral-400)' }}>{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontFamily: 'monospace', fontSize: 12.5 }}>@{u.username}</td>
                        <td style={{ fontSize: 13, color: 'var(--neutral-600)' }}>{u.department || '—'}</td>
                        <td>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                            {managerUsers.map(m => (
                              <span
                                key={m.id}
                                className={`badge ${m.role === 'admin' ? 'badge-admin' : 'badge-moderator'}`}
                                style={{ fontSize: 11, padding: '2px 8px' }}
                              >
                                {m.id === currentUser.id ? '👑 Admin (You)' : `⚡ ${m.fullName}`}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => setAssigningUser(u)}
                            style={{ fontSize: 12, padding: '5px 10px', gap: 4 }}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                            Assign Managers
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION 3: MODERATOR USER REQUESTS & ADMIN APPROVAL ── */}
      {activeMainTab === 'requests' && (
        <div className="moderator-requests-hub">
          {/* Top Info Banner for Moderator */}
          {isModerator && (
            <div className="user-request-banner">
              <div className="user-request-banner-text">
                <h4 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>🙋</span> Request Staff Members from Admin
                </h4>
                <p>
                  Need additional personnel for your team? Ask the Admin to assign existing staff members or request new accounts. Once approved by an Admin, the users will automatically appear in your team and task delegations.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-brand"
                style={{ flexShrink: 0 }}
                onClick={() => setIsRequestModalOpen(true)}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Ask Admin for User
              </button>
            </div>
          )}

          {/* Top Header Card for Admin */}
          {isAdmin && (
            <div className="card" style={{ padding: '20px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--neutral-900)', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
                  <span>📬</span> Moderator User Allocation Requests
                </h3>
                <p style={{ fontSize: 13, color: 'var(--neutral-500)', marginTop: 4, margin: '4px 0 0 0', maxWidth: 640 }}>
                  Review requests from moderators asking for staff members to be assigned to their teams. When you click <strong>Approve & Assign</strong>, the user will instantly be assigned to the moderator.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)', background: pendingRequestsCount > 0 ? 'var(--warning-light)' : 'var(--neutral-100)', border: `1px solid ${pendingRequestsCount > 0 ? 'var(--warning)' : 'var(--neutral-200)'}`, fontSize: 12.5, fontWeight: 600, color: pendingRequestsCount > 0 ? 'var(--warning-dark)' : 'var(--neutral-600)' }}>
                  ⏳ {pendingRequestsCount} Pending Review
                </div>
                <div style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)', background: 'var(--neutral-100)', border: '1px solid var(--neutral-200)', fontSize: 12.5, fontWeight: 600, color: 'var(--neutral-700)' }}>
                  📋 {allRelevantRequests.length} Total Requests
                </div>
              </div>
            </div>
          )}

          {/* Filter Bar */}
          <div className="filter-row" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`task-filter-tab ${requestFilter === 'all' ? 'active' : ''}`}
                onClick={() => setRequestFilter('all')}
              >
                All ({allRelevantRequests.length})
              </button>
              <button
                type="button"
                className={`task-filter-tab ${requestFilter === 'pending' ? 'active' : ''}`}
                onClick={() => setRequestFilter('pending')}
              >
                ⏳ Pending ({allRelevantRequests.filter(r => r.status === 'pending').length})
              </button>
              <button
                type="button"
                className={`task-filter-tab ${requestFilter === 'approved' ? 'active' : ''}`}
                onClick={() => setRequestFilter('approved')}
              >
                ✅ Approved ({allRelevantRequests.filter(r => r.status === 'approved').length})
              </button>
              <button
                type="button"
                className={`task-filter-tab ${requestFilter === 'rejected' ? 'active' : ''}`}
                onClick={() => setRequestFilter('rejected')}
              >
                ❌ Rejected ({allRelevantRequests.filter(r => r.status === 'rejected').length})
              </button>
            </div>
          </div>

          {/* Requests List */}
          {filteredRequests.length === 0 ? (
            <div className="card" style={{ padding: '48px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--neutral-800)', margin: '0 0 6px 0' }}>
                No requests found
              </h3>
              <p style={{ fontSize: 13, color: 'var(--neutral-400)', maxWidth: 420, margin: '0 auto 16px auto' }}>
                {isModerator
                  ? "You have not submitted any user requests matching this filter. Click below to ask Admin for a team member."
                  : "No moderator user allocation requests match the selected status filter."}
              </p>
              {isModerator && (
                <button
                  type="button"
                  className="btn btn-brand"
                  onClick={() => setIsRequestModalOpen(true)}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Ask Admin for User
                </button>
              )}
            </div>
          ) : (
            <div className="user-requests-container">
              {filteredRequests.map((req) => {
                const requesterMod = users.find(u => u.id === req.requestedById);
                const targetUserId = req.requestedRole.startsWith('staff_assignment:')
                  ? req.requestedRole.replace('staff_assignment:', '')
                  : null;
                const targetUser = targetUserId
                  ? users.find(u => u.id === targetUserId)
                  : users.find(u => u.email.toLowerCase() === req.email.toLowerCase() || u.fullName.toLowerCase() === req.fullName.toLowerCase());
                const isAlreadyAssigned = targetUser && requesterMod && targetUser.createdBy?.includes(requesterMod.id);

                return (
                  <div key={req.id} className="user-request-card">
                    <div className="user-request-header">
                      <div className="user-request-pair">
                        {/* Moderator (Requester) */}
                        <div className="user-request-person">
                          <div className="task-assignee-avatar role-moderator" style={{ width: 34, height: 34, fontSize: 12 }}>
                            {getInitials(requesterMod?.fullName || 'Moderator')}
                          </div>
                          <div>
                            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--neutral-900)' }}>
                              {requesterMod?.fullName || 'Moderator'}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--neutral-400)' }}>
                              @{requesterMod?.username || 'mod'} · <span className="badge badge-moderator" style={{ fontSize: 10, padding: '1px 5px' }}>⚡ Moderator</span>
                            </div>
                          </div>
                        </div>

                        {/* Arrow */}
                        <div className="user-request-arrow" title="Requests user assignment to team">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                        </div>

                        {/* Target User */}
                        <div className="user-request-person">
                          <div className="task-assignee-avatar role-user" style={{ width: 34, height: 34, fontSize: 12 }}>
                            {getInitials(req.fullName)}
                          </div>
                          <div>
                            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--neutral-900)' }}>
                              {req.fullName}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--neutral-400)' }}>
                              {req.email} {req.department ? `· ${req.department}` : ''}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div>
                        {req.status === 'pending' ? (
                          <span className="badge badge-warning" style={{ fontSize: 12, padding: '4px 10px', fontWeight: 600 }}>
                            ⏳ Pending Admin Review
                          </span>
                        ) : req.status === 'approved' ? (
                          <span className="badge badge-success" style={{ fontSize: 12, padding: '4px 10px', fontWeight: 600 }}>
                            ✅ Approved & Assigned
                          </span>
                        ) : (
                          <span className="badge badge-error" style={{ fontSize: 12, padding: '4px 10px', fontWeight: 600 }}>
                            ❌ Rejected
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Reason / Justification */}
                    <div className="user-request-reason-box">
                      <strong style={{ color: 'var(--neutral-800)', fontSize: 12 }}>Justification:</strong> &ldquo;{req.reason}&rdquo;
                    </div>

                    {/* Rejection Feedback Note */}
                    {req.status === 'rejected' && (
                      <div style={{
                        background: 'rgba(239, 68, 68, 0.08)',
                        borderLeft: '3px solid var(--error, #ef4444)',
                        padding: '10px 14px',
                        borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                        fontSize: 12.5,
                        color: 'var(--error-dark, #b91c1c)',
                        marginBottom: 12,
                        lineHeight: 1.5,
                      }}>
                        <strong style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                          <span>❌</span> Rejection Reason from Admin:
                        </strong>
                        &ldquo;{req.rejectionReason || 'No specific feedback was provided.'}&rdquo;
                      </div>
                    )}

                    {/* Footer */}
                    <div className="user-request-footer">
                      <div className="user-request-meta">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <span>Requested on {new Date(req.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        {req.resolvedAt && (
                          <span style={{ marginLeft: 8 }}>· Resolved on {new Date(req.resolvedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="user-request-actions" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        {isAdmin && req.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              onClick={() => setRejectingRequest(req)}
                              style={{ color: 'var(--error, #ef4444)' }}
                            >
                              Reject
                            </button>
                            <button
                              type="button"
                              className="btn btn-success btn-sm"
                              onClick={() => handleApproveUserRequest(req)}
                              style={{ gap: 6 }}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                              Approve & Assign to Moderator
                            </button>
                          </>
                        )}

                        {/* Every kind of request can be deleted by moderator and admin of their own */}
                        {(isAdmin || req.requestedById === currentUser.id) && (
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => handleDeleteRequest(req)}
                            style={{ color: 'var(--error, #ef4444)', borderColor: 'rgba(239, 68, 68, 0.3)', gap: 5 }}
                            title={req.status === 'pending' && req.requestedById === currentUser.id ? 'Cancel Request' : 'Delete Request'}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                            </svg>
                            {req.status === 'pending' && req.requestedById === currentUser.id ? 'Cancel Request' : 'Delete'}
                          </button>
                        )}

                        {req.status === 'approved' && isAlreadyAssigned && (
                          <span style={{ fontSize: 12, color: 'var(--success-dark)', fontWeight: 600 }}>
                            ⚡ Member is currently active on team
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Account Create/Edit Modal */}
      {modalState && (
        <UserModal
          user={modalState.type === 'edit' ? modalState.user : null}
          canCreateModerator={isAdmin}
          users={users}
          currentUserId={currentUser.id}
          isAdmin={isAdmin}
          onlineUserIds={onlineUserIds}
          onClose={() => setModalState(null)}
          onSave={handleSave}
        />
      )}

      {/* Standalone User Manager Assignment Modal */}
      {assigningUser && (
        <AssignUserManagersModal
          user={assigningUser}
          users={users}
          currentUserId={currentUser.id}
          onlineUserIds={onlineUserIds}
          onClose={() => setAssigningUser(null)}
          onSave={handleSingleUserAssign}
        />
      )}

      {/* Standalone Moderator Team Assignment Modal */}
      {assigningModerator && (
        <AssignModeratorTeamModal
          moderator={assigningModerator}
          users={users}
          currentUserId={currentUser.id}
          onlineUserIds={onlineUserIds}
          onClose={() => setAssigningModerator(null)}
          onSave={handleBulkTeamAssign}
        />
      )}

      {/* Moderator Request User Modal */}
      {isRequestModalOpen && (
        <ModeratorRequestUserModal
          currentUser={currentUser}
          users={users}
          onClose={() => setIsRequestModalOpen(false)}
          onSuccess={() => {
            push('success', 'Request sent to Admin! Admin will review and assign user to your team.');
            loadRequests();
            setActiveMainTab('requests');
          }}
        />
      )}

      {/* Reject Request Feedback Modal */}
      {rejectingRequest && (
        <RejectRequestModal
          req={rejectingRequest}
          requesterName={users.find(u => u.id === rejectingRequest.requestedById)?.fullName}
          onClose={() => setRejectingRequest(null)}
          onConfirm={async (reason) => {
            await handleConfirmReject(rejectingRequest, reason);
            setRejectingRequest(null);
          }}
        />
      )}

      {/* Confirmation Modal */}
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

      {/* Password Reset Success & Credentials Info Modal */}
      {resetSuccessUser && (
        <div className="modal-backdrop" onClick={() => setResetSuccessUser(null)} style={{ zIndex: 9999 }}>
          <div className="modal task-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460 }}>
            <div className="task-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="task-modal-icon-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success, #10b981)' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div>
                  <h3 className="modal-title" style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Password Reset Successfully</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: 13, color: 'var(--neutral-400)' }}>Account credentials updated</p>
                </div>
              </div>
              <button className="btn-close" onClick={() => setResetSuccessUser(null)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="modal-body" style={{ padding: '20px 24px' }}>
              <p style={{ fontSize: 13.5, color: 'var(--neutral-700)', marginBottom: 16, lineHeight: 1.5 }}>
                The password for <strong>{resetSuccessUser.user.fullName}</strong> has been reset. When they log in with these credentials, they will be required to choose a new password.
              </p>

              <div style={{ background: 'var(--neutral-50)', border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius-md)', padding: '14px 16px', marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, fontSize: 13 }}>
                  <span style={{ color: 'var(--neutral-500)' }}>Username:</span>
                  <code style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--neutral-900)', fontSize: 13.5, background: 'var(--neutral-200)', padding: '2px 8px', borderRadius: 4 }}>
                    {resetSuccessUser.user.username}
                  </code>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                  <span style={{ color: 'var(--neutral-500)' }}>Temporary Password:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <code style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--brand-700)', fontSize: 13.5, background: 'var(--brand-50, rgba(99,102,241,0.1))', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--brand-200, rgba(99,102,241,0.2))' }}>
                      {resetSuccessUser.password}
                    </code>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ padding: '3px 8px', fontSize: 11, gap: 4 }}
                      onClick={() => {
                        navigator.clipboard.writeText(resetSuccessUser.password);
                        push('info', 'Password copied to clipboard!');
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: 'var(--radius-md)', padding: '12px 14px', fontSize: 12.5, color: 'var(--neutral-700)', lineHeight: 1.45 }}>
                💡 <strong>Testing note:</strong> Remember to <strong>log out</strong> from your current account (or open an <em>Incognito / Private tab</em>) before testing login with this account so your active session does not conflict!
              </div>
            </div>
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', padding: '14px 24px', borderTop: '1px solid var(--neutral-200)' }}>
              <button className="btn btn-brand" onClick={() => setResetSuccessUser(null)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
