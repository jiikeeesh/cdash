'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface SafeUser {
  id: string;
  username: string;
  role: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  department: string;
  isFirstLogin: boolean;
  createdAt: string;
  createdBy: string;
  themeMode?: string;
  themeColor?: string;
}

interface AuthContextValue {
  currentUser: SafeUser | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const SESSION_KEY = 'cdash_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<SafeUser | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem(SESSION_KEY);
        if (stored) return JSON.parse(stored) as SafeUser;
      } catch {
        sessionStorage.removeItem(SESSION_KEY);
      }
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return false;
    }
    return true;
  });

  // Restore session / sync on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) {
        setCurrentUser(JSON.parse(stored) as SafeUser);
      }
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (
    username: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error ?? 'Login failed' };

      setCurrentUser(data.user);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(data.user));
      return { success: true };
    } catch {
      return { success: false, error: 'Network error — please try again' };
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    sessionStorage.removeItem(SESSION_KEY);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/users/${currentUser.id}`);
      if (res.ok) {
        const user = await res.json();
        setCurrentUser(user);
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
      }
    } catch { /* silently ignore */ }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
