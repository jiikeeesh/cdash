'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNotifications, AppNotification } from '../lib/notification-context';

function formatRelativeTime(dateString: string) {
  const diffSec = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return new Date(dateString).toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function getNotificationIcon(type: AppNotification['type']) {
  switch (type) {
    case 'task_assigned':
      return (
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--brand-50)', color: 'var(--brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        </div>
      );
    case 'task_updated':
      return (
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--info-light)', color: 'var(--info-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
        </div>
      );
    case 'request_pending':
      return (
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--warning-light)', color: 'var(--warning-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>
        </div>
      );
    case 'request_resolved':
      return (
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--success-light)', color: 'var(--success-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
      );
    default:
      return (
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--neutral-100)', color: 'var(--neutral-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        </div>
      );
  }
}

export default function NotificationCenter() {
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
    isDrawerOpen,
    setIsDrawerOpen,
    soundEnabled,
    setSoundEnabled,
    activeToast,
    dismissToast,
  } = useNotifications();

  const [tab, setTab] = useState<'all' | 'unread'>('all');

  const filtered = tab === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  const handleNotificationClick = (notif: AppNotification) => {
    markAsRead(notif.id);
    if (notif.link) {
      router.push(notif.link);
      setIsDrawerOpen(false);
    }
  };

  return (
    <>
      {/* 1. Real-time In-App Floating Toast Alert */}
      {activeToast && (
        <div
          className="notification-toast-banner"
          onClick={() => {
            if (activeToast.link) {
              markAsRead(activeToast.id);
              router.push(activeToast.link);
              dismissToast();
            }
          }}
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 99999,
            background: 'var(--bg-surface)',
            border: '1.5px solid var(--brand-500)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 10px 35px rgba(0,0,0,0.22)',
            padding: '14px 18px',
            maxWidth: 380,
            width: 'calc(100vw - 40px)',
            cursor: activeToast.link ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            animation: 'slideInToast 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {getNotificationIcon(activeToast.type)}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--neutral-900)' }}>
                {activeToast.title}
              </div>
              <span style={{ fontSize: 11, color: 'var(--neutral-400)', flexShrink: 0 }}>Just now</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--neutral-600)', marginTop: 3, lineHeight: 1.4 }}>
              {activeToast.message}
            </div>
            {activeToast.link && (
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--brand-600)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                Tap to view details →
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              dismissToast();
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--neutral-400)',
              cursor: 'pointer',
              padding: 2,
              marginTop: -2,
            }}
            aria-label="Dismiss alert"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      )}

      {/* 2. Notification Center Slide-over Drawer / Modal */}
      {isDrawerOpen && (
        <>
          <div className="modal-backdrop" onClick={() => setIsDrawerOpen(false)} style={{ zIndex: 1000 }} />
          <div
            className="notification-drawer"
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              maxWidth: 420,
              background: 'var(--bg-surface)',
              zIndex: 1001,
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              flexDirection: 'column',
              borderLeft: '1px solid var(--neutral-200)',
              animation: 'drawerSlideLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '18px 20px',
              borderBottom: '1px solid var(--neutral-200)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: 'var(--brand-50)',
                  color: 'var(--brand-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--neutral-900)' }}>
                    Notifications
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--neutral-400)' }}>
                    {unreadCount > 0 ? `${unreadCount} unread update${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {/* Audio chime toggle */}
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  title={soundEnabled ? 'Chime Sound Enabled (click to mute)' : 'Chime Muted (click to enable)'}
                  style={{
                    background: soundEnabled ? 'var(--brand-50)' : 'var(--neutral-100)',
                    border: '1px solid var(--neutral-200)',
                    color: soundEnabled ? 'var(--brand-600)' : 'var(--neutral-400)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px 8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  aria-label="Toggle notification sound"
                >
                  {soundEnabled ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                  )}
                </button>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsDrawerOpen(false)}
                  aria-label="Close"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>

            {/* Action Bar (Filters + Mark All Read) */}
            <div style={{
              padding: '10px 18px',
              borderBottom: '1px solid var(--neutral-200)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--neutral-50)',
            }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  type="button"
                  onClick={() => setTab('all')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    border: 'none',
                    background: tab === 'all' ? 'var(--brand-600)' : 'transparent',
                    color: tab === 'all' ? 'white' : 'var(--neutral-500)',
                    cursor: 'pointer',
                  }}
                >
                  All ({notifications.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTab('unread')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    border: 'none',
                    background: tab === 'unread' ? 'var(--brand-600)' : 'transparent',
                    color: tab === 'unread' ? 'white' : 'var(--neutral-500)',
                    cursor: 'pointer',
                  }}
                >
                  Unread ({unreadCount})
                </button>
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--brand-600)',
                    cursor: 'pointer',
                  }}
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
              {filtered.length === 0 ? (
                <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--neutral-400)' }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>🔔</div>
                  <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--neutral-700)' }}>
                    No notifications
                  </div>
                  <div style={{ fontSize: 13, marginTop: 4 }}>
                    {tab === 'unread' ? 'All unread notifications have been viewed' : 'You are completely caught up!'}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {filtered.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleNotificationClick(item)}
                      style={{
                        padding: '14px',
                        borderRadius: 'var(--radius-md)',
                        background: item.read ? 'var(--bg-surface)' : 'var(--brand-50)',
                        border: '1px solid',
                        borderColor: item.read ? 'var(--neutral-200)' : 'var(--brand-200)',
                        cursor: item.link ? 'pointer' : 'default',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 12,
                        transition: 'all 0.15s ease',
                        position: 'relative',
                      }}
                    >
                      {getNotificationIcon(item.type)}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                          <div style={{ fontWeight: item.read ? 600 : 700, fontSize: 13, color: 'var(--neutral-900)' }}>
                            {item.title}
                          </div>
                          <span style={{ fontSize: 11, color: 'var(--neutral-400)', flexShrink: 0 }}>
                            {formatRelativeTime(item.timestamp)}
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--neutral-600)', marginTop: 4, lineHeight: 1.4 }}>
                          {item.message}
                        </div>
                        {item.link && (
                          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--brand-600)', marginTop: 6 }}>
                            Open item →
                          </div>
                        )}
                      </div>
                      {!item.read && (
                        <div style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: 'var(--brand-600)',
                          position: 'absolute',
                          top: 14,
                          right: 12,
                        }} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div style={{
                padding: '12px 18px',
                borderTop: '1px solid var(--neutral-200)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--neutral-50)',
              }}>
                <button
                  type="button"
                  onClick={clearAll}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: 12,
                    color: 'var(--error)',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  Clear all notifications
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
