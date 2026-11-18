'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../lib/auth-context';
import {
  generateE2EKeyPair,
  deriveSharedAesKey,
  deriveDeterministicConversationKey,
  encryptE2EMessage,
  decryptE2EMessage,
} from '../../lib/crypto';
import { getStatusOption } from '../../components/UserStatusPicker';

interface Contact {
  id: string;
  username: string;
  fullName: string;
  role: string;
  department?: string;
  status?: string;
  isOnline?: boolean;
  publicKey?: string;
  lastMessageAt?: string | null;
  unreadCount?: number;
}

interface LinkedTask {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  notes: string[];
  assignedBy?: { fullName: string; username: string; role: string };
  assignees?: { id: string; fullName: string; username: string; role?: string }[];
}

interface EncryptedMessage {
  id: string;
  senderId: string;
  receiverId: string;
  ciphertext: string;
  iv: string;
  createdAt: string;
  updatedAt?: string | null;
  isEdited?: boolean;
  taskId?: string | null;
  task?: LinkedTask | null;
  read: boolean;
}

interface DecryptedMessage extends EncryptedMessage {
  text: string;
}

interface ActiveKeyInfo {
  contactId: string;
  primaryKey: CryptoKey;
  fallbackKey?: CryptoKey | null;
}

const ONE_HOUR_MS = 60 * 60 * 1000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function getInitials(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U'
  );
}

function formatTime(isoStr: string): string {
  try {
    const d = new Date(isoStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function formatDateHeader(isoStr: string): string {
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

export default function MessagesPage() {
  const { currentUser } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<DecryptedMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [targetUsernameInput, setTargetUsernameInput] = useState('');
  const [connectError, setConnectError] = useState('');
  const [isSearchingUser, setIsSearchingUser] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [myPrivateKeyJwk, setMyPrivateKeyJwk] = useState<string | null>(null);
  const [activeKeyInfo, setActiveKeyInfo] = useState<ActiveKeyInfo | null>(null);
  const [mobileShowChat, setMobileShowChat] = useState(false);

  // Edit & Delete state
  const [editingMessage, setEditingMessage] = useState<DecryptedMessage | null>(null);
  const [deleteModalMsg, setDeleteModalMsg] = useState<DecryptedMessage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeBubbleActionsId, setActiveBubbleActionsId] = useState<string | null>(null);

  // Delete Chat state
  const [deleteChatModalOpen, setDeleteChatModalOpen] = useState(false);
  const [deleteChatMode, setDeleteChatMode] = useState<'for-me' | 'for-everyone'>('for-me');
  const [isDeletingChat, setIsDeletingChat] = useState(false);

  // Link Task state
  const [availableTasks, setAvailableTasks] = useState<LinkedTask[]>([]);
  const [selectedLinkedTask, setSelectedLinkedTask] = useState<LinkedTask | null>(null);
  const [isTaskPickerOpen, setIsTaskPickerOpen] = useState(false);
  const [viewingTaskReport, setViewingTaskReport] = useState<LinkedTask | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. Initialize E2E keys on client mount
  useEffect(() => {
    if (!currentUser) return;

    async function initKeys() {
      try {
        const storageKey = `cdash_e2e_priv_${currentUser!.id}`;
        let localPrivKey = localStorage.getItem(storageKey);

        if (!localPrivKey) {
          const keyPair = await generateE2EKeyPair();
          localPrivKey = keyPair.privateKey;
          localStorage.setItem(storageKey, localPrivKey);

          await fetch('/api/users/keys', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: currentUser!.id,
              publicKey: keyPair.publicKey,
            }),
          });
        }

        setMyPrivateKeyJwk(localPrivKey);
      } catch (err) {
        console.error('Failed to initialize E2E keys:', err);
      }
    }

    initKeys();
  }, [currentUser]);

  // 2. Load contacts list
  const loadContacts = useCallback(async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/messages/contacts?userId=${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        const freshContacts: Contact[] = data.contacts || [];
        setContacts(freshContacts);
        setSelectedContact((prev) => {
          if (!prev) return null;
          const fresh = freshContacts.find((c) => c.id === prev.id);
          if (fresh && (fresh.status !== prev.status || fresh.isOnline !== prev.isOnline)) {
            return { ...prev, status: fresh.status, isOnline: fresh.isOnline };
          }
          return prev;
        });
      }
    } catch (err) {
      console.error('Failed to load contacts:', err);
    }
  }, [currentUser]);

  useEffect(() => {
    loadContacts();
    const interval = setInterval(loadContacts, 4000); // 4s real-time presence & contact refresh
    return () => clearInterval(interval);
  }, [loadContacts]);

  // 3. Load user's tasks for task linking
  useEffect(() => {
    if (!currentUser) return;
    fetch(`/api/tasks?userId=${currentUser.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setAvailableTasks(data);
      })
      .catch(() => {});
  }, [currentUser]);

  // 4. Derive conversation AES-GCM key when selectedContact changes
  useEffect(() => {
    if (!currentUser || !selectedContact) {
      setActiveKeyInfo(null);
      return;
    }

    let isCancelled = false;
    const targetContactId = selectedContact.id;
    const contactPub = selectedContact.publicKey;

    async function setupConversationKey() {
      try {
        const deterministicKey = await deriveDeterministicConversationKey(
          currentUser!.id,
          targetContactId
        );

        let primaryKey = deterministicKey;
        let fallbackKey: CryptoKey | null = null;

        if (myPrivateKeyJwk && contactPub && contactPub.trim().length > 10) {
          try {
            primaryKey = await deriveSharedAesKey(myPrivateKeyJwk, contactPub);
            fallbackKey = deterministicKey;
          } catch {
            primaryKey = deterministicKey;
          }
        }

        if (!isCancelled) {
          setActiveKeyInfo({
            contactId: targetContactId,
            primaryKey,
            fallbackKey,
          });
        }
      } catch (err) {
        console.warn('Failed to derive conversation key:', err);
      }
    }

    setupConversationKey();
    return () => {
      isCancelled = true;
    };
  }, [currentUser, selectedContact, myPrivateKeyJwk]);

  // 5. Fetch and decrypt messages when contact or key is active
  const loadMessages = useCallback(async () => {
    if (!currentUser || !selectedContact || !activeKeyInfo) return;
    if (activeKeyInfo.contactId !== selectedContact.id) return; // Prevent decrypting with mismatched key

    try {
      const res = await fetch(`/api/messages?userId=${currentUser.id}&peerId=${selectedContact.id}`);
      if (!res.ok) return;

      const data = await res.json();
      const rawMessages: EncryptedMessage[] = data.messages || [];

      const decrypted: DecryptedMessage[] = await Promise.all(
        rawMessages.map(async (m) => {
          const text = await decryptE2EMessage(
            activeKeyInfo.primaryKey,
            m.ciphertext,
            m.iv,
            activeKeyInfo.fallbackKey
          );
          return { ...m, text };
        })
      );

      setMessages(decrypted);
    } catch (err) {
      console.warn('Failed to load messages:', err);
    }
  }, [currentUser, selectedContact, activeKeyInfo]);

  useEffect(() => {
    loadMessages();
    const pollInterval = setInterval(loadMessages, 3500);
    return () => clearInterval(pollInterval);
  }, [loadMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  // 6. Send or Edit Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || !currentUser || !selectedContact || !activeKeyInfo || isSending) return;
    if (activeKeyInfo.contactId !== selectedContact.id) return;

    const plaintext = draft.trim();
    setIsSending(true);

    try {
      const { ciphertext, iv } = await encryptE2EMessage(activeKeyInfo.primaryKey, plaintext);

      // A) Handle Edit Submission
      if (editingMessage) {
        const res = await fetch(`/api/messages/${editingMessage.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'edit',
            userId: currentUser.id,
            ciphertext,
            iv,
          }),
        });

        if (res.ok) {
          setEditingMessage(null);
          setDraft('');
          loadMessages();
        } else {
          const err = await res.json();
          alert(err.error || 'Failed to edit message');
        }
        return;
      }

      // B) Handle New Message Submission (with optional linked Task)
      const optimisticMsg: DecryptedMessage = {
        id: `opt-${Date.now()}`,
        senderId: currentUser.id,
        receiverId: selectedContact.id,
        ciphertext,
        iv,
        text: plaintext,
        taskId: selectedLinkedTask?.id || null,
        task: selectedLinkedTask || null,
        createdAt: new Date().toISOString(),
        read: false,
      };
      setMessages((prev) => [...prev, optimisticMsg]);
      setDraft('');
      const linkedTaskIdToSend = selectedLinkedTask?.id;
      setSelectedLinkedTask(null);

      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUser.id,
          receiverId: selectedContact.id,
          ciphertext,
          iv,
          taskId: linkedTaskIdToSend,
        }),
      });

      if (res.ok) {
        loadMessages();
        loadContacts();
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  // 7. Handle Delete Action
  const handleDeleteMessage = async (action: 'delete-for-me' | 'delete-for-everyone') => {
    if (!deleteModalMsg || !currentUser || isDeleting) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/messages/${deleteModalMsg.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          userId: currentUser.id,
        }),
      });

      if (res.ok) {
        setDeleteModalMsg(null);
        loadMessages();
        loadContacts();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete message');
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // 8. Connect by exact username
  const handleConnectByUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    const username = targetUsernameInput.trim().toLowerCase();
    if (!username || !currentUser) return;

    setIsSearchingUser(true);
    setConnectError('');

    try {
      const res = await fetch(`/api/messages/contacts?userId=${currentUser.id}&username=${encodeURIComponent(username)}`);
      const data = await res.json();

      if (data.foundByUsername) {
        const found = data.foundByUsername as Contact;
        setContacts((prev) => {
          if (prev.some((c) => c.id === found.id)) return prev;
          return [found, ...prev];
        });
        if (selectedContact?.id !== found.id) {
          setSelectedContact(found);
          setActiveKeyInfo(null);
          setMessages([]);
        }
        setMobileShowChat(true);
        setIsConnectModalOpen(false);
        setTargetUsernameInput('');
      } else {
        setConnectError(`No user found with exact username "${username}". Please verify spelling.`);
      }
    } catch (err) {
      setConnectError('Failed to search user. Please try again.');
    } finally {
      setIsSearchingUser(false);
    }
  };

  const handleDeleteChat = async () => {
    if (!currentUser || !selectedContact) return;
    setIsDeletingChat(true);
    try {
      const res = await fetch(
        `/api/messages?userId=${currentUser.id}&peerId=${selectedContact.id}&mode=${deleteChatMode}`,
        { method: 'DELETE' }
      );
      if (res.ok) {
        setMessages([]);
        setDeleteChatModalOpen(false);
        loadContacts();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to delete chat');
      }
    } catch (err) {
      console.error('Error deleting chat:', err);
    } finally {
      setIsDeletingChat(false);
    }
  };

  if (!currentUser) return null;

  const filteredContacts = contacts.filter((c) => {
    const q = searchFilter.trim().toLowerCase();
    if (!q) return true;
    return (
      c.fullName.toLowerCase().includes(q) ||
      c.username.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q)
    );
  });

  return (
    <div className="msg-page-wrap">
      {/* Page Header */}
      <div className={`msg-header-bar ${mobileShowChat && selectedContact ? 'in-chat' : ''}`}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--neutral-900)', margin: 0, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span>💬</span> Direct Messages
            <span className="msg-e2e-badge" title="All communications are end-to-end encrypted using AES-256-GCM">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              E2E Encrypted
            </span>
            <span className="msg-policy-badge">
              ⏳ 1-Month Policy
            </span>
          </h2>
          <p className="msg-header-desc" style={{ margin: '3px 0 0 0', fontSize: 13, color: 'var(--neutral-500)' }}>
            {currentUser.role === 'admin'
              ? '👑 Administrator: Freely message all users. Messages can be edited within 1 hr, deleted for everyone within 1 day, and auto-delete in 30 days.'
              : currentUser.role === 'moderator'
              ? '⚡ Moderator: Freely message your assigned team. For other moderators, connect by exact username. Task reports can be linked directly.'
              : '👤 Staff: Message your assigned moderator and team peers. For others outside, connect by exact username. Task reports can be linked directly.'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <button
            type="button"
            className="btn btn-brand btn-sm"
            onClick={() => setIsConnectModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span>+ Connect</span>
          </button>
        </div>
      </div>

      {/* Main Messaging Container */}
      <div className="msg-shell">
        {/* Left Sidebar: Contacts */}
        <div className={`msg-sidebar ${mobileShowChat ? 'hide-mobile' : ''}`}>
          <div className="msg-sidebar-header">
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--neutral-700)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Conversations ({contacts.length})
            </span>
            <span className="msg-e2e-badge">🔒 AES-256</span>
          </div>

          {/* Search Contacts Bar */}
          <div className="msg-search-section">
            <input
              type="text"
              className="outlook-input-clean"
              style={{ padding: '7px 12px', fontSize: 12.5 }}
              placeholder="Search conversations…"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>

          {/* Contact List */}
          <div className="msg-contact-list">
            {filteredContacts.length === 0 ? (
              <div style={{ padding: '30px 20px', textAlign: 'center', color: 'var(--neutral-400)', fontSize: 13 }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>💬</div>
                No conversations yet.
                <div style={{ marginTop: 8 }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setIsConnectModalOpen(true)}
                    style={{ fontSize: 11 }}
                  >
                    + Connect by Username
                  </button>
                </div>
              </div>
            ) : (
              filteredContacts.map((c) => {
                const isSelected = selectedContact?.id === c.id;
                return (
                  <div
                    key={c.id}
                    className={`msg-contact-item ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      if (selectedContact?.id !== c.id) {
                        setSelectedContact(c);
                        setActiveKeyInfo(null);
                        setMessages([]);
                        setEditingMessage(null);
                        setSelectedLinkedTask(null);
                      }
                      setMobileShowChat(true);
                    }}
                  >
                    <div className="msg-contact-avatar-wrap">
                      <div className="msg-contact-avatar">
                        {getInitials(c.fullName)}
                      </div>
                      <span
                        className={`msg-contact-status-dot status-dot-${c.status || 'active'}`}
                        title={getStatusOption(c.status).label}
                      />
                    </div>
                    <div className="msg-contact-info">
                      <div className="msg-contact-name-row">
                        <span className="msg-contact-name">{c.fullName}</span>
                        {c.lastMessageAt && (
                          <span style={{ fontSize: 11, color: 'var(--neutral-400)' }}>
                            {formatTime(c.lastMessageAt)}
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 11.5, color: 'var(--neutral-400)' }}>
                          @{c.username} • <span className={`badge badge-${c.role}`} style={{ fontSize: 9.5, padding: '1px 5px' }}>{c.role}</span>
                        </span>
                        {Boolean(c.unreadCount && c.unreadCount > 0) && (
                          <span className="msg-unread-pill">{c.unreadCount}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Main Panel: Conversation View */}
        <div className={`msg-main ${!mobileShowChat ? 'hide-mobile' : ''}`}>
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="msg-main-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
                  <button
                    type="button"
                    className="msg-back-btn"
                    onClick={() => setMobileShowChat(false)}
                    aria-label="Back to conversations"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="msg-contact-avatar-wrap" style={{ flexShrink: 0 }}>
                    <div className="msg-contact-avatar" style={{ width: 38, height: 38, fontSize: 13.5 }}>
                      {getInitials(selectedContact.fullName)}
                    </div>
                    <span
                      className={`msg-contact-status-dot status-dot-${selectedContact.status || 'active'}`}
                      title={getStatusOption(selectedContact.status).label}
                    />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--neutral-900)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {selectedContact.fullName}
                      </span>
                      <span className={`badge badge-${selectedContact.role}`} style={{ fontSize: 9.5, padding: '1px 6px', flexShrink: 0 }}>
                        {selectedContact.role === 'admin' ? '👑 Admin' : selectedContact.role === 'moderator' ? '⚡ Mod' : '👤 Staff'}
                      </span>
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--neutral-400)', display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <span className={`status-dot status-dot-${selectedContact.status || 'active'}`} style={{ width: 7, height: 7 }} />
                        <span style={{ color: getStatusOption(selectedContact.status).color, fontWeight: 600 }}>
                          {getStatusOption(selectedContact.status).label}
                        </span>
                      </span>
                      <span>•</span>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>@{selectedContact.username}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <div className="msg-e2e-badge" title="End-to-End Encrypted. Only you and this recipient can decrypt messages.">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <span className="msg-e2e-label">E2EE Active</span>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      setDeleteChatMode('for-me');
                      setDeleteChatModalOpen(true);
                    }}
                    title="Delete this entire conversation"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      color: 'var(--error, #ef4444)',
                      borderColor: 'rgba(239, 68, 68, 0.3)',
                      padding: '5px 9px',
                      fontSize: 12,
                      fontWeight: 600,
                      borderRadius: 8,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    <span>Delete Chat</span>
                  </button>
                </div>
              </div>

              {/* Messages Stream */}
              <div className="msg-stream">
                {messages.length === 0 ? (
                  <div className="msg-empty-chat">
                    <div style={{ fontSize: 32, marginBottom: 8 }}>🔒</div>
                    <div style={{ fontWeight: 600, color: 'var(--neutral-700)', fontSize: 14 }}>
                      End-to-End Encrypted Conversation
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--neutral-400)', maxWidth: 360, marginTop: 4, lineHeight: 1.5 }}>
                      Messages are encrypted on your device and can only be read by you and <strong>{selectedContact.fullName}</strong>.
                      <div style={{ marginTop: 6, fontSize: 11.5 }}>
                        Policy: Edit within 1 hr • Delete for everyone within 24 hrs • Auto-deleted in 30 days.
                      </div>
                    </div>
                  </div>
                ) : (
                  messages.map((m, idx) => {
                    const isMe = m.senderId === currentUser.id;
                    const messageAge = Date.now() - new Date(m.createdAt).getTime();
                    const canEdit = isMe && messageAge <= ONE_HOUR_MS;

                    const showDateHeader =
                      idx === 0 ||
                      formatDateHeader(messages[idx - 1].createdAt) !== formatDateHeader(m.createdAt);

                    return (
                      <div key={m.id} style={{ display: 'contents' }}>
                        {showDateHeader && (
                          <div style={{ textAlign: 'center', margin: '10px 0', fontSize: 11, color: 'var(--neutral-400)', fontWeight: 600 }}>
                            {formatDateHeader(m.createdAt)}
                          </div>
                        )}
                        <div className={`msg-row ${isMe ? 'sent' : 'received'}`}>
                          <div className="msg-bubble-wrap">
                            <div
                              className="msg-bubble"
                              onClick={() => isMe ? setActiveBubbleActionsId(prev => prev === m.id ? null : m.id) : undefined}
                              title={isMe ? "Tap message to view edit/delete actions" : undefined}
                            >
                              <div>{m.text}</div>

                              {/* Linked Task Card if attached */}
                              {m.task && (
                                <div className="msg-task-card" onClick={e => e.stopPropagation()}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: 'var(--brand-700)', marginBottom: 2 }}>
                                    <span>📋</span> LINKED TASK REPORT
                                  </div>
                                  <div className="msg-task-card-title">{m.task.title}</div>
                                  <div className="msg-task-card-meta">
                                    <span className={`badge badge-${m.task.status}`} style={{ fontSize: 10, padding: '1px 6px' }}>
                                      {m.task.status.replace('-', ' ')}
                                    </span>
                                    <span className={`badge badge-${m.task.priority}`} style={{ fontSize: 10, padding: '1px 6px' }}>
                                      {m.task.priority}
                                    </span>
                                    <span style={{ fontSize: 11, color: 'var(--neutral-500)' }}>
                                      Due: {new Date(m.task.dueDate).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    className="msg-task-card-btn"
                                    onClick={() => setViewingTaskReport(m.task!)}
                                  >
                                    <span>📊</span> View Task Report & Progress Notes ({m.task.notes?.length || 0})
                                  </button>
                                </div>
                              )}

                              {/* Meta: E2E indicator, time, edited, read receipts */}
                              <div className="msg-bubble-meta">
                                <span title="End-to-End Encrypted">🔒</span>
                                {m.isEdited && <span style={{ fontStyle: 'italic', opacity: 0.9 }}>(edited)</span>}
                                <span>{formatTime(m.createdAt)}</span>
                                {isMe && (
                                  <span
                                    className={`msg-receipt-badge ${m.read ? 'msg-receipt-seen' : 'msg-receipt-sent'}`}
                                    title={m.read ? 'Seen by recipient' : 'Sent and delivered'}
                                  >
                                    {m.read ? '✓✓ Seen' : '✓ Sent'}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Message Actions */}
                            <div className={`msg-bubble-actions ${activeBubbleActionsId === m.id ? 'active' : ''}`}>
                              {canEdit && (
                                <button
                                  type="button"
                                  className="msg-action-btn"
                                  onClick={() => {
                                    setEditingMessage(m);
                                    setDraft(m.text);
                                    setActiveBubbleActionsId(null);
                                  }}
                                  title="Edit message (available for 1 hour)"
                                >
                                  ✏️ Edit
                                </button>
                              )}
                              <button
                                type="button"
                                className="msg-action-btn delete"
                                onClick={() => {
                                  setDeleteModalMsg(m);
                                  setActiveBubbleActionsId(null);
                                }}
                                title="Delete message"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box */}
              <div className="msg-input-wrap">
                {/* Active Edit Bar */}
                {editingMessage && (
                  <div className="msg-editing-bar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>✏️</span>
                      <span>Editing message (allowed within 1 hour)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingMessage(null);
                        setDraft('');
                      }}
                      style={{ background: 'none', border: 'none', color: 'var(--brand-700)', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
                    >
                      Cancel ✕
                    </button>
                  </div>
                )}

                {/* Linked Task Attachment Pill */}
                {selectedLinkedTask && !editingMessage && (
                  <div className="msg-linked-task-chip">
                    <span>📋</span>
                    <span>Linked Task: <strong>{selectedLinkedTask.title}</strong></span>
                    <button
                      type="button"
                      onClick={() => setSelectedLinkedTask(null)}
                      style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', marginLeft: 'auto', fontWeight: 700 }}
                    >
                      ✕
                    </button>
                  </div>
                )}

                <form onSubmit={handleSendMessage} className="msg-input-row">
                  {/* Link Task Button */}
                  {!editingMessage && (
                    <button
                      type="button"
                      className="msg-attach-btn"
                      onClick={() => setIsTaskPickerOpen(true)}
                      title="Link a Task Report so recipient can view progress notes and reports"
                      aria-label="Link a Task Report"
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                      </svg>
                      <span className="msg-attach-label">Link Task</span>
                    </button>
                  )}

                  <input
                    type="text"
                    className="msg-text-input"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={
                      editingMessage
                        ? 'Update your message…'
                        : `Message ${selectedContact.fullName.split(' ')[0]}…`
                    }
                    disabled={isSending}
                  />
                  <button
                    type="submit"
                    className="msg-send-btn"
                    disabled={!draft.trim() || isSending}
                    aria-label={editingMessage ? 'Save Edit' : 'Send message'}
                    title={editingMessage ? 'Save Edit' : 'Send'}
                  >
                    {editingMessage ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    )}
                  </button>
                </form>

                <div className="msg-input-footer-hint" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div className="msg-security-hint">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <span>AES-GCM 256-bit E2EE • Only you & recipient can read</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--neutral-400)' }}>
                    Auto-deleted after 1 month
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="msg-empty-chat">
              <div style={{ fontSize: 40, marginBottom: 10 }}>🔒</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--neutral-800)', margin: '0 0 6px 0' }}>
                Select a Conversation
              </h3>
              <p style={{ fontSize: 13, color: 'var(--neutral-400)', maxWidth: 360, lineHeight: 1.5 }}>
                Choose a contact from the list on the left or connect with another team member by their exact username.
              </p>
              <button
                type="button"
                className="btn btn-brand btn-sm"
                onClick={() => setIsConnectModalOpen(true)}
                style={{ marginTop: 12 }}
              >
                + Connect by Username
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── 1. Delete Message Modal ── */}
      {deleteModalMsg && (
        <div className="modal-backdrop" onClick={() => setDeleteModalMsg(null)}>
          <div className="modal" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ fontSize: 16 }}>Delete Message</h3>
              <button className="btn-close" onClick={() => setDeleteModalMsg(null)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 13, color: 'var(--neutral-600)', margin: '0 0 16px 0' }}>
                How would you like to delete this message?
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Delete for Me */}
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => handleDeleteMessage('delete-for-me')}
                  disabled={isDeleting}
                  style={{ justifyContent: 'flex-start', padding: '12px 16px', textAlign: 'left' }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>Delete for me</div>
                    <div style={{ fontSize: 11.5, color: 'var(--neutral-400)', marginTop: 2 }}>
                      This message will be removed from your view only.
                    </div>
                  </div>
                </button>

                {/* Delete for Everyone (if sender and within 24h / 1 day) */}
                {deleteModalMsg.senderId === currentUser.id && (Date.now() - new Date(deleteModalMsg.createdAt).getTime()) <= ONE_DAY_MS && (
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => handleDeleteMessage('delete-for-everyone')}
                    disabled={isDeleting}
                    style={{ justifyContent: 'flex-start', padding: '12px 16px', textAlign: 'left', borderColor: 'rgba(239, 68, 68, 0.4)', color: 'var(--error)' }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--error)' }}>Delete for everyone</div>
                      <div style={{ fontSize: 11.5, color: 'var(--neutral-400)', marginTop: 2 }}>
                        Permanently deletes the message for both you and the recipient (allowed within 24 hours).
                      </div>
                    </div>
                  </button>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setDeleteModalMsg(null)} disabled={isDeleting}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. Link Task Picker Modal ── */}
      {isTaskPickerOpen && (
        <div className="modal-backdrop" onClick={() => setIsTaskPickerOpen(false)}>
          <div className="modal" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>📎</span> Select a Task to Link
              </h3>
              <button className="btn-close" onClick={() => setIsTaskPickerOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 12.5, color: 'var(--neutral-500)', margin: '0 0 12px 0' }}>
                Linking a task report embeds an interactive report card directly into your encrypted message so participants can review progress notes.
              </p>

              <div style={{ maxHeight: 260, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {availableTasks.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--neutral-400)', fontSize: 13 }}>
                    No tasks found.
                  </div>
                ) : (
                  availableTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        setSelectedLinkedTask(t);
                        setIsTaskPickerOpen(false);
                      }}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--neutral-200)',
                        background: 'var(--neutral-50)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--neutral-900)' }}>
                        {t.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <span className={`badge badge-${t.status}`} style={{ fontSize: 10, padding: '1px 5px' }}>
                          {t.status.replace('-', ' ')}
                        </span>
                        <span className={`badge badge-${t.priority}`} style={{ fontSize: 10, padding: '1px 5px' }}>
                          {t.priority}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--neutral-400)', marginLeft: 'auto' }}>
                          Due: {new Date(t.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setIsTaskPickerOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 3. View Task Report & Progress Notes Modal ── */}
      {viewingTaskReport && (
        <div className="modal-backdrop" onClick={() => setViewingTaskReport(null)}>
          <div className="modal" style={{ maxWidth: 580 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand-600)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  📊 Task Report & Progress Log
                </div>
                <h3 className="modal-title" style={{ fontSize: 17, marginTop: 2 }}>{viewingTaskReport.title}</h3>
              </div>
              <button className="btn-close" onClick={() => setViewingTaskReport(null)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="modal-body">
              {/* Badges */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                <span className={`badge badge-${viewingTaskReport.status}`}>{viewingTaskReport.status.replace('-', ' ')}</span>
                <span className={`badge badge-${viewingTaskReport.priority}`}>{viewingTaskReport.priority}</span>
              </div>

              {/* Description */}
              {viewingTaskReport.description && (
                <div style={{ fontSize: 13.5, color: 'var(--neutral-700)', lineHeight: 1.6, marginBottom: 16 }}>
                  {viewingTaskReport.description}
                </div>
              )}

              {/* Meta details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '12px 14px', background: 'var(--neutral-50)', borderRadius: 'var(--radius-md)', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--neutral-400)', fontWeight: 600 }}>DUE DATE</div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{new Date(viewingTaskReport.dueDate).toLocaleDateString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--neutral-400)', fontWeight: 600 }}>ASSIGNED BY</div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{viewingTaskReport.assignedBy?.fullName || '—'}</div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: 11, color: 'var(--neutral-400)', fontWeight: 600 }}>ASSIGNEES</div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>
                    {viewingTaskReport.assignees?.map((a) => a.fullName).join(', ') || '—'}
                  </div>
                </div>
              </div>

              {/* Notes & Progress Log */}
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--neutral-800)', marginBottom: 8 }}>
                Progress Updates & Comments ({viewingTaskReport.notes?.length || 0})
              </div>
              {(!viewingTaskReport.notes || viewingTaskReport.notes.length === 0) ? (
                <div style={{ padding: '14px', background: 'var(--neutral-50)', borderRadius: 'var(--radius-md)', color: 'var(--neutral-400)', fontSize: 12.5 }}>
                  No progress updates logged for this task yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 180, overflowY: 'auto' }}>
                  {viewingTaskReport.notes.map((n, i) => (
                    <div key={i} style={{ padding: '8px 12px', background: 'var(--neutral-50)', border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius-md)', fontSize: 12.5, color: 'var(--neutral-800)' }}>
                      {n}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setViewingTaskReport(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. Connect by Exact Username Modal ── */}
      {isConnectModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsConnectModalOpen(false)}>
          <div className="modal msg-connect-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>🔍</span> Connect by Exact Username
              </h3>
              <button className="btn-close" onClick={() => setIsConnectModalOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <p style={{ fontSize: 12.5, color: 'var(--neutral-500)', lineHeight: 1.5, marginBottom: 16 }}>
              {currentUser.role === 'admin'
                ? 'Enter any user or moderator username to immediately open an encrypted conversation.'
                : currentUser.role === 'moderator'
                ? 'To message another moderator or staff outside your assigned team, enter their exact username below.'
                : 'To message a user or moderator outside your assigned group, enter their exact username below.'}
            </p>

            <form onSubmit={handleConnectByUsername}>
              <div className="field">
                <label className="label">Exact Username</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-400)', fontWeight: 600 }}>
                    @
                  </span>
                  <input
                    type="text"
                    className="input"
                    style={{ paddingLeft: 30 }}
                    value={targetUsernameInput}
                    onChange={(e) => setTargetUsernameInput(e.target.value)}
                    placeholder="e.g. john.doe"
                    autoFocus
                  />
                </div>
              </div>

              {connectError && (
                <div style={{ color: 'var(--error, #ef4444)', fontSize: 12, marginBottom: 12 }}>
                  ⚠️ {connectError}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsConnectModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-brand"
                  disabled={!targetUsernameInput.trim() || isSearchingUser}
                >
                  {isSearchingUser ? 'Searching…' : 'Find & Open Chat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 5. Delete Chat Confirmation Modal ── */}
      {deleteChatModalOpen && selectedContact && (
        <div
          className="modal-backdrop"
          onClick={() => setDeleteChatModalOpen(false)}
          style={{
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            background: 'rgba(15, 23, 42, 0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            zIndex: 1100,
          }}
        >
          <div
            className="modal"
            style={{
              maxWidth: 440,
              width: '100%',
              borderRadius: 20,
              padding: '24px 24px 20px',
              border: '1px solid var(--border-color)',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
              background: 'var(--bg-surface)',
              position: 'relative',
              animation: 'fadeInDown 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              className="btn-close"
              onClick={() => setDeleteChatModalOpen(false)}
              style={{ position: 'absolute', top: 18, right: 18 }}
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            {/* Glowing Trash Icon */}
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.22)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ef4444',
                marginBottom: 16,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 6px 0', color: 'var(--neutral-900)' }}>
              Delete Conversation
            </h3>

            <p style={{ fontSize: 13, color: 'var(--neutral-500)', lineHeight: 1.5, margin: '0 0 18px 0' }}>
              Messages with <strong>{selectedContact.fullName}</strong> (@{selectedContact.username}) will be removed. Choose how you want to delete this chat.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
              {/* Option 1: Delete for me */}
              <div
                onClick={() => setDeleteChatMode('for-me')}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 12,
                  cursor: 'pointer',
                  border: deleteChatMode === 'for-me' ? '2px solid var(--brand-500)' : '1.5px solid var(--border-color)',
                  background: deleteChatMode === 'for-me' ? 'rgba(99, 102, 241, 0.06)' : 'var(--bg-surface-sub)',
                  transition: 'all 0.15s ease',
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: deleteChatMode === 'for-me' ? '5px solid var(--brand-600)' : '2px solid var(--neutral-400)',
                    background: '#ffffff',
                    marginTop: 2,
                    flexShrink: 0,
                    transition: 'all 0.15s ease',
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--neutral-900)' }}>
                    Delete for me
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--neutral-500)', marginTop: 2, lineHeight: 1.4 }}>
                    Clears the message history on your device only. {selectedContact.fullName.split(' ')[0]} keeps their copy.
                  </div>
                </div>
              </div>

              {/* Option 2: Delete for everyone */}
              <div
                onClick={() => setDeleteChatMode('for-everyone')}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 12,
                  cursor: 'pointer',
                  border: deleteChatMode === 'for-everyone' ? '2px solid #ef4444' : '1.5px solid var(--border-color)',
                  background: deleteChatMode === 'for-everyone' ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-surface-sub)',
                  transition: 'all 0.15s ease',
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: deleteChatMode === 'for-everyone' ? '5px solid #ef4444' : '2px solid var(--neutral-400)',
                    background: '#ffffff',
                    marginTop: 2,
                    flexShrink: 0,
                    transition: 'all 0.15s ease',
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#ef4444' }}>
                    Delete for everyone
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--neutral-500)', marginTop: 2, lineHeight: 1.4 }}>
                    Permanently purges all messages in this conversation for both you and {selectedContact.fullName.split(' ')[0]}.
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, alignItems: 'center' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setDeleteChatModalOpen(false)}
                disabled={isDeletingChat}
                style={{ padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteChat}
                disabled={isDeletingChat}
                style={{
                  background: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: 13,
                  padding: '8px 18px',
                  borderRadius: 10,
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {isDeletingChat ? (
                  <span>Deleting…</span>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    <span>Delete Chat</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
