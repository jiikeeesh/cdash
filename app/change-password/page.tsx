'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth-context';

function getStrength(pw: string): 0 | 1 | 2 | 3 | 4 {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s as 0 | 1 | 2 | 3 | 4;
}

const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthClass = ['', 'weak', 'fair', 'good', 'strong'];

export default function ChangePasswordPage() {
  const { currentUser, refreshUser, logout } = useAuth();
  const router = useRouter();

  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      router.replace('/login');
    } else if (!currentUser.isFirstLogin) {
      router.replace('/dashboard');
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  const strength = getStrength(newPw);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (newPw.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPw !== confirmPw) {
      setError('Passwords do not match.');
      return;
    }
    if (newPw === currentUser.password) {
      setError('New password must be different from the current one.');
      return;
    }

    setLoading(true);
    
    const res = await fetch(`/api/users/${currentUser.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: newPw, isFirstLogin: false }),
    });

    if (!res.ok) {
      setError('Failed to update password.');
      setLoading(false);
      return;
    }

    await refreshUser();
    setLoading(false);
    router.push('/dashboard');
  }

  return (
    <div className="change-pw-page">
      <div className="change-pw-card">
        {/* Badge */}
        <div className="change-pw-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          First Login — Action Required
        </div>

        <h2>Set your password</h2>
        <p>
          Welcome, <strong>{currentUser.fullName}</strong>! Your account was created by an admin. 
          Please set a new password to continue.
        </p>

        <form onSubmit={handleSubmit}>
          {/* New password */}
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label-dark" htmlFor="new-password">New Password</label>
            <div className="form-input-wrap">
              <span className="form-input-icon-dark">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                id="new-password"
                className="form-input-white"
                type={showNew ? 'text' : 'password'}
                placeholder="Choose a strong password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                autoFocus
              />
              <button type="button" className="form-input-eye" onClick={() => setShowNew((v) => !v)}
                style={{ color: 'var(--neutral-400)' }}>
                {showNew ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Strength bars */}
            {newPw && (
              <>
                <div className="password-strength">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`strength-bar${i <= strength ? ` ${strengthClass[strength]}` : ''}`} />
                  ))}
                </div>
                <p className="text-sm text-neutral" style={{ marginTop: 4 }}>
                  Strength: <strong>{strengthLabel[strength]}</strong>
                </p>
              </>
            )}
          </div>

          {/* Confirm */}
          <div className="form-group" style={{ marginBottom: 20 }}>
            <label className="form-label-dark" htmlFor="confirm-password">Confirm Password</label>
            <div className="form-input-wrap">
              <span className="form-input-icon-dark">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z"/>
                </svg>
              </span>
              <input
                id="confirm-password"
                className="form-input-white"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Repeat your new password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
              />
              <button type="button" className="form-input-eye" onClick={() => setShowConfirm((v) => !v)}
                style={{ color: 'var(--neutral-400)' }}>
                {showConfirm ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
            {confirmPw && newPw && (
              <p className={confirmPw === newPw ? 'success-msg' : 'error-msg'}>
                {confirmPw === newPw ? '✓ Passwords match' : '✗ Passwords do not match'}
              </p>
            )}
          </div>

          {error && (
            <div className="login-error" style={{ background: 'rgba(239,68,68,.08)', color: 'var(--error-dark)', border: '1px solid rgba(239,68,68,.2)', marginBottom: 16 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              {error}
            </div>
          )}

          <button id="change-pw-submit" type="submit" className="btn-primary" disabled={loading}>
            {loading ? <><div className="spinner" />&nbsp;Saving…</> : <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Set Password & Continue
            </>}
          </button>
        </form>

        <button onClick={logout} className="btn-outline btn" style={{ width: '100%', marginTop: 10 }}>
          Sign out
        </button>
      </div>
    </div>
  );
}
