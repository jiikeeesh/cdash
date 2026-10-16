'use client';

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from './auth-context';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'task_assigned' | 'task_updated' | 'request_pending' | 'request_resolved' | 'system';
  link?: string;
  read: boolean;
  priority?: 'normal' | 'high' | 'critical';
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  activeToast: AppNotification | null;
  dismissToast: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Web Audio API chime generator (no external mp3 dependency required!)
function playNotificationChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Pleasant two-tone chime: 587.33 Hz (D5) -> 880 Hz (A5)
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  } catch (e) {}
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);

  const prevTasksRef = useRef<Map<string, { status: string; title: string }>>(new Map());
  const prevRequestsRef = useRef<Map<string, string>>(new Map());
  const isFirstPollRef = useRef(true);

  // Storage key scoped to user
  const storageKey = currentUser ? `cdash_notifs_${currentUser.id}` : null;
  const soundStorageKey = 'cdash_notif_sound';

  // Load saved notifications & settings on login
  useEffect(() => {
    if (!currentUser || !storageKey) return;

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setNotifications(JSON.parse(saved));
      } else {
        // Welcome notification for new session
        const welcome: AppNotification = {
          id: 'welcome-' + Date.now(),
          title: `Welcome back, ${currentUser.fullName.split(' ')[0]}!`,
          message: 'You are signed in to CompanyDash. Stay on top of your tasks and team updates here.',
          timestamp: new Date().toISOString(),
          type: 'system',
          read: false,
          priority: 'normal',
        };
        setNotifications([welcome]);
      }

      const savedSound = localStorage.getItem(soundStorageKey);
      if (savedSound !== null) {
        setSoundEnabledState(savedSound === 'true');
      }
    } catch (e) {}
  }, [currentUser, storageKey]);

  // Save notifications on change
  const saveNotifications = (newNotifs: AppNotification[]) => {
    setNotifications(newNotifs);
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(newNotifs.slice(0, 50)));
      } catch (e) {}
    }
  };

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    try {
      localStorage.setItem(soundStorageKey, String(enabled));
    } catch (e) {}
  };

  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  const addNotification = useCallback((notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const fullNotif: AppNotification = {
      ...notif,
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      read: false,
    };

    setNotifications((prev) => {
      const next = [fullNotif, ...prev];
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(next.slice(0, 50)));
        } catch (e) {}
      }
      return next;
    });

    // In-app banner popup
    setActiveToast(fullNotif);

    // Audio chime
    if (soundEnabled) {
      playNotificationChime();
    }

    // Browser notification fallback
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(fullNotif.title, {
          body: fullNotif.message,
          icon: '/favicon.ico',
        });
      } catch (e) {}
    }
  }, [soundEnabled, storageKey]);

  // Auto-dismiss active toast after 6 seconds
  useEffect(() => {
    if (!activeToast) return;
    const timer = setTimeout(() => {
      setActiveToast(null);
    }, 6000);
    return () => clearTimeout(timer);
  }, [activeToast]);

  // Request browser notification permission once
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {});
      }
    }
  }, []);

  // Real-time polling for task assignments and status updates
  useEffect(() => {
    if (!currentUser) return;

    const pollUpdates = async () => {
      try {
        // 1. Fetch user tasks
        const tasksRes = await fetch(`/api/tasks?userId=${currentUser.id}`);
        if (tasksRes.ok) {
          const tasks = await tasksRes.json();
          const currentMap = new Map<string, { status: string; title: string }>();

          tasks.forEach((t: any) => {
            currentMap.set(t.id, { status: t.status, title: t.title });

            // Check if this task was newly assigned or updated after first poll
            if (!isFirstPollRef.current) {
              const prev = prevTasksRef.current.get(t.id);
              const isAssignee = t.assigneeIds?.includes(currentUser.id);
              const isCreator = t.assignedById === currentUser.id;

              if (!prev && isAssignee && !isCreator) {
                // New task assigned to me
                addNotification({
                  title: 'New Task Assigned 📋',
                  message: `You have been assigned: "${t.title}" (Priority: ${t.priority})`,
                  type: 'task_assigned',
                  link: '/dashboard/tasks',
                  priority: t.priority === 'critical' ? 'critical' : 'high',
                });
              } else if (prev && prev.status !== t.status) {
                // Task status changed
                if (isCreator && !isAssignee) {
                  addNotification({
                    title: `Task Status: ${t.status.toUpperCase()}`,
                    message: `"${t.title}" was moved from ${prev.status} to ${t.status}`,
                    type: 'task_updated',
                    link: '/dashboard/tasks',
                    priority: 'normal',
                  });
                } else if (isAssignee) {
                  addNotification({
                    title: `Task Updated`,
                    message: `Status of "${t.title}" is now ${t.status}`,
                    type: 'task_updated',
                    link: '/dashboard/tasks',
                    priority: 'normal',
                  });
                }
              }
            }
          });

          prevTasksRef.current = currentMap;
        }

        // 2. Fetch requests updates (if Admin or Moderator)
        if (currentUser.role !== 'user') {
          const reqUrl = currentUser.role === 'moderator'
            ? `/api/requests?requestedById=${currentUser.id}`
            : '/api/requests';
          const reqRes = await fetch(reqUrl);
          if (reqRes.ok) {
            const requests = await reqRes.json();
            const currentReqMap = new Map<string, string>();

            requests.forEach((r: any) => {
              currentReqMap.set(r.id, r.status);

              if (!isFirstPollRef.current) {
                const prevStatus = prevRequestsRef.current.get(r.id);

                // Admin sees new pending requests
                if (!prevStatus && r.status === 'pending' && currentUser.role === 'admin') {
                  addNotification({
                    title: 'New Account Request 👤',
                    message: `${r.fullName} (${r.department || 'General'}) requested an account.`,
                    type: 'request_pending',
                    link: '/dashboard/requests',
                    priority: 'high',
                  });
                }

                // Moderator sees resolution of their requests
                if (prevStatus && prevStatus !== r.status && r.requestedById === currentUser.id) {
                  addNotification({
                    title: `Request ${r.status.toUpperCase()} ✨`,
                    message: `Account request for "${r.fullName}" was ${r.status}.`,
                    type: 'request_resolved',
                    link: '/dashboard/requests',
                    priority: r.status === 'approved' ? 'high' : 'normal',
                  });
                }
              }
            });

            prevRequestsRef.current = currentReqMap;
          }
        }

        isFirstPollRef.current = false;
      } catch (err) {}
    };

    pollUpdates();
    const interval = setInterval(pollUpdates, 8000); // Poll every 8s for real-time alerts
    return () => clearInterval(interval);
  }, [currentUser, addNotification]);

  const markAsRead = (id: string) => {
    saveNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    saveNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    saveNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearAll,
        addNotification,
        isDrawerOpen,
        setIsDrawerOpen,
        soundEnabled,
        setSoundEnabled,
        activeToast,
        dismissToast,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return ctx;
}
