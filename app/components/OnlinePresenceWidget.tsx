'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth-context';

export interface PresenceUser {
  id: string;
  fullName: string;
  username: string;
  role: string;
  department: string;
  isOnline: boolean;
  lastActive: number | null;
}

export default function OnlinePresenceWidget() {
  const { currentUser } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([]);
  const [offlineUsers, setOfflineUsers] = useState<PresenceUser[]>([]);
  const [totalAccessible, setTotalAccessible] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const fetchPresence = async () => {
      try {
        const res = await fetch(`/api/presence?userId=${currentUser.id}&role=${currentUser.role}`);
        if (res.ok) {
          const data = await res.json();
          setOnlineUsers(data.onlineUsers || []);
          setOfflineUsers(data.offlineUsers || []);
          setTotalAccessible(data.totalAccessible || 0);
        }
      } catch (e) {} finally {
        setLoading(false);
      }
    };

    fetchPresence();
    const interval = setInterval(fetchPresence, 12000); // refresh every 12s
    return () => clearInterval(interval);
  }, [currentUser]);

  if (!currentUser || currentUser.role === 'user') return null;

  const isAdmin = currentUser.role === 'admin';
  const isModerator = currentUser.role === 'moderator';

  return (
    <div className="card online-presence-card" style={{ marginBottom: 24, overflow: 'hidden' }}>
      <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'var(--success-light)',
            color: 'var(--success-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div>
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {isAdmin ? 'Company Team Presence' : 'Assigned Users Presence'}
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: 'var(--success-light)',
                color: 'var(--success-dark)',
                fontSize: 11,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 20,
              }}>
                <span className="presence-pulse-dot" />
                {onlineUsers.length} Online
              </span>
            </div>
            <div className="card-subtitle">
              {isAdmin
                ? `Monitoring live activity for all ${totalAccessible} registered accounts`
                : `Showing online activity for users assigned to you (${onlineUsers.length} of ${totalAccessible} active)`}
            </div>
          </div>
        </div>
      </div>

      <div className="card-body" style={{ padding: '16px 20px' }}>
        {loading ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--neutral-400)' }}>
            Checking team activity…
          </div>
        ) : (
          <>
            {onlineUsers.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--neutral-400)', background: 'var(--neutral-50)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: 24, display: 'block', marginBottom: 6 }}>💤</span>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--neutral-700)' }}>
                  {isAdmin ? 'No team members are currently online' : 'None of your assigned users are currently active'}
                </div>
                <div style={{ fontSize: 12, marginTop: 2 }}>
                  When assigned members log in, their live status will appear here in real time.
                </div>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 12,
              }}>
                {onlineUsers.map((u) => {
                  const initials = u.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
                  return (
                    <div
                      key={u.id}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-surface)',
                        border: '1.5px solid var(--success)',
                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 10,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                        <div style={{ position: 'relative', flexShrink: 0 }}>
                          <div className="sidebar-avatar" style={{ width: 36, height: 36, fontSize: 13 }}>
                            {initials}
                          </div>
                          <span
                            style={{
                              position: 'absolute',
                              bottom: -1,
                              right: -1,
                              width: 11,
                              height: 11,
                              borderRadius: '50%',
                              background: '#10b981',
                              border: '2px solid var(--bg-surface)',
                              boxShadow: '0 0 6px #10b981',
                            }}
                          />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--neutral-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {u.fullName} {u.id === currentUser.id && '(You)'}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--neutral-400)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 1 }}>
                            <span>@{u.username}</span>
                            <span>•</span>
                            <span>{u.department || 'General'}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                        <span className={`badge badge-${u.role}`} style={{ fontSize: 10, padding: '2px 7px' }}>
                          {u.role}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Offline summary expander */}
            {offlineUsers.length > 0 && (
              <details style={{ marginTop: 14 }}>
                <summary style={{ fontSize: 12, fontWeight: 600, color: 'var(--neutral-500)', cursor: 'pointer', userSelect: 'none' }}>
                  Offline Members ({offlineUsers.length})
                </summary>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: 8,
                  marginTop: 10,
                }}>
                  {offlineUsers.map((u) => {
                    const initials = u.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
                    return (
                      <div
                        key={u.id}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--neutral-50)',
                          border: '1px solid var(--neutral-200)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          opacity: 0.8,
                        }}
                      >
                        <div style={{ position: 'relative', flexShrink: 0 }}>
                          <div className="sidebar-avatar" style={{ width: 28, height: 28, fontSize: 11, background: 'var(--neutral-400)' }}>
                            {initials}
                          </div>
                          <span
                            style={{
                              position: 'absolute',
                              bottom: -1,
                              right: -1,
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              background: 'var(--neutral-400)',
                              border: '1.5px solid var(--bg-surface)',
                            }}
                          />
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--neutral-800)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {u.fullName}
                          </div>
                          <div style={{ fontSize: 10, color: 'var(--neutral-400)' }}>
                            Offline
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </details>
            )}
          </>
        )}
      </div>
    </div>
  );
}
