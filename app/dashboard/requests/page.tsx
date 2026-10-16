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
  rejectionReason?: string | null;
  createdAt: string; resolvedAt?: string | null; resolvedById?: string | null;
}

const REJECT_REASON_PRESETS = [
  'Incomplete applicant details or invalid company email address',
  'Position or department headcount quota has been reached',
  'Requires direct authorization from department head before provisioning',
  'Duplicate request — account already exists or in progress',
  'Account role or permission level requested is not authorized',
];

function RejectAccountRequestModal({
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
      setError('Please provide a reason so the requester knows why their request was rejected.');
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
                Reject Account Request
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: 13, color: 'var(--neutral-400)' }}>
                Provide feedback explaining why this account cannot be created
              </p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: '20px 24px' }}>
            <div style={{ background: 'var(--neutral-50)', border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius-md)', padding: '12px 14px', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--neutral-900)' }}>
                Applicant: <span style={{ color: 'var(--brand-700)' }}>{req.fullName}</span> ({req.email})
              </div>
              <div style={{ fontSize: 12, color: 'var(--neutral-500)', marginTop: 2 }}>
                Requested by: {requesterName || 'Moderator'} {req.department ? `· ${req.department}` : ''}
              </div>
              {req.reason && (
                <div style={{ fontSize: 12, color: 'var(--neutral-600)', marginTop: 6, fontStyle: 'italic', borderTop: '1px dashed var(--neutral-200)', paddingTop: 6 }}>
                  Requested Justification: &ldquo;{req.reason}&rdquo;
                </div>
              )}
            </div>

            <div className="field">
              <label className="label">
                Quick Reason Suggestions <span style={{ fontSize: 11, color: 'var(--neutral-400)', fontWeight: 400 }}>(click to auto-fill)</span>
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
                Rejection Reason / Feedback <span style={{ color: 'var(--error, #ef4444)' }}>*</span>
              </label>
              <textarea
                className="textarea"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Type or select a reason for rejecting this request..."
                style={error ? { borderColor: 'var(--error, #ef4444)' } : undefined}
              />
              <span style={{ fontSize: 11.5, color: 'var(--neutral-400)', marginTop: 4, display: 'block' }}>
                This reason will be visible to the requester on their requests list.
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

import { ConfirmModal } from '../../components/ConfirmModal';

export default function RequestsPage() {
  const { currentUser } = useAuth();
  const { toasts, push } = useToast();
  const [requests, setRequests] = useState<AccountRequest[]>([]);
  const [users, setUsers]       = useState<SafeUser[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [modalState, setModalState] = useState<'new' | { type: 'approve'; req: AccountRequest } | null>(null);
  const [rejectingRequest, setRejectingRequest] = useState<AccountRequest | null>(null);
  const [confirmState, setConfirmState] = useState<{ title: string; message: string; onConfirm: () => void; confirmText?: string; confirmStyle?: 'danger'|'brand'|'warning' } | null>(null);

  const loadData = useCallback(() => {
    if (!currentUser) return;
    const url = currentUser.role === 'moderator'
      ? `/api/requests?requestedById=${currentUser.id}`
      : '/api/requests';
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRequests((prev) => (JSON.stringify(prev) === JSON.stringify(data) ? prev : data));
        }
      })
      .catch(() => {});
    fetch('/api/users')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers((prev) => (JSON.stringify(prev) === JSON.stringify(data) ? prev : data));
        }
      })
      .catch(() => {});
  }, [currentUser]);

  useEffect(() => {
    loadData();

    // Polling every 20s with equality guards to prevent needless re-renders
    const interval = setInterval(loadData, 20000);
    return () => clearInterval(interval);
  }, [loadData]);

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

  function handleReject(req: AccountRequest) {
    setRejectingRequest(req);
  }

  async function handleConfirmReject(req: AccountRequest, reason: string) {
    const res = await fetch(`/api/requests/${req.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'rejected',
        resolvedById: currentUser!.id,
        rejectionReason: reason,
      }),
    });
    if (res.ok) {
      push('info', 'Request rejected with feedback provided');
      loadData();
    } else {
      push('error', 'Failed to reject request');
    }
  }

  function handleDelete(req: AccountRequest) {
    setConfirmState({
      title: 'Delete Request',
      message: `Are you sure you want to permanently delete the account request for ${req.fullName}?`,
      confirmText: 'Delete',
      confirmStyle: 'danger',
      onConfirm: async () => {
        setConfirmState(null);
        const res = await fetch(`/api/requests/${req.id}`, { method: 'DELETE' });
        if (res.ok) {
          push('info', 'Request deleted');
          loadData();
        } else {
          push('error', 'Failed to delete request');
        }
      }
    });
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

      {filtered.length === 0 ? (
        <div className="card"><div className="empty-state"><div className="empty-state-icon">📬</div><h3>No requests</h3><p>{currentUser.role === 'moderator' ? 'Click "New Request" to submit one.' : 'No account requests to review.'}</p></div></div>
      ) : (
        <>
          {/* Mobile Icon Cards View (Shown on mobile instead of list/table) */}
          <div className="mobile-only-cards">
            {filtered.map((req) => (
              <div key={`m-${req.id}`} className="mobile-icon-card">
                <div className="mobile-icon-card-header">
                  <div>
                    <div className="mobile-icon-card-title">{req.fullName}</div>
                  </div>
                  {/* Status as Icon */}
                  {req.status === 'pending' && (
                    <span className="icon-chip status-chip-pending" title="Pending Approval">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      Pending
                    </span>
                  )}
                  {req.status === 'approved' && (
                    <span className="icon-chip status-chip-done" title="Approved">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      Approved
                    </span>
                  )}
                  {req.status === 'rejected' && (
                    <span className="icon-chip icon-chip-error" title="Rejected">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      Rejected
                    </span>
                  )}
                </div>

                {/* All Request Details as Icons */}
                <div className="mobile-details-icon-bar">
                  {/* Email as clickable Icon */}
                  <a href={`mailto:${req.email}`} className="icon-chip icon-chip-link" title="Send Email">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    {req.email}
                  </a>

                  {/* Department Icon */}
                  <span className="icon-chip" title="Department">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2"/>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                    </svg>
                    {req.department || 'General'}
                  </span>

                  {/* Requester Icon */}
                  {isAdmin && (
                    <span className="icon-chip" title="Requested By">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                      </svg>
                      Req: {getUserName(req.requestedById)}
                    </span>
                  )}

                  {/* Date Icon */}
                  <span className="icon-chip" title="Requested Date">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    {new Date(req.createdAt).toLocaleDateString()}
                  </span>

                  {/* Resolved Info as Icon */}
                  {req.resolvedAt && (
                    <span className="icon-chip icon-chip-info" title="Resolved Info">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                      By {getUserName(req.resolvedById)}
                    </span>
                  )}
                </div>

                {/* Reason with Icon */}
                {req.reason && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 13, color: 'var(--neutral-600)', background: 'var(--neutral-50)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', marginTop: 4, fontStyle: 'italic' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2, color: 'var(--neutral-400)' }}>
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    <span>"{req.reason}"</span>
                  </div>
                )}

                {/* Rejection Feedback Note */}
                {req.status === 'rejected' && (
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.08)',
                    borderLeft: '3px solid var(--error, #ef4444)',
                    padding: '8px 12px',
                    borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                    fontSize: 12.5,
                    color: 'var(--error-dark, #b91c1c)',
                    marginTop: 6,
                    lineHeight: 1.4,
                  }}>
                    <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                      <span>❌</span> Rejection Reason:
                    </div>
                    <span style={{ fontStyle: 'italic' }}>&ldquo;{req.rejectionReason || 'No specific feedback provided'}&rdquo;</span>
                  </div>
                )}

                {/* Mobile Icon Action Buttons */}
                {(isAdmin || req.requestedById === currentUser.id) && (
                  <div className="mobile-icon-actions">
                    {isAdmin && req.status === 'pending' && (
                      <>
                        <button className="mobile-icon-btn mobile-icon-btn-success" onClick={() => setModalState({ type: 'approve', req })} title="Approve Request" aria-label="Approve Request">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        </button>
                        <button className="mobile-icon-btn" style={{ color: 'var(--warning)', borderColor: 'var(--warning)' }} onClick={() => handleReject(req)} title="Reject Request" aria-label="Reject Request">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      </>
                    )}
                    <button className="mobile-icon-btn mobile-icon-btn-danger" onClick={() => handleDelete(req)} title={req.status === 'pending' && !isAdmin ? 'Cancel Request' : 'Delete Request'} aria-label="Delete Request">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="card desktop-only-table">
            <div className="table-wrap">
              <table>
                <thead><tr>
                  <th>Requested For</th>
                  {isAdmin && <th>Requested By</th>}
                  <th>Department</th><th>Reason</th><th>Status</th><th>Date</th>
                  <th>Actions</th>
                </tr></thead>
                <tbody>
                  {filtered.map((req) => (
                    <tr key={req.id}>
                      <td><div style={{ fontWeight: 600, color: 'var(--neutral-900)' }}>{req.fullName}</div><div style={{ fontSize: 12, color: 'var(--neutral-400)' }}>{req.email}</div></td>
                      {isAdmin && <td style={{ fontSize: 13 }}>{getUserName(req.requestedById)}</td>}
                      <td style={{ fontSize: 13, color: 'var(--neutral-600)' }}>{req.department || '—'}</td>
                      <td>
                        <div style={{ fontSize: 13, color: 'var(--neutral-600)', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.reason || '—'}</div>
                        {req.status === 'rejected' && (
                          <div style={{
                            fontSize: 11.5,
                            color: 'var(--error, #ef4444)',
                            marginTop: 4,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}>
                            <span style={{ fontWeight: 600 }}>❌ Reason:</span>
                            <span title={req.rejectionReason || 'No feedback provided'} style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontStyle: 'italic' }}>
                              &ldquo;{req.rejectionReason || 'No feedback provided'}&rdquo;
                            </span>
                          </div>
                        )}
                      </td>
                      <td><span className={`badge badge-${req.status}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>{statusIcon(req.status)}{req.status}</span></td>
                      <td style={{ fontSize: 12, color: 'var(--neutral-400)' }}>
                        <div>{new Date(req.createdAt).toLocaleDateString()} {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        {req.resolvedAt && <div style={{ marginTop: 2 }}>Resolved: {new Date(req.resolvedAt).toLocaleDateString()} {new Date(req.resolvedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          {isAdmin && req.status === 'pending' && (
                            <>
                              <button className="btn btn-success btn-sm" onClick={() => setModalState({ type: 'approve', req })}>Approve</button>
                              <button className="btn btn-warning btn-sm" style={{ background: 'var(--warning)', color: 'white', border: 'none' }} onClick={() => handleReject(req)}>Reject</button>
                            </>
                          )}
                          {(isAdmin || req.requestedById === currentUser.id) && (
                            <button className="btn btn-outline btn-sm" style={{ borderColor: 'var(--error)', color: 'var(--error)' }} onClick={() => handleDelete(req)}>
                              {req.status === 'pending' && !isAdmin ? 'Cancel' : 'Delete'}
                            </button>
                          )}
                          {req.resolvedById && (
                            <span style={{ fontSize: 12, color: 'var(--neutral-400)', marginLeft: 4 }}>by {getUserName(req.resolvedById)}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {modalState === 'new' && (
        <NewRequestModal currentUserId={currentUser.id} onClose={() => setModalState(null)} onSave={handleSubmitRequest} />
      )}
      {modalState !== null && typeof modalState === 'object' && modalState.type === 'approve' && (
        <ApproveModal req={modalState.req} onClose={() => setModalState(null)}
          onApprove={(username, pw) => handleApprove(modalState.req, username, pw)} />
      )}

      {rejectingRequest && (
        <RejectAccountRequestModal
          req={rejectingRequest}
          requesterName={getUserName(rejectingRequest.requestedById)}
          onClose={() => setRejectingRequest(null)}
          onConfirm={async (reason) => {
            await handleConfirmReject(rejectingRequest, reason);
          }}
        />
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
