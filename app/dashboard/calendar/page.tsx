'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../lib/auth-context';

// ── Types ──────────────────────────────────────────────────────────────────
type CalView = 'month' | 'week' | 'day';
type TaskStatus = 'pending' | 'in-progress' | 'review' | 'done' | 'requested';
type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

interface Task {
  id: string; title: string; description: string;
  assigneeIds: string[]; assignedById: string;
  assignedByName?: string; assignedByRole?: string;
  status: TaskStatus; priority: TaskPriority;
  dueDate: string; createdAt: string; updatedAt: string; notes: string[];
}
interface CalUser { id: string; fullName: string; username: string; role: string; createdBy?: string; }

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

// ── Quick Add / Edit Modal ─────────────────────────────────────────────────
interface QuickAddForm {
  title: string; description: string; dueDate: string;
  priority: TaskPriority; status: TaskStatus; assigneeIds: string[];
  assignedById?: string;
  isRequest?: boolean;
}

function TaskFormModal({ initialDate, initialTask, users, currentUser, onClose, onSave }: {
  initialDate?: string;
  initialTask?: Task;
  users: CalUser[];
  currentUser: { id: string; role: string; fullName: string; createdBy?: string };
  onClose: () => void;
  onSave: (form: QuickAddForm) => void;
}) {
  const canAssign = currentUser.role !== 'user';
  const moderators = users.filter(u => u.role === 'moderator' || u.role === 'admin');
  const defaultModId = initialTask?.assignedById || 
    (currentUser.createdBy && moderators.some(m => m.id === currentUser.createdBy) ? currentUser.createdBy : moderators[0]?.id || currentUser.id);

  const [selectedModerator, setSelectedModerator] = useState<string>(defaultModId);

  const [form, setForm] = useState<QuickAddForm>({
    title: initialTask?.title ?? '',
    description: initialTask?.description ?? '',
    dueDate: initialTask?.dueDate?.slice(0, 10) ?? initialDate ?? toDateStr(new Date()),
    priority: initialTask?.priority ?? 'medium',
    status: initialTask?.status ?? (canAssign ? 'pending' : 'requested'),
    assigneeIds: initialTask?.assigneeIds ?? [currentUser.id],
    assignedById: defaultModId,
    isRequest: !canAssign,
  });
  const [submitted, setSubmitted] = useState(false);
  const setF = (k: keyof QuickAddForm, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  const toggleAssignee = (id: string) => {
    if (!canAssign) return;
    setForm(p => ({
      ...p,
      assigneeIds: p.assigneeIds.includes(id) ? p.assigneeIds.filter(x => x !== id) : [...p.assigneeIds, id]
    }));
  };

  const handleSave = () => {
    setSubmitted(true);
    if (!form.title.trim() || !form.dueDate) return;
    const finalAssigneeIds = canAssign ? (form.assigneeIds.length > 0 ? form.assigneeIds : [currentUser.id]) : [currentUser.id];
    const finalAssignedById = canAssign ? currentUser.id : selectedModerator;
    const finalStatus: TaskStatus = canAssign ? form.status : (initialTask?.status ?? 'requested');

    onSave({
      ...form,
      assigneeIds: finalAssigneeIds,
      assignedById: finalAssignedById,
      status: finalStatus,
      isRequest: !canAssign,
    });
  };

  const assignableUsers = currentUser.role === 'admin'
    ? users.filter(u => u.role === 'user' || u.role === 'moderator' || u.id === currentUser.id)
    : users.filter(u => u.id === currentUser.id || (u.role === 'user' && u.createdBy?.includes(currentUser.id)));

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title" style={{ fontSize: 17, fontWeight: 700 }}>
              {initialTask ? 'Edit Task' : canAssign ? 'Add Task to Calendar' : 'Request Task from Moderator'}
            </h3>
            {!canAssign && (
              <p style={{ margin: '3px 0 0 0', fontSize: 12, color: 'var(--neutral-400)' }}>
                Submit a task proposal for your moderator to review, schedule, and assign.
              </p>
            )}
          </div>
          <button className="btn-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="modal-body">
          <div className="field">
            <label className="label">Title <span style={{ color: 'var(--error)' }}>*</span></label>
            <input
              className="input"
              value={form.title}
              onChange={e => setF('title', e.target.value)}
              placeholder="e.g. Prepare Q4 Client Review presentation…"
              style={submitted && !form.title.trim() ? { borderColor: 'var(--error)' } : undefined}
            />
            {submitted && !form.title.trim() && <div style={{ fontSize: 12, color: 'var(--error)', marginTop: 4 }}>Title is required</div>}
          </div>
          <div className="field">
            <label className="label">Description <span style={{ fontSize: 12, color: 'var(--neutral-400)', fontWeight: 400 }}>(optional)</span></label>
            <textarea className="textarea" rows={2} value={form.description} onChange={e => setF('description', e.target.value)} placeholder="Details, requirements, or what needs review…" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: canAssign ? '1fr 1fr 1fr' : '1fr 1fr', gap: 12 }}>
            <div className="field" style={{ margin: 0 }}>
              <label className="label">Due Date <span style={{ color: 'var(--error)' }}>*</span></label>
              <input className="input" type="date" value={form.dueDate} onChange={e => setF('dueDate', e.target.value)} />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label className="label">Priority</label>
              <select className="select" value={form.priority} onChange={e => setF('priority', e.target.value as TaskPriority)}>
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🟠 High</option>
                <option value="critical">🔴 Critical</option>
              </select>
            </div>
            {canAssign && (
              <div className="field" style={{ margin: 0 }}>
                <label className="label">Status</label>
                <select className="select" value={form.status} onChange={e => setF('status', e.target.value as TaskStatus)}>
                  <option value="pending">⏳ Pending</option>
                  <option value="in-progress">🔄 In Progress</option>
                  <option value="review">👁️ Review</option>
                  <option value="done">✅ Done</option>
                </select>
              </div>
            )}
          </div>

          {/* Select Moderator if regular user is requesting a task */}
          {!canAssign && (
            <div className="field" style={{ marginTop: 14 }}>
              <label className="label">
                Select Moderator to Request From <span style={{ color: 'var(--error)' }}>*</span>
              </label>
              <select
                className="select"
                value={selectedModerator}
                onChange={e => setSelectedModerator(e.target.value)}
              >
                {moderators.length === 0 ? (
                  <option value="">No moderators available</option>
                ) : (
                  moderators.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.role === 'admin' ? '👑' : '⚡'} {m.fullName} ({m.role}) {m.id === currentUser.createdBy ? '— (Your Assigned Moderator)' : ''}
                    </option>
                  ))
                )}
              </select>
              <div style={{ fontSize: 11.5, color: 'var(--neutral-400)', marginTop: 5 }}>
                Your task request will be delivered to this moderator for review. Once approved, it will be scheduled into your calendar.
              </div>
            </div>
          )}

          {/* Assignees list for Admins / Moderators */}
          {canAssign && (
            <div className="field" style={{ marginTop: 14 }}>
              <label className="label">Assignees</label>
              <div style={{ maxHeight: 160, overflowY: 'auto', border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '6px 0' }}>
                {assignableUsers.map(u => (
                  <div
                    key={u.id}
                    onClick={() => toggleAssignee(u.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '7px 12px',
                      cursor: 'pointer', transition: 'background 0.15s',
                      background: form.assigneeIds.includes(u.id) ? 'var(--brand-50)' : 'transparent',
                    }}
                  >
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                      background: form.assigneeIds.includes(u.id) ? 'var(--brand-600)' : 'var(--neutral-200)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s',
                    }}>
                      {form.assigneeIds.includes(u.id) && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--neutral-800)' }}>{u.fullName}</span>
                    <span style={{ fontSize: 11, color: 'var(--neutral-400)', marginLeft: 'auto' }}>{u.role}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-brand" onClick={handleSave}>
            {initialTask ? 'Save Changes' : canAssign ? 'Add Task' : 'Submit Task Request'}
          </button>
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
  const { currentUser } = useAuth();
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
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        assignedById,
        dueDate: new Date(form.dueDate + 'T09:00:00').toISOString(),
      })
    });
    if (res.ok) {
      loadTasks();
      pushToast(currentUser?.role === 'user' ? 'Task request sent to moderator!' : 'Task added!');
      setQuickAddOpen(false);
    } else {
      pushToast('Failed to add task', 'error');
    }
  }

  async function handleEditSave(form: QuickAddForm) {
    if (!editingTask || !currentUser) return;
    const res = await fetch(`/api/tasks/${editingTask.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title, description: form.description,
        priority: form.priority, status: form.status,
        dueDate: new Date(form.dueDate + 'T09:00:00').toISOString(),
        assigneeIds: form.assigneeIds,
        userId: currentUser.id,
      })
    });
    if (res.ok) {
      loadTasks();
      pushToast('Task updated!');
      setEditingTask(null);
      setDrawerOpen(false);
      setSelectedTask(null);
    } else {
      pushToast('Failed to update task', 'error');
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
      pushToast(status === 'pending' && task.status === 'requested' ? 'Task request approved!' : 'Status updated!');
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

      {/* Quick Add Modal */}
      {quickAddOpen && (
        <TaskFormModal
          initialDate={quickAddDate}
          users={users}
          currentUser={currentUser}
          onClose={() => setQuickAddOpen(false)}
          onSave={handleQuickAdd}
        />
      )}

      {/* Edit Modal */}
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

            <button className="btn btn-brand cal-add-btn" onClick={() => { setQuickAddDate(today); setQuickAddOpen(true); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              {currentUser.role === 'user' ? 'Request Task' : 'Add Task'}
            </button>
          </div>

          {/* Calendar body */}
          <div className="cal-view-area">
            {view === 'month' && (
              <MonthView
                tasks={filteredTasks}
                currentDate={currentDate}
                today={today}
                onDayClick={ds => { setQuickAddDate(ds); setQuickAddOpen(true); }}
                onTaskClick={t => { setSelectedTask(t); setDrawerOpen(true); }}
              />
            )}
            {view === 'week' && (
              <WeekView
                tasks={filteredTasks}
                currentDate={currentDate}
                today={today}
                onSlotClick={(ds) => { setQuickAddDate(ds); setQuickAddOpen(true); }}
                onTaskClick={t => { setSelectedTask(t); setDrawerOpen(true); }}
              />
            )}
            {view === 'day' && (
              <DayView
                tasks={filteredTasks}
                currentDate={currentDate}
                today={today}
                onSlotClick={() => { setQuickAddDate(today); setQuickAddOpen(true); }}
                onTaskClick={t => { setSelectedTask(t); setDrawerOpen(true); }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
