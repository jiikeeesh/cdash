'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../lib/auth-context';
import UserStatusPicker, { USER_STATUS_OPTIONS, getStatusOption } from '../../components/UserStatusPicker';

// ── Types ──────────────────────────────────────────────────────────────────
type CalView = 'month' | 'week' | 'day';
type TaskStatus = 'pending' | 'in-progress' | 'review' | 'done' | 'requested';
type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

interface Task {
  id: string; title: string; description: string;
  assigneeIds: string[]; assignedById: string;
  assignedByName?: string; assignedByRole?: string;
  status: TaskStatus; priority: TaskPriority;
  busyness?: string;
  dueDate: string; createdAt: string; updatedAt: string; notes: string[];
}
interface CalUser { id: string; fullName: string; username: string; role: string; createdBy?: string; department?: string; email?: string; }

// ── Helpers ────────────────────────────────────────────────────────────────
function toDateStr(d: Date): string { return d.toISOString().slice(0, 10); }

function getTasksForDate(tasks: Task[], dateStr: string): Task[] {
  return tasks.filter(t => t.dueDate.slice(0, 10) === dateStr);
}

function priorityColor(p: TaskPriority): string {
  const map: Record<TaskPriority, string> = {
    critical: '#ef4444', high: '#f97316', medium: '#eab308', low: '#22c55e'
  };
  return map[p];
}

function statusLabel(s: TaskStatus): string {
  const map: Record<TaskStatus, string> = {
    pending: 'Pending', 'in-progress': 'In Progress', review: 'Review', done: 'Done', requested: 'Requested'
  };
  return map[s] || s;
}

function statusColor(s: TaskStatus): string {
  const map: Record<TaskStatus, string> = {
    pending: '#94a3b8', 'in-progress': '#3b82f6', review: '#f59e0b', done: '#10b981', requested: '#8b5cf6'
  };
  return map[s] || '#94a3b8';
}

// Get 42 days for month view (Mon-Sun grid, always 6 rows)
function getMonthDays(year: number, month: number): Date[] {
  const startDay = (new Date(year, month, 1).getDay() + 6) % 7; // 0=Mon
  return Array.from({ length: 42 }, (_, i) => new Date(year, month, 1 - startDay + i));
}

// Get Mon-Sun week days for a given date
function getWeekDays(date: Date): Date[] {
  const d = new Date(date);
  const offset = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - offset);
  return Array.from({ length: 7 }, (_, i) => { const nd = new Date(d); nd.setDate(d.getDate() + i); return nd; });
}

// Time slots 06:00–22:00
const TIME_SLOTS = Array.from({ length: 17 }, (_, i) => i + 6);

function formatHour(h: number): string {
  if (h === 12) return '12 PM';
  if (h === 0) return '12 AM';
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

// ── Toast ──────────────────────────────────────────────────────────────────
interface ToastMsg { id: number; text: string; type: 'success' | 'error'; }

// ── Task Drawer ────────────────────────────────────────────────────────────
function TaskDrawer({ task, open, onClose, users, currentUserRole, onStatusUpdate, onEdit }: {
  task: Task | null; open: boolean; onClose: () => void;
  users: CalUser[];
  currentUserRole?: string;
  onStatusUpdate: (task: Task, status: TaskStatus, note: string) => void;
  onEdit: (task: Task) => void;
}) {
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (task) { setStatus(task.status); setNote(''); }
  }, [task]);

  if (!task && !open) return null;

  const assignees = task ? task.assigneeIds.map(id => users.find(u => u.id === id)?.fullName ?? '—').join(', ') : '';
  const assigner = task ? (task.assignedByName || users.find(u => u.id === task.assignedById)?.fullName || '—') : '';
  const dueFormatted = task ? new Date(task.dueDate).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }) : '';
  const isOverdue = task ? (new Date(task.dueDate) < new Date() && task.status !== 'done' && task.status !== 'requested') : false;
  const isRequested = task?.status === 'requested';
  const canManage = currentUserRole !== 'user';

  return (
    <>
      {open && <div className="cal-drawer-backdrop" onClick={onClose} />}
      <div className={`cal-drawer ${open ? 'open' : ''}`} role="dialog" aria-modal="true">
        {task && (
          <>
            <div className="cal-drawer-header">
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                    background: priorityColor(task.priority) + '20',
                    color: priorityColor(task.priority),
                    border: `1px solid ${priorityColor(task.priority)}40`,
                    textTransform: 'uppercase', letterSpacing: '0.5px'
                  }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: priorityColor(task.priority), display: 'inline-block' }} />
                    {task.priority}
                  </span>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                    background: statusColor(task.status) + '20',
                    color: statusColor(task.status),
                    border: `1px solid ${statusColor(task.status)}40`,
                  }}>
                    {statusLabel(task.status)}
                  </span>
                  {isOverdue && (
                    <span style={{ padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                      ⚠ Overdue
                    </span>
                  )}
                </div>
                <div className="cal-drawer-title">{task.title}</div>
              </div>
              <button className="btn-close" onClick={onClose} aria-label="Close drawer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div className="cal-drawer-body">
              {/* Task Request Action Banner for Moderators / Admins */}
              {isRequested && canManage && (
                <div style={{
                  background: 'rgba(139, 92, 246, 0.08)',
                  border: '1.5px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  marginBottom: 18,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--neutral-900)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>📩</span> Task Request from User
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--neutral-600)', marginBottom: 12, lineHeight: 1.5 }}>
                    This task was proposed by <strong>{assignees}</strong>. You can approve and schedule it into your team deliverables, or decline if not feasible.
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      className="btn btn-brand btn-sm"
                      onClick={() => onStatusUpdate(task, 'pending', 'Task request approved and scheduled by moderator')}
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      ✓ Approve Task
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => onStatusUpdate(task, 'done', 'Task request declined')}
                      style={{ color: 'var(--error)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                    >
                      ✕ Decline
                    </button>
                  </div>
                </div>
              )}

              {/* Task Request Info Banner for Regular Users */}
              {isRequested && !canManage && (
                <div style={{
                  background: 'rgba(139, 92, 246, 0.08)',
                  border: '1px solid rgba(139, 92, 246, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}>
                  <span style={{ fontSize: 18 }}>⏳</span>
                  <div style={{ fontSize: 12.5, color: 'var(--neutral-700)', lineHeight: 1.4 }}>
                    <strong>Awaiting Moderator Review:</strong> Your task request was submitted to <strong>{assigner}</strong> and is waiting for approval.
                  </div>
                </div>
              )}

              {/* Description */}
              {task.description && (
                <div className="cal-drawer-section">
                  <div className="cal-drawer-section-label">Description</div>
                  <div className="cal-drawer-value" style={{ lineHeight: 1.6 }}>{task.description}</div>
                </div>
              )}

              {/* Meta grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
                <div>
                  <div className="cal-drawer-section-label">Due Date</div>
                  <div className="cal-drawer-value" style={{ color: isOverdue ? '#ef4444' : undefined }}>
                    {dueFormatted}
                  </div>
                </div>
                <div>
                  <div className="cal-drawer-section-label">Assigned By / Moderator</div>
                  <div className="cal-drawer-value">{assigner}</div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <div className="cal-drawer-section-label">Assignees</div>
                  <div className="cal-drawer-value">{assignees || '—'}</div>
                </div>
              </div>

              {/* Notes */}
              {task.notes.length > 0 && (
                <div className="cal-drawer-section">
                  <div className="cal-drawer-section-label">Comments & Notes</div>
                  {task.notes.map((n, i) => (
                    <div key={i} className="cal-note-item">{n}</div>
                  ))}
                </div>
              )}

              {/* Divider */}
              <div style={{ height: 1, background: 'var(--border-color)', margin: '18px 0' }} />

              {/* Update status */}
              <div className="cal-drawer-section-label" style={{ marginBottom: 10 }}>Update Progress</div>
              {isRequested && !canManage ? (
                <div style={{ fontSize: 13, color: 'var(--neutral-500)', fontStyle: 'italic', marginBottom: 14 }}>
                  Status cannot be modified while awaiting moderator review.
                </div>
              ) : (
                <div className="field">
                  <label className="label">Change Status</label>
                  <select className="select" value={status} onChange={e => setStatus(e.target.value as TaskStatus)}>
                    {isRequested && <option value="requested">⏳ Requested</option>}
                    <option value="pending">⏳ Pending</option>
                    <option value="in-progress">🔄 In Progress</option>
                    <option value="review">👁️ In Review</option>
                    <option value="done">✅ Done</option>
                  </select>
                </div>
              )}
              <div className="field">
                <label className="label">Add a Comment</label>
                <textarea className="textarea" rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note or progress update…" />
              </div>
              <button
                className="btn btn-brand"
                style={{ width: '100%' }}
                onClick={() => onStatusUpdate(task, isRequested && !canManage ? 'requested' : status, note)}
                disabled={(isRequested && !canManage && !note.trim()) || (!isRequested && status === task.status && !note.trim())}
              >
                {isRequested && !canManage ? 'Post Comment' : 'Update Status'}
              </button>
            </div>

            <div className="cal-drawer-footer">
              {canManage && (
                <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => onEdit(task)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Edit Task
                </button>
              )}
              <button className="btn btn-outline" style={{ flex: canManage ? 0 : 1 }} onClick={onClose}>Close</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ── Quick Add / Edit Modal (Outlook Event Details Style) ───────────────────
interface QuickAddForm {
  title: string;
  description: string;
  location?: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  allDay: boolean;
  isPrivate: boolean;
  repeat: string;
  reminder: string;
  showAs: string;
  busyness?: string;
  syncMyStatus?: boolean;
  priority: TaskPriority;
  status: TaskStatus;
  assigneeIds: string[];
  assignedById?: string;
  isRequest?: boolean;
}

const TIME_OPTIONS = [
  '12:00 AM', '12:30 AM', '01:00 AM', '01:30 AM', '02:00 AM', '02:30 AM',
  '03:00 AM', '03:30 AM', '04:00 AM', '04:30 AM', '05:00 AM', '05:30 AM',
  '06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM',
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
  '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM',
  '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM'
];

function timeTo24(timeStr: string): string {
  const [t, modifier] = (timeStr || '10:30 AM').split(' ');
  let [hours, minutes] = t.split(':');
  if (hours === '12') hours = '00';
  if (modifier === 'PM') hours = String(parseInt(hours, 10) + 12);
  return `${hours.padStart(2, '0')}:${minutes}:00`;
}

function TaskFormModal({ initialDate, initialTask, initialMode, users, currentUser, onClose, onSave }: {
  initialDate?: string;
  initialTask?: Task;
  initialMode?: 'create' | 'moderator-request';
  users: CalUser[];
  currentUser: { id: string; role: string; fullName: string; createdBy?: string };
  onClose: () => void;
  onSave: (form: QuickAddForm) => void;
}) {
  const isRegularUser = currentUser.role === 'user';
  const isModerator = currentUser.role === 'moderator';
  const isAdmin = currentUser.role === 'admin';

  // Moderator has two modes:
  // 1. 'team' -> assign their own users directly
  // 2. 'request-admin' -> request admin to assign another moderator
  const [modWorkflowMode, setModWorkflowMode] = useState<'team' | 'request-admin'>(
    initialMode === 'moderator-request' ? 'request-admin' : 'team'
  );

  const isRequestMode = isRegularUser || (isModerator && modWorkflowMode === 'request-admin');

  // Comma-separated manager IDs assigned to this user
  const assignedManagerIds = currentUser.createdBy
    ? currentUser.createdBy.split(',').filter(Boolean)
    : [];

  // Candidate admins
  const admins = users.filter(u => u.role === 'admin');

  // Candidate moderators for regular users:
  // ONLY show their assigned moderators (NEVER ADMINS)
  const userAssignedModerators = users.filter(u => u.role === 'moderator' && assignedManagerIds.includes(u.id));
  const fallbackModerators = userAssignedModerators.length > 0
    ? userAssignedModerators
    : users.filter(u => u.role === 'moderator');

  // Target request recipients
  const requestTargets = isModerator && modWorkflowMode === 'request-admin'
    ? admins
    : isRegularUser
    ? fallbackModerators
    : [];

  const [selectedTargetId, setSelectedTargetId] = useState<string>(
    initialTask?.assignedById ||
    (isModerator && modWorkflowMode === 'request-admin'
      ? admins[0]?.id || ''
      : isRegularUser
      ? (fallbackModerators[0]?.id || '')
      : currentUser.id)
  );

  // Parse initial date & time
  const defaultDateStr = initialTask?.dueDate ? initialTask.dueDate.slice(0, 10) : (initialDate || toDateStr(new Date()));
  const [title, setTitle] = useState(initialTask?.title ?? '');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(defaultDateStr);
  const [startTime, setStartTime] = useState('10:30 AM');
  const [endDate, setEndDate] = useState(defaultDateStr);
  const [endTime, setEndTime] = useState('11:00 AM');
  const [allDay, setAllDay] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [repeat, setRepeat] = useState('Never');
  const [saveToCalendar, setSaveToCalendar] = useState('Calendar');
  const [reminder, setReminder] = useState('15 minutes');
  const [showAs, setShowAs] = useState(initialTask?.busyness ?? 'busy');
  const [syncMyStatus, setSyncMyStatus] = useState(false);
  const [priority, setPriority] = useState<TaskPriority>(initialTask?.priority ?? 'medium');
  const [description, setDescription] = useState(initialTask?.description ?? '');
  const [assigneeSearch, setAssigneeSearch] = useState('');
  const [assigneeRoleFilter, setAssigneeRoleFilter] = useState<'all' | 'moderator' | 'user' | 'admin'>('all');

  // Extract location if present in description
  useEffect(() => {
    if (initialTask?.description) {
      const locMatch = initialTask.description.match(/^📍 Location:\s*([^\n]+)/);
      if (locMatch) {
        setLocation(locMatch[1].trim());
        setDescription(initialTask.description.replace(/^📍 Location:[^\n]*\n\n?/, ''));
      }
    }
  }, [initialTask]);

  // Assignable users pool:
  // - Admin: can add/assign all people (admins, moderators, staff users)
  // - Moderator in 'team' mode: can ONLY assign themselves and their own users
  // - Moderator in 'request-admin' mode: can select other moderators & users they wish admin to schedule
  // - Regular User: cannot assign others (assigned to themselves)
  const assignablePool = isAdmin
    ? users
    : isModerator && modWorkflowMode === 'team'
    ? users.filter(u => u.id === currentUser.id || (u.role === 'user' && u.createdBy?.includes(currentUser.id)))
    : isModerator && modWorkflowMode === 'request-admin'
    ? users.filter(u => u.id !== currentUser.id) // Target team members / moderators for admin to assign
    : [];

  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<string[]>(
    isRegularUser
      ? [currentUser.id]
      : initialTask?.assigneeIds && initialTask.assigneeIds.length > 0
      ? initialTask.assigneeIds
      : [currentUser.id]
  );

  const [submitted, setSubmitted] = useState(false);

  const toggleAssignee = (id: string) => {
    if (isRegularUser) return;
    setSelectedAssigneeIds(p =>
      p.includes(id) ? p.filter(x => x !== id) : [...p, id]
    );
  };

  const selectAllAssignees = () => {
    if (isRegularUser) return;
    const ids = filteredAssignable.map(u => u.id);
    setSelectedAssigneeIds(Array.from(new Set([...selectedAssigneeIds, ...ids])));
  };

  const clearAssignees = () => {
    if (isRegularUser) return;
    setSelectedAssigneeIds([]);
  };

  const filteredAssignable = assignablePool.filter(u => {
    const matchesRole = assigneeRoleFilter === 'all' ? true : u.role === assigneeRoleFilter;
    const q = assigneeSearch.trim().toLowerCase();
    const matchesSearch = !q ||
      u.fullName.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      (u.department && u.department.toLowerCase().includes(q));
    return matchesRole && matchesSearch;
  });

  // Formatting helper for description
  const appendFormat = (tag: string) => {
    setDescription(prev => {
      if (tag === 'bold') return prev + ' **bold text** ';
      if (tag === 'italic') return prev + ' *italic text* ';
      if (tag === 'underline') return prev + ' <u>underlined</u> ';
      if (tag === 'bullet') return prev + '\n- Item 1\n- Item 2';
      if (tag === 'number') return prev + '\n1. First item\n2. Second item';
      if (tag === 'image') return prev + '\n[Image: insert url or description]\n';
      if (tag === 'emoji') return prev + ' 😊 ';
      return prev;
    });
  };

  const handleSave = () => {
    setSubmitted(true);
    if (!title.trim() || !startDate) return;

    let finalAssignees = selectedAssigneeIds;
    let finalAssignedById = currentUser.id;
    let finalStatus: TaskStatus = initialTask?.status ?? 'pending';

    if (isRegularUser) {
      if (!selectedTargetId) return;
      finalAssignees = [currentUser.id];
      finalAssignedById = selectedTargetId;
      finalStatus = 'requested';
    } else if (isModerator && modWorkflowMode === 'request-admin') {
      if (!selectedTargetId) return;
      finalAssignedById = selectedTargetId;
      finalStatus = 'requested';
      if (finalAssignees.length === 0) finalAssignees = [currentUser.id];
    } else {
      if (finalAssignees.length === 0) finalAssignees = [currentUser.id];
    }

    const formattedDesc = location.trim()
      ? `📍 Location: ${location.trim()}\n\n${description.trim()}`
      : description.trim();

    onSave({
      title: title.trim(),
      description: formattedDesc,
      location: location.trim(),
      startDate,
      startTime,
      endDate,
      endTime,
      allDay,
      isPrivate,
      repeat,
      reminder,
      showAs,
      busyness: showAs,
      syncMyStatus,
      priority,
      status: finalStatus,
      assigneeIds: finalAssignees,
      assignedById: finalAssignedById,
      isRequest: isRequestMode,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="outlook-modal-card" onClick={e => e.stopPropagation()}>
        {/* Ribbon action bar */}
        <div className="outlook-ribbon-bar">
          <div className="outlook-ribbon-group">
            <button type="button" className="outlook-ribbon-btn primary-save" onClick={handleSave}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              Save
            </button>
            <button type="button" className="outlook-ribbon-btn danger-discard" onClick={onClose}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
              Discard
            </button>
            <button type="button" className="outlook-ribbon-btn" onClick={() => appendFormat('image')} title="Attach a file or link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              Attach
            </button>
            <div style={{ position: 'relative', display: 'inline-flex' }}>
              <select
                className="outlook-ribbon-btn"
                style={{ paddingRight: 22, appearance: 'none', background: 'transparent' }}
                value={priority}
                onChange={e => setPriority(e.target.value as TaskPriority)}
              >
                <option value="low">🏷️ Low Priority</option>
                <option value="medium">🏷️ Medium Priority</option>
                <option value="high">🏷️ High Priority</option>
                <option value="critical">🏷️ Critical Priority</option>
              </select>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <button className="btn-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="outlook-modal-body">
          {/* Header Row */}
          <div className="outlook-header-row">
            <h2 className="outlook-details-title">Details</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {isRequestMode ? (
                <span className="badge badge-moderator" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6', borderColor: 'rgba(139, 92, 246, 0.3)', fontWeight: 600 }}>
                  ⏳ Event Request
                </span>
              ) : (
                <span className="badge" style={{ background: 'var(--brand-50)', color: 'var(--brand-700)', borderColor: 'var(--brand-200)', fontWeight: 600 }}>
                  📅 Event
                </span>
              )}
            </div>
          </div>

          {/* Title Input */}
          <div>
            <input
              type="text"
              className="outlook-input-clean outlook-title-input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Add a title for the event"
              style={submitted && !title.trim() ? { borderColor: 'var(--error)' } : undefined}
            />
            {submitted && !title.trim() && (
              <div style={{ color: 'var(--error)', fontSize: 12, marginTop: 4 }}>Title is required</div>
            )}
          </div>

          {/* Location Input */}
          <div>
            <input
              type="text"
              className="outlook-input-clean"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Add a location or a room"
            />
          </div>

          {/* ── Role Delegation & Attendees Section ── */}
          <div className="outlook-delegation-box">
            {/* 1. Moderator Workflow Mode Selector */}
            {isModerator && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 14, borderBottom: '1px solid var(--neutral-200)', paddingBottom: 10 }}>
                <button
                  type="button"
                  className={`outlook-role-tab-btn ${modWorkflowMode === 'team' ? 'active' : ''}`}
                  onClick={() => {
                    setModWorkflowMode('team');
                    setSelectedAssigneeIds([currentUser.id]);
                  }}
                >
                  ⚡ Assign My Users
                </button>
                <button
                  type="button"
                  className={`outlook-role-tab-btn ${modWorkflowMode === 'request-admin' ? 'active' : ''}`}
                  onClick={() => {
                    setModWorkflowMode('request-admin');
                    setSelectedTargetId(admins[0]?.id || '');
                  }}
                >
                  👑 Request Admin (Assign Other Moderator)
                </button>
              </div>
            )}

            {/* 2. Regular User: Request Assigned Moderator ONLY (Admins NOT shown) */}
            {isRegularUser && (
              <div>
                <label className="label" style={{ fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>⚡</span> Select Moderator to Request From <span style={{ color: 'var(--error)' }}>*</span>
                </label>
                <select
                  className="select"
                  value={selectedTargetId}
                  onChange={e => setSelectedTargetId(e.target.value)}
                  style={{ width: '100%', marginTop: 4 }}
                >
                  {fallbackModerators.length === 0 ? (
                    <option value="">No moderators available</option>
                  ) : (
                    fallbackModerators.map(m => (
                      <option key={m.id} value={m.id}>
                        ⚡ {m.fullName} (@{m.username}) {assignedManagerIds.includes(m.id) ? '— (Your Assigned Moderator)' : ''}
                      </option>
                    ))
                  )}
                </select>
                <div style={{ fontSize: 12, color: 'var(--neutral-500)', marginTop: 6, lineHeight: 1.4 }}>
                  Your event request will be sent exclusively to your assigned moderator for review and scheduling.
                </div>
              </div>
            )}

            {/* 3. Moderator Requesting Admin for cross-moderator event */}
            {isModerator && modWorkflowMode === 'request-admin' && (
              <div>
                <label className="label" style={{ fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>👑</span> Select Admin to Request From <span style={{ color: 'var(--error)' }}>*</span>
                </label>
                <select
                  className="select"
                  value={selectedTargetId}
                  onChange={e => setSelectedTargetId(e.target.value)}
                  style={{ width: '100%', marginTop: 4, marginBottom: 12 }}
                >
                  {admins.length === 0 ? (
                    <option value="">No admins available</option>
                  ) : (
                    admins.map(a => (
                      <option key={a.id} value={a.id}>
                        👑 {a.fullName} (@{a.username}) — Primary Administrator
                      </option>
                    ))
                  )}
                </select>
                <div style={{ fontSize: 12, color: 'var(--neutral-500)', marginBottom: 12 }}>
                  To collaborate with or assign another moderator, submit this request to the Admin for approval.
                </div>

                <label className="label" style={{ fontWeight: 600, fontSize: 13 }}>
                  Select Collaborating Moderator(s) or Staff to Include
                </label>
                <div style={{ maxHeight: 130, overflowY: 'auto', border: '1px solid var(--neutral-300)', borderRadius: 6, background: 'var(--neutral-0)', padding: '4px 0' }}>
                  {users.filter(u => u.id !== currentUser.id).map(u => (
                    <div
                      key={u.id}
                      onClick={() => toggleAssignee(u.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px', cursor: 'pointer',
                        background: selectedAssigneeIds.includes(u.id) ? 'var(--brand-50)' : 'transparent',
                      }}
                    >
                      <input type="checkbox" checked={selectedAssigneeIds.includes(u.id)} readOnly style={{ pointerEvents: 'none' }} />
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--neutral-800)' }}>{u.fullName}</span>
                      <span className={`badge badge-${u.role}`} style={{ fontSize: 10, marginLeft: 'auto', padding: '1px 6px' }}>
                        {u.role === 'admin' ? '👑 Admin' : u.role === 'moderator' ? '⚡ Moderator' : '👤 Staff'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Admin (Can add all people) OR Moderator (Can assign their users) */}
            {((isAdmin) || (isModerator && modWorkflowMode === 'team')) && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label className="label" style={{ margin: 0, fontWeight: 600, fontSize: 13 }}>
                    Attendees / Assigned Users <span style={{ color: 'var(--error)' }}>*</span>
                    <span className="badge" style={{ marginLeft: 8, fontSize: 11, padding: '2px 8px', background: 'var(--brand-50)', color: 'var(--brand-700)' }}>
                      {selectedAssigneeIds.length} Selected
                    </span>
                  </label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button type="button" onClick={selectAllAssignees} className="btn btn-outline btn-sm" style={{ padding: '2px 8px', fontSize: 11 }}>
                      Select All
                    </button>
                    {selectedAssigneeIds.length > 0 && (
                      <button type="button" onClick={clearAssignees} className="btn btn-outline btn-sm" style={{ padding: '2px 8px', fontSize: 11, color: 'var(--error)' }}>
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Search & Filters */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    className="outlook-input-clean"
                    style={{ flex: 1, padding: '6px 10px', fontSize: 12.5 }}
                    placeholder="Search people by name or email…"
                    value={assigneeSearch}
                    onChange={e => setAssigneeSearch(e.target.value)}
                  />
                  {isAdmin && (
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button type="button" className={`outlook-role-tab-btn ${assigneeRoleFilter === 'all' ? 'active' : ''}`} style={{ padding: '4px 8px', fontSize: 11 }} onClick={() => setAssigneeRoleFilter('all')}>All</button>
                      <button type="button" className={`outlook-role-tab-btn ${assigneeRoleFilter === 'moderator' ? 'active' : ''}`} style={{ padding: '4px 8px', fontSize: 11 }} onClick={() => setAssigneeRoleFilter('moderator')}>⚡ Mod</button>
                      <button type="button" className={`outlook-role-tab-btn ${assigneeRoleFilter === 'user' ? 'active' : ''}`} style={{ padding: '4px 8px', fontSize: 11 }} onClick={() => setAssigneeRoleFilter('user')}>👤 Staff</button>
                    </div>
                  )}
                </div>

                {/* Multi-select Attendees Grid */}
                <div style={{ maxHeight: 140, overflowY: 'auto', border: '1px solid var(--neutral-300)', borderRadius: 6, background: 'var(--neutral-0)', padding: '4px 0' }}>
                  {filteredAssignable.length === 0 ? (
                    <div style={{ padding: '12px', textAlign: 'center', color: 'var(--neutral-400)', fontSize: 12 }}>
                      No team members found
                    </div>
                  ) : (
                    filteredAssignable.map(u => {
                      const isSelected = selectedAssigneeIds.includes(u.id);
                      return (
                        <div
                          key={u.id}
                          onClick={() => toggleAssignee(u.id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px', cursor: 'pointer',
                            background: isSelected ? 'var(--brand-50)' : 'transparent',
                            transition: 'background 0.15s',
                          }}
                        >
                          <input type="checkbox" checked={isSelected} readOnly style={{ pointerEvents: 'none' }} />
                          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--neutral-800)' }}>
                            {u.fullName} {u.id === currentUser.id ? '(You)' : ''}
                          </div>
                          <span className={`badge badge-${u.role}`} style={{ fontSize: 10, marginLeft: 'auto', padding: '1px 6px' }}>
                            {u.role === 'admin' ? '👑 Admin' : u.role === 'moderator' ? '⚡ Moderator' : '👤 Staff'}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Start & End Date / Time ── */}
          <div className="outlook-datetime-grid">
            <div className="outlook-dt-field">
              <span className="outlook-dt-label">Start</span>
              <div className="outlook-dt-input-group">
                <input
                  type="date"
                  className="outlook-input-clean"
                  style={{ flex: 1 }}
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                />
                {!allDay && (
                  <select
                    className="select"
                    style={{ width: 115 }}
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                  >
                    {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                )}
              </div>
            </div>

            <div className="outlook-dt-field">
              <span className="outlook-dt-label">End</span>
              <div className="outlook-dt-input-group">
                <input
                  type="date"
                  className="outlook-input-clean"
                  style={{ flex: 1 }}
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                />
                {!allDay && (
                  <select
                    className="select"
                    style={{ width: 115 }}
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                  >
                    {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Checkbox options: All day & Private */}
          <div className="outlook-checkbox-row">
            <label className="outlook-checkbox-label">
              <input
                type="checkbox"
                checked={allDay}
                onChange={e => setAllDay(e.target.checked)}
              />
              All day
            </label>
            <label className="outlook-checkbox-label">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={e => setIsPrivate(e.target.checked)}
              />
              Private
            </label>
          </div>

          {/* Settings Grid: Repeat, Save to calendar, Reminder, Show as */}
          <div className="outlook-options-grid">
            <div className="field" style={{ margin: 0 }}>
              <label className="label" style={{ fontSize: 12, color: 'var(--neutral-500)' }}>Repeat</label>
              <select className="select" value={repeat} onChange={e => setRepeat(e.target.value)}>
                <option value="Never">Never</option>
                <option value="Every day">Every day</option>
                <option value="Every week">Every week</option>
                <option value="Every month">Every month</option>
                <option value="Every year">Every year</option>
              </select>
            </div>

            <div className="field" style={{ margin: 0 }}>
              <label className="label" style={{ fontSize: 12, color: 'var(--neutral-500)' }}>Save to calendar</label>
              <select className="select" value={saveToCalendar} onChange={e => setSaveToCalendar(e.target.value)}>
                <option value="Calendar">Calendar</option>
                <option value="Team Schedule">Team Schedule</option>
              </select>
            </div>

            <div className="field" style={{ margin: 0 }}>
              <label className="label" style={{ fontSize: 12, color: 'var(--neutral-500)' }}>Reminder</label>
              <select className="select" value={reminder} onChange={e => setReminder(e.target.value)}>
                <option value="0 minutes">0 minutes</option>
                <option value="15 minutes">15 minutes</option>
                <option value="30 minutes">30 minutes</option>
                <option value="1 hour">1 hour</option>
                <option value="1 day">1 day</option>
              </select>
            </div>

            <div className="field" style={{ margin: 0 }}>
              <label className="label" style={{ fontSize: 12, color: 'var(--neutral-500)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>Show as (Busyness)</span>
                <span className={`status-dot status-dot-${showAs}`} style={{ width: 8, height: 8 }} />
              </label>
              <select className="select" value={showAs} onChange={e => setShowAs(e.target.value)}>
                {USER_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label} — {opt.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Sync Checkbox */}
          <div style={{ marginTop: 2, padding: '8px 12px', background: 'var(--neutral-50)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-200)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--neutral-700)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={syncMyStatus}
                onChange={e => setSyncMyStatus(e.target.checked)}
                style={{ width: 14, height: 14, accentColor: 'var(--brand-600)', cursor: 'pointer' }}
              />
              <span>Also change my current user status to <strong>{getStatusOption(showAs).label}</strong></span>
            </label>
          </div>

          {/* Add an email reminder hint */}
          <div style={{ fontSize: 12.5, color: 'var(--neutral-500)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>✉️</span>
            <span style={{ cursor: 'pointer', color: 'var(--brand-600)', textDecoration: 'underline' }}>
              Add an email reminder
            </span>
          </div>

          {/* Rich text formatting editor */}
          <div>
            <div className="outlook-editor-toolbar">
              <button type="button" className="outlook-toolbar-btn" onClick={() => appendFormat('image')} title="Insert Image">🖼️</button>
              <button type="button" className="outlook-toolbar-btn" onClick={() => appendFormat('emoji')} title="Insert Emoji">😊</button>
              <div className="outlook-toolbar-divider" />
              <button type="button" className="outlook-toolbar-btn" onClick={() => appendFormat('bold')} title="Bold"><strong>B</strong></button>
              <button type="button" className="outlook-toolbar-btn" onClick={() => appendFormat('italic')} title="Italic"><em>I</em></button>
              <button type="button" className="outlook-toolbar-btn" onClick={() => appendFormat('underline')} title="Underline"><u>U</u></button>
              <div className="outlook-toolbar-divider" />
              <button type="button" className="outlook-toolbar-btn" onClick={() => appendFormat('bullet')} title="Bullet List">📄</button>
              <button type="button" className="outlook-toolbar-btn" onClick={() => appendFormat('number')} title="Numbered List">🔢</button>
            </div>
            <textarea
              className="outlook-textarea-box"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add description, meeting agenda, or notes for participants…"
              rows={4}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Calendar Sidebar ───────────────────────────────────────────────────────
function CalSidebar({ tasks, filterStatus, filterPriority, onStatusFilter, onPriorityFilter, today, onTaskClick, onClose }: {
  tasks: Task[];
  filterStatus: TaskStatus | 'all';
  filterPriority: TaskPriority | 'all';
  onStatusFilter: (s: TaskStatus | 'all') => void;
  onPriorityFilter: (p: TaskPriority | 'all') => void;
  today: string;
  onTaskClick: (t: Task) => void;
  onClose?: () => void;
}) {
  const todayDate = new Date(today);
  const in7Days = new Date(todayDate); in7Days.setDate(in7Days.getDate() + 7);

  const upcoming = tasks
    .filter(t => t.status !== 'done' && new Date(t.dueDate) >= todayDate && new Date(t.dueDate) <= in7Days)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const overdue = tasks
    .filter(t => t.status !== 'done' && new Date(t.dueDate) < todayDate)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const requestedTasks = tasks.filter(t => t.status === 'requested');

  const statusOptions: { value: TaskStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'requested', label: '⏳ Requested' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'review', label: 'Review' },
    { value: 'done', label: 'Done' },
  ];
  const priorityOptions: { value: TaskPriority | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'critical', label: '🔴 Critical' },
    { value: 'high', label: '🟠 High' },
    { value: 'medium', label: '🟡 Medium' },
    { value: 'low', label: '🟢 Low' },
  ];

  return (
    <div>
      {onClose && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
          <button className="btn-close" onClick={onClose} aria-label="Close filters">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      )}

      {/* Status filter */}
      <div className="cal-filter-label">Status</div>
      <div className="cal-filter-chips">
        {statusOptions.map(o => (
          <button key={o.value} className={`cal-filter-chip ${filterStatus === o.value ? 'active' : ''}`} onClick={() => onStatusFilter(o.value)}>
            {o.label}
          </button>
        ))}
      </div>

      {/* Priority filter */}
      <div className="cal-filter-label">Priority</div>
      <div className="cal-filter-chips">
        {priorityOptions.map(o => (
          <button key={o.value} className={`cal-filter-chip ${filterPriority === o.value ? 'active' : ''}`} onClick={() => onPriorityFilter(o.value)}>
            {o.label}
          </button>
        ))}
      </div>

      <div style={{ height: 1, background: 'var(--border-color)', margin: '16px 0' }} />

      {/* Task Requests */}
      {requestedTasks.length > 0 && (
        <>
          <div className="cal-filter-label" style={{ color: '#8b5cf6' }}>⏳ Task Requests ({requestedTasks.length})</div>
          {requestedTasks.map(t => (
            <div key={t.id} className="cal-upcoming-item" style={{ background: 'rgba(139, 92, 246, 0.08)', borderColor: 'rgba(139, 92, 246, 0.25)' }} onClick={() => onTaskClick(t)}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#8b5cf6', flexShrink: 0 }} />
              <span className="cal-upcoming-title" style={{ color: '#6d28d9' }}>{t.title}</span>
              <span className="cal-upcoming-date" style={{ color: '#8b5cf6' }}>{new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
          ))}
          <div style={{ height: 1, background: 'var(--border-color)', margin: '12px 0' }} />
        </>
      )}

      {/* Overdue */}
      {overdue.length > 0 && (
        <>
          <div className="cal-filter-label" style={{ color: '#ef4444' }}>⚠ Overdue ({overdue.length})</div>
          {overdue.map(t => (
            <div key={t.id} className="cal-upcoming-item cal-overdue-item" onClick={() => onTaskClick(t)}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} />
              <span className="cal-upcoming-title">{t.title}</span>
              <span className="cal-upcoming-date">{new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
          ))}
          <div style={{ height: 1, background: 'var(--border-color)', margin: '12px 0' }} />
        </>
      )}

      {/* Upcoming 7 days */}
      <div className="cal-filter-label">Upcoming 7 Days ({upcoming.length})</div>
      {upcoming.length === 0 ? (
        <div className="cal-sidebar-empty">No upcoming deadlines 🎉</div>
      ) : (
        upcoming.map(t => (
          <div key={t.id} className="cal-upcoming-item" onClick={() => onTaskClick(t)}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: priorityColor(t.priority), flexShrink: 0 }} />
            <span className="cal-upcoming-title">{t.title}</span>
            <span className="cal-upcoming-date">{new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        ))
      )}
    </div>
  );
}

// ── Month View ─────────────────────────────────────────────────────────────
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function MonthView({ tasks, currentDate, today, onDayClick, onTaskClick }: {
  tasks: Task[]; currentDate: Date; today: string;
  onDayClick: (ds: string) => void; onTaskClick: (t: Task) => void;
}) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = useMemo(() => getMonthDays(year, month), [year, month]);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Day name headers */}
      <div className="cal-month-grid" style={{ flex: 'none' }}>
        {DAY_NAMES.map(d => (
          <div key={d} className="cal-month-day-header">{d}</div>
        ))}
      </div>
      {/* Day cells — scrollable */}
      <div className="cal-month-grid" style={{ flex: 1, overflow: 'auto', gridAutoRows: '1fr' }}>
        {days.map(day => {
          const ds = toDateStr(day);
          const isOtherMonth = day.getMonth() !== month;
          const isToday = ds === today;
          const dayTasks = getTasksForDate(tasks, ds);
          const showAll = expanded === ds;
          const visible = showAll ? dayTasks : dayTasks.slice(0, 3);
          const extra = dayTasks.length - 3;

          return (
            <div
              key={ds}
              className={`cal-day-cell ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`}
              onClick={() => onDayClick(ds)}
            >
              <div className="cal-day-num">{day.getDate()}</div>
              {visible.map(t => (
                <div
                  key={t.id}
                  className={`cal-task-pill priority-${t.priority}`}
                  onClick={e => { e.stopPropagation(); onTaskClick(t); }}
                  title={t.title}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor(t.status), flexShrink: 0 }} />
                  <span className="cal-task-pill-title">{t.title}</span>
                </div>
              ))}
              {!showAll && extra > 0 && (
                <button
                  className="cal-more-link"
                  onClick={e => { e.stopPropagation(); setExpanded(ds); }}
                >
                  +{extra} more
                </button>
              )}
              {showAll && (
                <button
                  className="cal-more-link"
                  onClick={e => { e.stopPropagation(); setExpanded(null); }}
                >
                  Show less
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Week View ──────────────────────────────────────────────────────────────
function WeekView({ tasks, currentDate, today, onSlotClick, onTaskClick }: {
  tasks: Task[]; currentDate: Date; today: string;
  onSlotClick: (ds: string, hour: number) => void; onTaskClick: (t: Task) => void;
}) {
  const days = useMemo(() => getWeekDays(currentDate), [currentDate]);

  return (
    <div className="cal-week-container">
      {/* Header */}
      <div className="cal-week-header-row">
        <div style={{ borderRight: '1px solid var(--border-color)' }} />
        {days.map((day, idx) => {
          const ds = toDateStr(day);
          const isToday = ds === today;
          return (
            <div key={ds} className="cal-week-day-header">
              <div className="cal-week-day-name">{DAY_NAMES[idx]}</div>
              <div className={`cal-week-day-num ${isToday ? 'today' : ''}`}>{day.getDate()}</div>
            </div>
          );
        })}
      </div>

      {/* Time slots */}
      <div style={{ overflow: 'auto', flex: 1 }}>
        <div className="cal-week-time-grid">
          {TIME_SLOTS.map(hour => (
            <div key={`row-${hour}`} style={{ display: 'contents' }}>
              <div className="cal-time-label">{formatHour(hour)}</div>
              {days.map(day => {
                const ds = toDateStr(day);
                const slotTasks = getTasksForDate(tasks, ds).filter(t => {
                  const dueH = new Date(t.dueDate).getHours();
                  const h = dueH === 0 ? 9 : dueH;
                  return h === hour;
                });
                return (
                  <div
                    key={`${ds}-${hour}`}
                    className="cal-week-slot"
                    onClick={() => onSlotClick(ds, hour)}
                  >
                    {slotTasks.map(t => (
                      <div
                        key={t.id}
                        className="cal-week-task-chip"
                        style={{ borderLeftColor: priorityColor(t.priority), background: priorityColor(t.priority) + '15' }}
                        onClick={e => { e.stopPropagation(); onTaskClick(t); }}
                        title={t.title}
                      >
                        {t.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Day View ───────────────────────────────────────────────────────────────
function DayView({ tasks, currentDate, today, onSlotClick, onTaskClick }: {
  tasks: Task[]; currentDate: Date; today: string;
  onSlotClick: (hour: number) => void; onTaskClick: (t: Task) => void;
}) {
  const ds = toDateStr(currentDate);
  const dayTasks = getTasksForDate(tasks, ds);

  const allDayTasks = dayTasks.filter(t => new Date(t.dueDate).getHours() === 0);
  const timedTasks = dayTasks.filter(t => new Date(t.dueDate).getHours() !== 0);

  return (
    <div className="cal-week-container">
      {/* All-day strip */}
      {allDayTasks.length > 0 && (
        <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--neutral-400)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>All Day</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {allDayTasks.map(t => (
              <div
                key={t.id}
                className="cal-week-task-chip"
                style={{ borderLeftColor: priorityColor(t.priority), background: priorityColor(t.priority) + '15' }}
                onClick={() => onTaskClick(t)}
              >
                {t.title}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Time grid */}
      <div style={{ overflow: 'auto', flex: 1 }}>
        <div className="cal-day-time-grid">
          {TIME_SLOTS.map(hour => {
            const slotTasks = timedTasks.filter(t => {
              const h = new Date(t.dueDate).getHours();
              return h === hour;
            });
            return (
              <div key={`dayrow-${hour}`} style={{ display: 'contents' }}>
                <div className="cal-time-label">{formatHour(hour)}</div>
                <div
                  className="cal-week-slot"
                  style={{ borderLeft: 'none', padding: '4px 12px' }}
                  onClick={() => onSlotClick(hour)}
                >
                  {slotTasks.map(t => (
                    <div
                      key={t.id}
                      className="cal-day-task-block"
                      style={{ borderLeftColor: priorityColor(t.priority) }}
                      onClick={e => { e.stopPropagation(); onTaskClick(t); }}
                    >
                      <div className="cal-day-task-title">{t.title}</div>
                      <div className="cal-day-task-meta">
                        <span style={{ fontSize: 11, fontWeight: 600, color: priorityColor(t.priority) }}>{t.priority}</span>
                        <span style={{ fontSize: 11, color: statusColor(t.status), fontWeight: 600 }}>{statusLabel(t.status)}</span>
                        {t.description && <span style={{ fontSize: 11, color: 'var(--neutral-400)' }}>{t.description.slice(0, 60)}{t.description.length > 60 ? '…' : ''}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function CalendarPage() {
  const { currentUser, updateStatus } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<CalUser[]>([]);
  const [view, setView] = useState<CalView>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddDate, setQuickAddDate] = useState('');
  const [quickAddMode, setQuickAddMode] = useState<'create' | 'moderator-request'>('create');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  const pushToast = useCallback((text: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(p => [...p, { id, text, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  const loadTasks = useCallback(() => {
    if (!currentUser) return;
    const url = `/api/tasks?userId=${currentUser.id}`;
    fetch(url).then(r => r.json()).then(data => { if (Array.isArray(data)) setTasks(data); }).catch(() => {});
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    loadTasks();
    fetch('/api/users').then(r => r.json()).then(data => { if (Array.isArray(data)) setUsers(data); }).catch(() => {});
  }, [currentUser, loadTasks]);

  const filteredTasks = useMemo(() => tasks.filter(t =>
    (filterStatus === 'all' || t.status === filterStatus) &&
    (filterPriority === 'all' || t.priority === filterPriority)
  ), [tasks, filterStatus, filterPriority]);

  const navigate = useCallback((dir: -1 | 0 | 1) => {
    if (dir === 0) { setCurrentDate(new Date()); return; }
    setCurrentDate(prev => {
      const d = new Date(prev);
      if (view === 'month') d.setMonth(d.getMonth() + dir);
      else if (view === 'week') d.setDate(d.getDate() + dir * 7);
      else d.setDate(d.getDate() + dir);
      return d;
    });
  }, [view]);

  const periodLabel = useCallback(() => {
    if (view === 'month') return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (view === 'week') {
      const days = getWeekDays(currentDate);
      const s = days[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const e = days[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return `${s} – ${e}`;
    }
    return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }, [view, currentDate]);

  async function handleQuickAdd(form: QuickAddForm) {
    const assignedById = form.assignedById || currentUser!.id;
    const timePart = form.allDay ? '00:00:00' : timeTo24(form.startTime);
    const dueIso = new Date(`${form.startDate}T${timePart}`).toISOString();

    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        dueDate: dueIso,
        priority: form.priority,
        status: form.status,
        busyness: form.busyness,
        assigneeIds: form.assigneeIds,
        assignedById,
        isRequest: form.isRequest,
      })
    });
    if (res.ok) {
      if (form.syncMyStatus && form.busyness) {
        updateStatus(form.busyness);
      }
      loadTasks();
      pushToast(form.isRequest ? 'Event request submitted!' : 'Event scheduled successfully!');
      setQuickAddOpen(false);
    } else {
      const err = await res.json().catch(() => ({}));
      pushToast(err.error || 'Failed to add event', 'error');
    }
  }

  async function handleEditSave(form: QuickAddForm) {
    if (!editingTask || !currentUser) return;
    const timePart = form.allDay ? '00:00:00' : timeTo24(form.startTime);
    const dueIso = new Date(`${form.startDate}T${timePart}`).toISOString();

    const res = await fetch(`/api/tasks/${editingTask.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        priority: form.priority,
        status: form.status,
        busyness: form.busyness,
        dueDate: dueIso,
        assigneeIds: form.assigneeIds,
        userId: currentUser.id,
      })
    });
    if (res.ok) {
      if (form.syncMyStatus && form.busyness) {
        updateStatus(form.busyness);
      }
      loadTasks();
      pushToast('Event updated!');
      setEditingTask(null);
      setDrawerOpen(false);
      setSelectedTask(null);
    } else {
      pushToast('Failed to update event', 'error');
    }
  }

  async function handleStatusUpdate(task: Task, status: TaskStatus, note: string) {
    if (!currentUser) return;
    const notes = note.trim()
      ? [...task.notes, `[${new Date().toLocaleDateString()} - ${currentUser?.fullName}] ${note.trim()}`]
      : task.notes;
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes, userId: currentUser.id })
    });
    if (res.ok) {
      loadTasks();
      setSelectedTask(prev => prev ? { ...prev, status, notes } : null);
      pushToast(status === 'pending' && task.status === 'requested' ? 'Event request approved!' : 'Status updated!');
    } else {
      pushToast('Failed to update', 'error');
    }
  }

  const today = toDateStr(new Date());

  if (!currentUser) return <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>;

  return (
    <>
      {/* Toasts */}
      <div className="toast-container">
        {toasts.map(t => <div key={t.id} className={`toast toast-${t.type}`}>{t.text}</div>)}
      </div>

      {/* Task Detail Drawer */}
      <TaskDrawer
        task={selectedTask}
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setSelectedTask(null); }}
        users={users}
        currentUserRole={currentUser.role}
        onStatusUpdate={handleStatusUpdate}
        onEdit={t => { setEditingTask(t); setDrawerOpen(false); }}
      />

      {/* Quick Add Modal (Outlook Event Details Screen) */}
      {quickAddOpen && (
        <TaskFormModal
          initialDate={quickAddDate}
          initialMode={quickAddMode}
          users={users}
          currentUser={currentUser}
          onClose={() => setQuickAddOpen(false)}
          onSave={handleQuickAdd}
        />
      )}

      {/* Edit Modal (Outlook Event Details Screen) */}
      {editingTask && (
        <TaskFormModal
          initialDate={editingTask.dueDate.slice(0, 10)}
          initialTask={editingTask}
          users={users}
          currentUser={currentUser}
          onClose={() => setEditingTask(null)}
          onSave={handleEditSave}
        />
      )}

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', zIndex: 119 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="cal-shell">
        {/* Sidebar */}
        <aside className={`cal-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <CalSidebar
            tasks={filteredTasks}
            filterStatus={filterStatus}
            filterPriority={filterPriority}
            onStatusFilter={setFilterStatus}
            onPriorityFilter={setFilterPriority}
            today={today}
            onTaskClick={t => { setSelectedTask(t); setDrawerOpen(true); setSidebarOpen(false); }}
            onClose={() => setSidebarOpen(false)}
          />
        </aside>

        {/* Main calendar area */}
        <div className="cal-main">
          {/* Topbar */}
          <div className="cal-topbar">
            {/* Mobile filter toggle */}
            <button className="cal-mobile-sidebar-btn" onClick={() => setSidebarOpen(p => !p)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/>
              </svg>
              Filters
            </button>

            {/* View tabs */}
            <div className="cal-view-tabs">
              {(['month', 'week', 'day'] as CalView[]).map(v => (
                <button key={v} className={`cal-view-tab ${view === v ? 'active' : ''}`} onClick={() => setView(v)}>
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>

            {/* Nav */}
            <div className="cal-nav-row">
              <button className="cal-nav-btn" onClick={() => navigate(-1)} aria-label="Previous">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button className="cal-nav-btn cal-today-btn" onClick={() => navigate(0)}>Today</button>
              <button className="cal-nav-btn" onClick={() => navigate(1)} aria-label="Next">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
              </button>
              <span className="cal-period-label">{periodLabel()}</span>
            </div>

            <div style={{ flex: 1 }} />

            {/* Action buttons with permission boundaries */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <UserStatusPicker />
              {currentUser.role === 'moderator' && (
                <button
                  className="btn btn-outline cal-add-btn"
                  onClick={() => {
                    setQuickAddDate(today);
                    setQuickAddMode('moderator-request');
                    setQuickAddOpen(true);
                  }}
                  title="Request Admin to assign or collaborate with other moderators"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  Request from Admin
                </button>
              )}
              <button
                className="btn btn-brand cal-add-btn"
                onClick={() => {
                  setQuickAddDate(today);
                  setQuickAddMode('create');
                  setQuickAddOpen(true);
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                {currentUser.role === 'user' ? 'Request Event' : 'Add Event'}
              </button>
            </div>
          </div>

          {/* Calendar body */}
          <div className="cal-view-area">
            {view === 'month' && (
              <MonthView
                tasks={filteredTasks}
                currentDate={currentDate}
                today={today}
                onDayClick={ds => { setQuickAddDate(ds); setQuickAddMode('create'); setQuickAddOpen(true); }}
                onTaskClick={t => { setSelectedTask(t); setDrawerOpen(true); }}
              />
            )}
            {view === 'week' && (
              <WeekView
                tasks={filteredTasks}
                currentDate={currentDate}
                today={today}
                onSlotClick={(ds) => { setQuickAddDate(ds); setQuickAddMode('create'); setQuickAddOpen(true); }}
                onTaskClick={t => { setSelectedTask(t); setDrawerOpen(true); }}
              />
            )}
            {view === 'day' && (
              <DayView
                tasks={filteredTasks}
                currentDate={currentDate}
                today={today}
                onSlotClick={() => { setQuickAddDate(today); setQuickAddMode('create'); setQuickAddOpen(true); }}
                onTaskClick={t => { setSelectedTask(t); setDrawerOpen(true); }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
