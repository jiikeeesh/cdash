'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../lib/auth-context';

export interface UserStatusOption {
  key: string;
  label: string;
  description: string;
  color: string;
  dotClass: string;
}

export const USER_STATUS_OPTIONS: UserStatusOption[] = [
  {
    key: 'active',
    label: 'Live / Active',
    description: 'Online and working',
    color: '#10b981',
    dotClass: 'status-dot-active',
  },
  {
    key: 'away',
    label: 'Away',
    description: 'Stepped away temporarily',
    color: '#f59e0b',
    dotClass: 'status-dot-away',
  },
  {
    key: 'busy',
    label: 'Busy',
    description: 'In focused work / meeting',
    color: '#ef4444',
    dotClass: 'status-dot-busy',
  },
  {
    key: 'dnd',
    label: 'Do Not Disturb',
    description: 'Mute alerts & notifications',
    color: '#e11d48',
    dotClass: 'status-dot-dnd',
  },
  {
    key: 'ooo',
    label: 'Out of Office',
    description: 'Vacation, sick leave, travel',
    color: '#8b5cf6',
    dotClass: 'status-dot-ooo',
  },
];

export const OFFLINE_STATUS_OPTION: UserStatusOption = {
  key: 'offline',
  label: 'Offline',
  description: 'Not currently active',
  color: '#94a3b8',
  dotClass: 'status-dot-offline',
};

export function getStatusOption(statusKey?: string): UserStatusOption {
  if (!statusKey || statusKey === 'offline') {
    return OFFLINE_STATUS_OPTION;
  }
  const found = USER_STATUS_OPTIONS.find((s) => s.key === statusKey);
  return found || OFFLINE_STATUS_OPTION;
}

export default function UserStatusPicker({ compact = false }: { compact?: boolean }) {
  const { currentUser, updateStatus } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentStatusKey = currentUser?.status || 'active';
  const currentOption = getStatusOption(currentStatusKey);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = async (key: string) => {
    setIsOpen(false);
    if (key !== currentStatusKey) {
      await updateStatus(key);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={containerRef}>
      <button
        type="button"
        className="user-status-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        title={`Your status is ${currentOption.label}. Click to change.`}
        style={compact ? { padding: '4px 10px', fontSize: 12 } : undefined}
      >
        <span className={`status-dot ${currentOption.dotClass}`} />
        <span>{currentOption.label}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s ease',
            color: 'var(--neutral-400)',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="status-dropdown-menu">
          {USER_STATUS_OPTIONS.map((opt) => {
            const isSelected = opt.key === currentStatusKey;
            return (
              <div
                key={opt.key}
                className={`status-option-item ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(opt.key)}
              >
                <span className={`status-dot status-dot-lg ${opt.dotClass}`} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="status-option-title">{opt.label}</div>
                  <div className="status-option-desc">{opt.description}</div>
                </div>
                {isSelected && (
                  <span className="status-option-check">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
