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

interface AccountRequest {
  id: string; requestedById: string; requestedRole: string;
  fullName: string; email: string; department: string; reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string; resolvedAt?: string | null; resolvedById?: string | null;
}

function NewRequestModal({ currentUserId, onClose, onSave }: {
  currentUserId: string; onClose: () => void;
  onSave: (data: { fullName: string; email: string; department: string; reason: string }) => void;
}) {
  const [form, setForm] = useState({ fullName: '', email: '', department: '', reason: '' });
  const setF = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Request New Account</h3>
          <button className="btn-close" onClick={onClose}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
        <div className="modal-body">
          <div style={{ background: 'var(--info-light)', border: '1px solid rgba(59,130,246,.2)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 13, color: 'var(--info-dark)', marginBottom: 18 }}>
            This request will be sent to an Admin for approval.
          </div>
          <div className="field-row">
            <div className="field"><label className="label">Full Name *</label><input className="input" value={form.fullName} onChange={(e) => setF('fullName', e.target.value)} placeholder="New user's full name" /></div>
            <div className="field"><label className="label">Email *</label><input className="input" type="email" value={form.email} onChange={(e) => setF('email', e.target.value)} placeholder="user@company.com" /></div>
          </div>
          <div className="field"><label className="label">Department</label><input className="input" value={form.department} onChange={(e) => setF('department', e.target.value)} placeholder="Engineering, Sales…" /></div>
          <div className="field"><label className="label">Reason / Justification *</label><textarea className="textarea" value={form.reason} onChange={(e) => setF('reason', e.target.value)} rows={3} placeholder="Why does this person need an account?" /></div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-brand" onClick={() => { if (form.fullName.trim() && form.email.trim() && form.reason.trim()) onSave(form); }}>Submit Request</button>
        </div>
      </div>
    </div>
  );
}

function ApproveModal({ req, onClose, onApprove }: {
  req: AccountRequest; onClose: () => void;
  onApprove: (username: string, tempPassword: string) => void;
}) {
  const [username, setUsername] = useState(req.fullName.toLowerCase().replace(/\s+/g, '.'));
  const [password, setPassword] = useState('Welcome@123');
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Approve & Create Account</h3>
          <button className="btn-close" onClick={onClose}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
        <div className="modal-body">
          <div style={{ background: 'var(--neutral-50)', border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--neutral-900)', marginBottom: 4 }}>{req.fullName}</div>
            <div style={{ fontSize: 12, color: 'var(--neutral-500)' }}>{req.email} · {req.department || 'No dept'}</div>
            {req.reason && <div style={{ fontSize: 12, color: 'var(--neutral-600)', marginTop: 8, fontStyle: 'italic' }}>"{req.reason}"</div>}
          </div>
          <div className="field"><label className="label">Assign Username *</label><input className="input" value={username} onChange={(e) => setUsername(e.target.value)} /></div>
          <div className="field"><label className="label">Temporary Password *</label><input className="input" type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
            <p style={{ fontSize: 12, color: 'var(--neutral-400)', marginTop: 4 }}>User must change on first login.</p></div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-success" onClick={() => { if (username.trim() && password.trim()) onApprove(username.trim(), password); }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Approve & Create
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RequestsPage() {
  const { currentUser } = useAuth();
  const { toasts, push } = useToast();
  const [requests, setRequests] = useState<AccountRequest[]>([]);
  const [users, setUsers]       = useState<SafeUser[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [modalState, setModalState] = useState<'new' | { type: 'approve'; req: AccountRequest } | null>(null);

  const loadData = useCallback(() => {
    if (!currentUser) return;
    const url = currentUser.role === 'moderator'
      ? `/api/requests?requestedById=${currentUser.id}`
      : '/api/requests';
    fetch(url).then((r) => r.json()).then(setRequests).catch(() => {});
    fetch('/api/users').then((r) => r.json()).then(setUsers).catch(() => {});
  }, [currentUser]);

  useEffect(() => { loadData(); }, [loadData]);

  if (!currentUser || currentUser.role === 'user') return null;

  const isAdmin = currentUser.role === 'admin';
  const getUserName = (id: string | null | undefined) => id ? users.find((u) => u.id === id)?.fullName ?? '—' : '—';

  const filtered = requests.filter((r) => filterStatus === 'all' || r.status === filterStatus);
  const counts = {
    pending:  requests.filter((r) => r.status === 'pending').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
  };

  async function handleSubmitRequest(data: { fullName: string; email: string; department: string; reason: string }) {
    const res = await fetch('/api/requests', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, requestedById: currentUser!.id }),
    });
    if (res.ok) { push('success', 'Request submitted to Admin'); loadData(); setModalState(null); }
    else push('error', 'Failed to submit request');
  }

  async function handleApprove(req: AccountRequest, username: string, tempPassword: string) {
    // 1. Create the user account
    const createRes = await fetch('/api/users', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password: tempPassword, fullName: req.fullName, email: req.email, department: req.department, role: 'user', createdBy: req.requestedById }),
    });
    if (!createRes.ok) {
      const d = await createRes.json();
      push('error', d.error ?? 'Failed to create account');
      return;
    }
    // 2. Mark request as approved
    await fetch(`/api/requests/${req.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved', resolvedById: currentUser!.id }),
    });
    push('success', `Account created for ${req.fullName}`);
    loadData();
    setModalState(null);
  }

  async function handleReject(req: AccountRequest) {
    if (!confirm(`Reject account request for ${req.fullName}?`)) return;
    await fetch(`/api/requests/${req.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'rejected', resolvedById: currentUser!.id }),
    });
    push('info', 'Request rejected');
    loadData();
  }

  async function handleDelete(req: AccountRequest) {
    if (!confirm(`Are you sure you want to delete the account request for ${req.fullName}?`)) return;
    const res = await fetch(`/api/requests/${req.id}`, { method: 'DELETE' });
    if (res.ok) {
      push('info', 'Request deleted');
      loadData();
    } else {
      push('error', 'Failed to delete request');
    }
  }

  const statusIcon = (s: AccountRequest['status']) => {
    if (s === 'pending')  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
    if (s === 'approved') return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>;
    return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
  };

  return (
    <>
      <div className="toast-container">{toasts.map((t) => <div key={t.id} className={`toast toast-${t.type}`}>{t.text}</div>)}</div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--neutral-900)' }}>Account Requests</h2>
          <p className="text-sm text-neutral" style={{ marginTop: 2 }}>
            {currentUser.role === 'moderator' ? 'Submit and track your account creation requests' : 'Review and action pending account requests'}
          </p>
        </div>
        {currentUser.role === 'moderator' && (
          <button className="btn btn-brand" onClick={() => setModalState('new')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Request
          </button>
        )}
      </div>

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card yellow"><div className="stat-content"><div className="stat-label">Pending</div><div className="stat-value">{counts.pending}</div></div><div className="stat-icon-wrap yellow"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div></div>
        <div className="stat-card green"><div className="stat-content"><div className="stat-label">Approved</div><div className="stat-value">{counts.approved}</div></div><div className="stat-icon-wrap green"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg></div></div>
        <div className="stat-card red"><div className="stat-content"><div className="stat-label">Rejected</div><div className="stat-value">{counts.rejected}</div></div><div className="stat-icon-wrap red"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></div></div>
      </div>

      <div className="filter-row">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((s) => (
          <button key={s} className={`btn ${filterStatus === s ? 'btn-brand' : 'btn-outline'} btn-sm`} onClick={() => setFilterStatus(s)}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
            {s === 'pending' && counts.pending > 0 && (
              <span style={{ background: 'white', color: 'var(--brand-700)', borderRadius: 10, padding: '0 6px', fontSize: 11, fontWeight: 700, marginLeft: 2 }}>{counts.pending}</span>
            )}
          </button>
        ))}
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">📬</div><h3>No requests</h3><p>{currentUser.role === 'moderator' ? 'Click "New Request" to submit one.' : 'No account requests to review.'}</p></div>
        ) : (
          <div className="table-wrap">
            <table style={{ display: 'block', overflowX: 'auto', whiteSpace: 'nowrap', width: '100%' }}>
              <thead><tr>
                <th>Requested For</th>
                {isAdmin && <th>Requested By</th>}
                <th>Department</th><th>Reason</th><th>Status</th><th>Date</th>
                {isAdmin && <th>Actions</th>}
              </tr></thead>
              <tbody>
                {filtered.map((req) => (
                  <tr key={req.id}>
                    <td><div style={{ fontWeight: 600, color: 'var(--neutral-900)' }}>{req.fullName}</div><div style={{ fontSize: 12, color: 'var(--neutral-400)' }}>{req.email}</div></td>
                    {isAdmin && <td style={{ fontSize: 13 }}>{getUserName(req.requestedById)}</td>}
                    <td style={{ fontSize: 13, color: 'var(--neutral-600)' }}>{req.department || '—'}</td>
                    <td><div style={{ fontSize: 13, color: 'var(--neutral-600)', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.reason || '—'}</div></td>
                    <td><span className={`badge badge-${req.status}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>{statusIcon(req.status)}{req.status}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--neutral-400)' }}>
                      <div>{new Date(req.createdAt).toLocaleDateString()} {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      {req.resolvedAt && <div style={{ marginTop: 2 }}>Resolved: {new Date(req.resolvedAt).toLocaleDateString()} {new Date(req.resolvedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>}
                    </td>
                    {isAdmin && (
                      <td>
                        {req.status === 'pending' ? (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="btn btn-success btn-sm" onClick={() => setModalState({ type: 'approve', req })}>Approve</button>
                            <button className="btn btn-warning btn-sm" style={{ background: 'var(--warning)', color: 'white', border: 'none' }} onClick={() => handleReject(req)}>Reject</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(req)}>Delete</button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 12, color: 'var(--neutral-400)' }}>by {getUserName(req.resolvedById)}</span>
                            <button className="btn btn-outline btn-sm" style={{ borderColor: 'var(--error)', color: 'var(--error)' }} onClick={() => handleDelete(req)}>Delete</button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalState === 'new' && (
        <NewRequestModal currentUserId={currentUser.id} onClose={() => setModalState(null)} onSave={handleSubmitRequest} />
      )}
      {modalState !== null && typeof modalState === 'object' && modalState.type === 'approve' && (
        <ApproveModal req={modalState.req} onClose={() => setModalState(null)}
          onApprove={(username, pw) => handleApprove(modalState.req, username, pw)} />
      )}
    </>
  );
}
